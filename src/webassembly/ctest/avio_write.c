#include "avio_write.h"
#include <libavcodec/avcodec.h>
#include <libavformat/avformat.h>
#include <libavformat/avio.h>
#include <libavutil/file.h>
#include <libavutil/timestamp.h>
#include <libswscale/swscale.h>

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

//VIDEO
AVFrame *video_frame, *audio_frame;
int frameIdx = 0;
AVStream* video_stream, *audio_stream;
AVPacket *pkt;
static struct SwsContext *sws_context = NULL;
AVCodecContext *video_ctx, *audio_ctx;

static struct SwsContext *audio_sws_context = NULL;
int16_t* audio_buf;
int audio_sr;
int audio_ch;

static int64_t seek (void *opaque, int64_t offset, int whence) {
    struct buffer_data *bd = (struct buffer_data *)opaque;
    switch(whence){
        case SEEK_SET:
            bd->ptr = bd->buf + offset;
            return bd->ptr;
            break;
        case SEEK_CUR:
            bd->ptr += offset;
            break;
        case SEEK_END:
            bd->ptr = (bd->buf + bd->size) + offset;
            return bd->ptr;
            break;
        case AVSEEK_SIZE:
            return bd->size;
            break;
        default:
            printf("none of the above: %d\n", whence);
    }
    return 1;
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
    //printf("write packet pkt_size:%d used_buf_size:%zu buf_size:%zu buf_room:%zu\n", buf_size, bd->ptr-bd->buf, bd->size, bd->room);

    memcpy(bd->ptr, buf, buf_size);
    bd->ptr  += buf_size;
    bd->room -= buf_size;
    return buf_size;
}

static void encode(AVFrame *frame, AVCodecContext* cod, AVStream* out) {    

    ret = avcodec_send_frame(cod, frame);
    if (ret < 0) {
        fprintf(stderr, "Error sending a frame for encoding\n");
        exit(1);
    }

    while (ret >= 0) {
        ret = avcodec_receive_packet(cod, pkt);
        if (ret == AVERROR(EAGAIN) || ret == AVERROR_EOF)
            return;
        else if (ret < 0) {
            fprintf(stderr, "Error during encoding\n");
            exit(1);
        }
        pkt->stream_index = out->index;      
        av_packet_rescale_ts(pkt, cod->time_base, out->time_base);
        av_interleaved_write_frame(ofmt_ctx, pkt);
        av_packet_unref(pkt);
    }
}

void set_frame_yuv_from_rgb(uint8_t *rgb) {
    const int in_linesize[1] = { 4 * video_ctx->width };
    sws_scale(sws_context, (const uint8_t * const *)&rgb, in_linesize, 0,
    video_ctx->height, video_frame->data, video_frame->linesize);
}


void add_frame(uint8_t* buffer, int len){
    ret = av_frame_make_writable(video_frame);
    set_frame_yuv_from_rgb(buffer);
    video_frame->pts = frameIdx++;
    encode(video_frame, video_ctx, video_stream);
}

void open_stream(int w, int h, int fps, int br){
    AVOutputFormat* of = av_guess_format("mp4", 0, 0);

    bd.ptr  = bd.buf = av_malloc(bd_buf_size);
    if (!bd.buf) {
        ret = AVERROR(ENOMEM);
    }
    bd.size = bd.room = bd_buf_size;

    avio_ctx_buffer = av_malloc(avio_ctx_buffer_size);
    if (!avio_ctx_buffer) {
        ret = AVERROR(ENOMEM);
        exit(1);
    }
    avio_ctx = avio_alloc_context(avio_ctx_buffer, avio_ctx_buffer_size, 1, &bd, NULL, &write_packet, &seek);
    if (!avio_ctx) {
        ret = AVERROR(ENOMEM);
        exit(1);
    }

    ret = avformat_alloc_output_context2(&ofmt_ctx, of, NULL, NULL);
    if (ret < 0) {
        fprintf(stderr, "Could not create output context\n");
        exit(1);
    }
    
    AVCodec* video_codec = avcodec_find_encoder_by_name(codec_name);
    if (!video_codec) {
        fprintf(stderr, "Codec '%s' not found\n", codec_name);
        exit(1);
    }

    video_ctx = avcodec_alloc_context3(video_codec);
    video_ctx->width = 1080;
    video_ctx->height = 720;
    video_ctx->time_base.num = 1;
    video_ctx->time_base.den = 30;
    video_ctx->bit_rate = 400000; 
    
    video_ctx->gop_size = 10;
    video_ctx->max_b_frames = 1;
    video_ctx->pix_fmt = AV_PIX_FMT_YUV420P;
    //av_opt_set(video_ctx->priv_data, "preset", "slow", 0);
    if(avcodec_open2(video_ctx, video_codec, NULL) < 0) {
        printf("couldnt open codec\n");
        exit(1);
    }

    // Frame initalization
    video_frame = av_frame_alloc();
    video_frame->format = video_ctx->pix_fmt;
    video_frame->width  = w;
    video_frame->height = h;
    ret = av_frame_get_buffer(video_frame, 32);

    //Packet init
    pkt = av_packet_alloc();
    video_stream = avformat_new_stream(ofmt_ctx, video_ctx);  
    if(!video_stream)
        printf(stderr, "error making stream\n");

    
    ofmt_ctx->pb = avio_ctx;
    ofmt_ctx->flags |= AVFMT_FLAG_CUSTOM_IO;
    ofmt_ctx->oformat = of;
    video_stream->codec->codec_tag = 0;

    video_stream->time_base = video_ctx->time_base;
    ret = avcodec_parameters_from_context(video_stream->codecpar, video_ctx);
    
    //av_dump_format(ofmt_ctx, 0, "Memory", 1);
    ret = avformat_write_header(ofmt_ctx, NULL);
    if (ret < 0) {
        fprintf(stderr, "Error occurred when opening output file\n");
        exit(1);
    }

    //rescaling
    sws_context = sws_getCachedContext(
            sws_context,
            video_ctx->width, video_ctx->height, 
            AV_PIX_FMT_RGB8,
            video_ctx->width, video_ctx->height, 
            AV_PIX_FMT_YUV420P,
            0, NULL, NULL, NULL
    );
}    
    
void close_stream(uint8_t** out, int* size){
    encode(NULL, video_ctx, video_stream);
    av_write_trailer(ofmt_ctx);
    /* close output */
    avformat_free_context(ofmt_ctx);
    av_freep(&avio_ctx->buffer);
    av_free(avio_ctx);

    printf("buf: %p size: %d\n", bd.buf, bd.size);
    *out = bd.buf;
    *size = bd.size;
}

void free_buffer(){
    av_free(bd.buf);
    if (ret < 0 && ret != AVERROR_EOF) {
        fprintf(stderr, "Error occurred: %s\n", av_err2str(ret));
    }
}

static AVFrame *alloc_audio_frame(int nb_samples) {
    AVFrame *audio_frame = av_frame_alloc();
    int ret;

    if (!audio_frame) {
        fprintf(stderr, "Error allocating an audio frame\n");
        exit(1);
    }

    audio_frame->format           = audio_ctx->sample_fmt;
    audio_frame->channel_layout   = audio_ctx->channel_layout;
    audio_frame->sample_rate      = audio_ctx->sample_rate;
    audio_frame->nb_samples       = nb_samples;

    if(nb_samples){
        ret = av_frame_get_buffer(audio_frame, 0);
        if (ret < 0) {
            fprintf(stderr, "Error allocating an audio buffer\n");
            exit(1);
        }
    }
    
    
    return audio_frame;
}

static int check_sample_fmt(const AVCodec *codec, enum AVSampleFormat sample_fmt){
    const enum AVSampleFormat *p = codec->sample_fmts;
    while (*p != AV_SAMPLE_FMT_NONE) {
        if (*p == sample_fmt)
            return 1;
        p++;
    }
    return 0;
}


void set_audio(int16_t* buf, const int sr, const int ch, const int sz){
    /*
    AVCodec* ac = avcodec_find_encoder(AV_CODEC_ID_AAC);
    audio_stream = avformat_new_stream(ofmt_ctx, NULL);
    audio_stream->id = ofmt_ctx->nb_streams-1;
    audio_ctx = avcodec_alloc_context3(ac);

    audio_ctx->bit_rate = 320000;
    audio_ctx->sample_rate = sr;
    if (ac->supported_samplerates) {
        audio_ctx->sample_rate = ac->supported_samplerates[0];
        for (i = 0; ac->supported_samplerates[i]; i++) {
            if (ac->supported_samplerates[i] == sr)
                audio_ctx->sample_rate = sr;
        }
    }
    audio_ctx->channels = ch;
    audio_ctx->channel_layout = AV_CH_LAYOUT_STEREO;
    if (ac->channel_layouts) {
        audio_ctx->channel_layout = ac->channel_layouts[0];
        for (i = 0; ac->channel_layouts[i]; i++) {
            if (ac->channel_layouts[i] == AV_CH_LAYOUT_STEREO)
                audio_ctx->channel_layout = AV_CH_LAYOUT_STEREO;
        }
    }
    audio_ctx->channels  = av_get_channel_layout_nb_channels(audio_ctx->channel_layout);
    printf("%d %d \n", audio_ctx->sample_rate,audio_ctx->channels);

    audio_ctx->channel_layout = AV_CH_LAYOUT_STEREO;
    
    audio_ctx->sample_fmt = AV_SAMPLE_FMT_FLTP;
    printf("supported: %d\n", check_sample_fmt(ac, AV_SAMPLE_FMT_FLTP));

    audio_stream->time_base = (AVRational){1, audio_ctx->sample_rate};

    ret = avcodec_open2(audio_ctx, ac, NULL);
    if (ret < 0) {
        fprintf(stderr, "Could not open audio codec: %s\n", av_err2str(ret));
        exit(1);
    }

    int nb_samples;
    if (audio_ctx->codec->capabilities & AV_CODEC_CAP_VARIABLE_FRAME_SIZE)
        nb_samples = 10000;
    else
        nb_samples = audio_ctx->frame_size;

    audio_frame = alloc_audio_frame(nb_samples);

    ret = avcodec_parameters_from_context(audio_stream->codecpar, audio_ctx);
    if (ret < 0) {
        fprintf(stderr, "Could not copy the stream parameters\n");
        exit(1);
    }

    audio_sws_context = swr_alloc();
    if (!audio_sws_context) {
        fprintf(stderr, "Could not allocate resampler context\n");
        exit(1);
    }

    av_opt_set_int       (audio_sws_context, "in_channel_count",   audio_ctx->channels,       0);
    av_opt_set_int       (audio_sws_context, "in_sample_rate",     audio_ctx->sample_rate,    0);
    av_opt_set_sample_fmt(audio_sws_context, "in_sample_fmt",      AV_SAMPLE_FMT_S16,         0);
    av_opt_set_int       (audio_sws_context, "out_channel_count",  audio_ctx->channels,       0);
    av_opt_set_int       (audio_sws_context, "out_sample_rate",    audio_ctx->sample_rate,    0);
    av_opt_set_sample_fmt(audio_sws_context, "out_sample_fmt",     audio_ctx->sample_fmt,     0);

    if ((ret = swr_init(audio_sws_context)) < 0) {
        fprintf(stderr, "Failed to initialize the resampling context\n");
        exit(1);
    }
    */
}