#include "avio_write.h"
#include <libavcodec/avcodec.h>
#include <libavformat/avformat.h>
#include <libavformat/avio.h>
#include <libavutil/file.h>
#include <libavutil/timestamp.h>

#define AV_CODEC_FLAG_GLOBAL_HEADER (1 << 22)
#define CODEC_FLAG_GLOBAL_HEADER AV_CODEC_FLAG_GLOBAL_HEADER
#define AVFMT_RAWPICTURE 0x0020

struct buffer_data {
    uint8_t *buf;
    size_t size;
    uint8_t *ptr;
    size_t room; ///< size left in the buffer
};

AVFormatContext *ofmt_ctx = NULL;
AVIOContext *avio_ctx = NULL;
uint8_t *avio_ctx_buffer = NULL;
size_t avio_ctx_buffer_size = 4096;
char *in_filename = NULL;
char *out_filename = NULL;
int i, ret = 0;
struct buffer_data bd = { 0 };
const size_t bd_buf_size = 1024;
const char* codec_name = "libx264";

//USER
AVFrame* frame;
int frameIdx = 0;
AVStream* out_stream;
AVPacket *pkt;
static struct SwsContext *sws_context = NULL;
AVCodecContext *c;

static int64_t seek (void *opaque, int64_t offset, int whence) {
    printf("#-----\n");
    return 0;
}

static void log_packet(const AVFormatContext *fmt_ctx, const AVPacket *pkt, const char *tag)
{
    AVRational *time_base = &fmt_ctx->streams[pkt->stream_index]->time_base;
    printf("%s: pts:%s pts_time:%s dts:%s dts_time:%s duration:%s duration_time:%s stream_index:%d\n",
           tag,
           av_ts2str(pkt->pts), av_ts2timestr(pkt->pts, time_base),
           av_ts2str(pkt->dts), av_ts2timestr(pkt->dts, time_base),
           av_ts2str(pkt->duration), av_ts2timestr(pkt->duration, time_base),
           pkt->stream_index);
}

static int write_packet(void *opaque, uint8_t *buf, int buf_size) {
    struct buffer_data *bd = (struct buffer_data *)opaque;
    while (buf_size > bd->room) {
        int64_t offset = bd->ptr - bd->buf;
        bd->buf = av_realloc_f(bd->buf, 2, bd->size);
        if (!bd->buf)
            return AVERROR(ENOMEM);
        bd->size *= 2;
        bd->ptr = bd->buf + offset;
        bd->room = bd->size - offset;
    }
    printf("write packet pkt_size:%d used_buf_size:%zu buf_size:%zu buf_room:%zu\n", buf_size, bd->ptr-bd->buf, bd->size, bd->room);

    memcpy(bd->ptr, buf, buf_size);
    bd->ptr  += buf_size;
    bd->room -= buf_size;

    return buf_size;
}

static void encode(AVFrame *frame) {    

    ret = avcodec_send_frame(c, frame);
    if (ret < 0) {
        fprintf(stderr, "Error sending a frame for encoding\n");
        exit(1);
    }

    while (ret >= 0) {
        ret = avcodec_receive_packet(c, pkt);
        if (ret == AVERROR(EAGAIN) || ret == AVERROR_EOF)
            return;
        else if (ret < 0) {
            fprintf(stderr, "Error during encoding\n");
            exit(1);
        }
 
        pkt->stream_index = out_stream->index;       
        av_interleaved_write_frame(ofmt_ctx, pkt);
        av_packet_unref(pkt);
    }
}

void set_frame_yuv_from_rgb(uint8_t *rgb) {
    const int in_linesize[1] = { 4 * c->width };
    sws_scale(sws_context, (const uint8_t * const *)&rgb, in_linesize, 0,
    c->height, frame->data, frame->linesize);
}


void add_frame(uint8_t* buffer, int len){
    ret = av_frame_make_writable(frame);
    set_frame_yuv_from_rgb(buffer);
    frame->pts = frameIdx++;
    encode(frame);
}

void open_stream(int w, int h, int fps, int br){
    AVOutputFormat* of = av_guess_format("mp4", 0, 0);

    bd.ptr  = bd.buf = av_malloc(bd_buf_size);
    if (!bd.buf) {
        ret = AVERROR(ENOMEM);
    }
    bd.size = bd.room = bd_buf_size;
    printf("%d\n", bd.size);

    avio_ctx_buffer = av_malloc(avio_ctx_buffer_size);
    if (!avio_ctx_buffer) {
        ret = AVERROR(ENOMEM);
        close_stream();
    }
    avio_ctx = avio_alloc_context(avio_ctx_buffer, avio_ctx_buffer_size, 1, &bd, NULL, &write_packet, &seek);
    if (!avio_ctx) {
        ret = AVERROR(ENOMEM);
        close_stream();
    }

    ret = avformat_alloc_output_context2(&ofmt_ctx, of, NULL, NULL);
    if (ret < 0) {
        fprintf(stderr, "Could not create output context\n");
        close_stream();
    }
    
    AVCodec* video_codec = avcodec_find_encoder_by_name(codec_name);
    if (!video_codec) {
        fprintf(stderr, "Codec '%s' not found\n", codec_name);
        exit(1);
    }

    c = avcodec_alloc_context3(video_codec);
    c->width = 1080;
    c->height = 720;
    c->time_base.num = 1;
    c->time_base.den = 30;
    c->bit_rate = 400000; 
    
    c->gop_size = 10;
    c->max_b_frames = 1;
    c->pix_fmt = AV_PIX_FMT_YUV420P;
    av_opt_set(c->priv_data, "preset", "slow", 0);
    if(avcodec_open2(c, video_codec, NULL) < 0) {
        printf("couldnt open codec\n");
        exit(1);
    }

    // Frame initalization
    frame = av_frame_alloc();
    frame->format = c->pix_fmt;
    frame->width  = w;
    frame->height = h;
    ret = av_frame_get_buffer(frame, 32);

    //Packet init
    pkt = av_packet_alloc();


    out_stream = avformat_new_stream(ofmt_ctx, c);  
    if(!out_stream)
        printf(stderr, "error making stream\n");

    
    if(!of){
        printf("not of\n-----------------------------------------");
    }
    ofmt_ctx->pb = avio_ctx;
    ofmt_ctx->flags |= AVFMT_FLAG_CUSTOM_IO;
    ofmt_ctx->oformat = of;
    out_stream->codec->codec_tag = 0;

    ret = avcodec_parameters_from_context(out_stream->codecpar, c);
    
    av_dump_format(ofmt_ctx, 0, "Memory", 1);
    ret = avformat_write_header(ofmt_ctx, NULL);
    if (ret < 0) {
        fprintf(stderr, "Error occurred when opening output file\n");
        close_stream();
    }

    //rescaling
    sws_context = sws_getCachedContext(
            sws_context,
            c->width, c->height, 
            AV_PIX_FMT_RGB32,
            c->width, c->height, 
            AV_PIX_FMT_YUV420P,
            0, NULL, NULL, NULL
    );
}    
    
void close_stream(){
    encode(NULL);
    av_write_trailer(ofmt_ctx);
    /* close output */
    avformat_free_context(ofmt_ctx);
    av_freep(&avio_ctx->buffer);
    av_free(avio_ctx);
    


    FILE* out_file = fopen("file.mp4", "w");
    printf("%d\n", bd.size);
    fwrite(bd.buf, bd.size, 1, out_file);
    fclose(out_file);

    av_free(bd.buf);
    if (ret < 0 && ret != AVERROR_EOF) {
        fprintf(stderr, "Error occurred: %s\n", av_err2str(ret));
    }
}