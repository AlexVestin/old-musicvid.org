#include "encoder.h"
#include <libavcodec/avcodec.h>
#include <libavformat/avformat.h>

#include <libavformat/avio.h>
#include <libavutil/imgutils.h>
#include <libswresample/swresample.h>
#include <libavutil/opt.h>

int retval = 0;
const char* codec_name = "libx264";

//VIDEO
AVFrame *video_frame;
int encoder_frameIdx = 0;

AVPacket *pkt;

static struct SwsContext *sws_context = NULL;
AVCodecContext *video_ctx;
const int NR_COLORS = 4;

int encode(AVFrame* frame, uint8_t* packets) {
    int nr_packets = 0;
    uint32_t size = 0;
    
    retval = avcodec_send_frame(video_ctx, frame);
    if (retval < 0) {
        //printf(stderr, "Error sending a frame for encoding\n");
        exit(1);
    }

    while (retval >= 0) {
        retval = avcodec_receive_packet(video_ctx, pkt);
        if (retval == AVERROR(EAGAIN) || retval == AVERROR_EOF){
            av_packet_unref(pkt);
            return nr_packets;
        }
        else if (retval < 0) {
            exit(1);
        }
        
        nr_packets++;
        int end = size;
        //packet data, and then dts/pts/size ints
        size += pkt->size + 12;
        packets = realloc(packets, size); 

        memcpy(packets + end, &pkt->dts, sizeof(int));
        memcpy(packets + end + 4, &pkt->pts, sizeof(int)); 
        memcpy(packets + end + 8, &pkt->size, sizeof(int));
        memcpy(packets + end + 12, pkt->data, pkt->size);        
            }

    return nr_packets;
}

void flip_vertically(uint8_t *pixels) {
    const size_t width = video_ctx->width;
    const size_t height = video_ctx->height;
    
    const size_t stride = width * NR_COLORS;
    uint8_t *row = malloc(stride);
    uint8_t *low = pixels;
    uint8_t *high = &pixels[(height - 1) * stride];

    for (; low < high; low += stride, high -= stride) {
        memcpy(row, low, stride);
        memcpy(low, high, stride);
        memcpy(high, row, stride);
    }
    free(row);
}

void rgb2yuv420p(uint8_t *destination, uint8_t *rgb, size_t width, size_t height) {
    size_t image_size = width * height;
    size_t upos = image_size;
    size_t vpos = upos + upos / 4;
    size_t i = 0;
    uint8_t r, g, b;

    size_t idx;

    for( size_t line = 0; line < height; ++line ) {
        if( !(line % 2) ) {
            for( size_t x = 0; x < width; x += 2 )
            {
                r = rgb[NR_COLORS * i];
                g = rgb[NR_COLORS * i + 1];
                b = rgb[NR_COLORS * i + 2];

        
                destination[i++] = ((66*r + 129*g + 25*b) >> 8) + 16;

                destination[upos++] = ((-38*r + -74*g + 112*b) >> 8) + 128;
                destination[vpos++] = ((112*r + -94*g + -18*b) >> 8) + 128;

                r = rgb[NR_COLORS * i];
                g = rgb[NR_COLORS * i + 1];
                b = rgb[NR_COLORS * i + 2];

                destination[i++] = ((66*r + 129*g + 25*b) >> 8) + 16;
            }
        }else {
            for( size_t x = 0; x < width; x += 1 )
            {
                r = rgb[NR_COLORS * i];
                g = rgb[NR_COLORS * i + 1];
                b = rgb[NR_COLORS * i + 2];

                destination[i++] = ((66*r + 129*g + 25*b) >> 8) + 16;
            }
        }
    }  
}

int encoder_add_frame(uint8_t* frame, uint8_t* packets, int* pkt_info){     
    packets = malloc(4);
    int i, frame_size = video_ctx->width*video_ctx->height*NR_COLORS;
    flip_vertically(frame);
    retval = av_frame_make_writable(video_frame);

    // ~15% faster than sws_scale
    int size = (video_ctx->width * video_ctx->height * 3) / 2;
    uint8_t* yuv_buffer = malloc(size);
    rgb2yuv420p(yuv_buffer, frame, video_ctx->width, video_ctx->height);
    av_image_fill_arrays (
        (AVPicture*)video_frame->data,
        video_frame->linesize, 
        yuv_buffer, 
        video_frame->format, 
        video_frame->width, 
        video_frame->height, 
        1
    );

    video_frame->pts = encoder_frameIdx++;
    int ed =encode(video_frame, packets, pkt_info) ;
    
    free(yuv_buffer);
    free(frame);
}

void encoder_init(int w, int h, int fps, int br, int preset_idx){
    AVCodec* video_codec = avcodec_find_encoder_by_name(codec_name);
    if (!video_codec) {
        printf(stderr, "Codec '%s' not found\n", codec_name);
        exit(1);
    }
   
    video_ctx = avcodec_alloc_context3(video_codec);
    video_ctx->width = w;
    video_ctx->height = h;
    video_ctx->time_base.num = 1;
    video_ctx->time_base.den = fps;
    video_ctx->bit_rate = br; 
    
    video_ctx->gop_size = 10;
    video_ctx->max_b_frames = 1;
    video_ctx->pix_fmt = AV_PIX_FMT_YUV420P;

    const char *presets[] = {
        "ultrafast",
        "veryfast",
        "fast",
        "medium",
        "slow",
        "veryslow"
    };

    av_opt_set(video_ctx->priv_data, "preset", presets[preset_idx], 0);
    if(avcodec_open2(video_ctx, video_codec, NULL) < 0) {
        printf("couldnt open codec\n");
        exit(1);
    }

    // Frame initalization
    video_frame = av_frame_alloc();
    video_frame->format = video_ctx->pix_fmt;
    video_frame->width  = w;
    video_frame->height = h;
    retval = av_frame_get_buffer(video_frame, 0);

    pkt = av_packet_alloc();
    if(!pkt){
        printf("error packet\n");
        exit(1);
    }
} 
