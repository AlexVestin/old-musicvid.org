#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <math.h>

#include <libavutil/avassert.h>
#include <libavutil/channel_layout.h>
#include <libavutil/opt.h>
#include <libavutil/mathematics.h>
#include <libavutil/timestamp.h>
#include <libavformat/avformat.h>
#include <libswscale/swscale.h>
#include <libswresample/swresample.h>

typedef struct OutputStream {
    AVStream *st;
    AVCodecContext *enc;

    /* pts of the next frame that will be generated */
    int64_t next_pts;
    int samples_count;

    AVFrame *frame;
    AVFrame *tmp_frame;

    struct SwsContext *sws_ctx;
    struct SwrContext *swr_ctx;
} OutputStream;

AVFrame *alloc_picture(enum AVPixelFormat pix_fmt, int width, int height);
void open_video(AVFormatContext *oc, AVCodec *video_codec, OutputStream *ost, AVDictionary *opt_arg);
void add_stream(OutputStream *ost, AVFormatContext *oc, AVCodec **codec, enum AVCodecID codec_id);
void openStream(unsigned width, unsigned heigth, unsigned fps, unsigned bitRate);
void addFrame();
void closeStream();


