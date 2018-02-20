/*
 * Copyright (c) 2001 Fabrice Bellard
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * @file
 * video encoding with libavcodec API example
 *
 * @example encode_video.c
 */
#include "encode.h"


const char *filename, *codec_name;
const AVCodec *codec;
AVCodecContext *c= NULL;
int i, ret, x, y, frameIdx = 0;
FILE *f;
AVFrame *frame;
AVPacket *pkt;
uint8_t endcode[] = { 0, 0, 1, 0xb7 };

static void encode(AVFrame *frame)
{
    int ret;

    /* send the frame to the encoder */
    if (frame)
        printf("Send frame %3"PRId64"\n", frame->pts);

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

        printf("Write packet %3"PRId64" (size=%5d)\n", pkt->pts, pkt->size);
        fwrite(pkt->data, 1, pkt->size, f);
        av_packet_unref(pkt);
    }
}

void openStream(unsigned w, unsigned h, unsigned fps, unsigned bit_rate)
{

    filename = "file.mp4";
    codec_name = "libx264";

    codec = avcodec_find_encoder_by_name(codec_name);
    if (!codec) {
        fprintf(stderr, "Codec '%s' not found\n", codec_name);
        exit(1);
    }

    c = avcodec_alloc_context3(codec);
    if (!c) {
        fprintf(stderr, "Could not allocate video codec context\n");
        exit(1);
    }

    pkt = av_packet_alloc();
    if (!pkt)
        exit(1);

    /* put sample parameters */
    c->bit_rate = bit_rate;
    /* resolution must be a multiple of two */
    c->width = w;
    c->height = h;
    /* frames per second */
    c->time_base = (AVRational){1, fps};
    c->framerate = (AVRational){fps, 1};

    /* emit one intra frame every ten frames
     * check frame pict_type before passing frame
     * to encoder, if frame->pict_type is AV_PICTURE_TYPE_I
     * then gop_size is ignored and the output of encoder
     * will always be I frame irrespective to gop_size
     */
    c->gop_size = 10;
    c->max_b_frames = 1;
    c->pix_fmt = AV_PIX_FMT_YUV420P;

    if (codec->id == AV_CODEC_ID_H264)
        av_opt_set(c->priv_data, "preset", "slow", 0);

    /* open it */
    ret = avcodec_open2(c, codec, NULL);
    if (ret < 0) {
        fprintf(stderr, "Could not open codec: %s\n", av_err2str(ret));
        exit(1);
    }

    f = fopen(filename, "wb");
    if (!f) {
        fprintf(stderr, "Could not open %s\n", filename);
        exit(1);
    }

    frame = av_frame_alloc();
    if (!frame) {
        fprintf(stderr, "Could not allocate video frame\n");
        exit(1);
    }
    frame->format = c->pix_fmt;
    frame->width  = c->width;
    frame->height = c->height;

    ret = av_frame_get_buffer(frame, 32);
    if (ret < 0) {
        fprintf(stderr, "Could not allocate the video frame data\n");
        exit(1);
    }
}

void addFrame(){
    fflush(stdout);

    /* make sure the frame data is writable */
    ret = av_frame_make_writable(frame);
    if (ret < 0)
        exit(1);

    /* prepare a dummy image */
    /* Y */
    for (y = 0; y < c->height; y++) {
        for (x = 0; x < c->width; x++) {
            frame->data[0][y * frame->linesize[0] + x] = x + y + frameIdx * 3;
        }
    }

    /* Cb and Cr */
    for (y = 0; y < c->height/2; y++) {
        for (x = 0; x < c->width/2; x++) {
            frame->data[1][y * frame->linesize[1] + x] = 128 + y + frameIdx * 2;
            frame->data[2][y * frame->linesize[2] + x] = 64 + x + frameIdx * 5;
        }
    }

    frame->pts = frameIdx;
    encode(frame);
    frameIdx++;
}

void closeStream(){
    encode(NULL);
    fwrite(endcode, 1, sizeof(endcode), f);
    fclose(f);
    printf("closing stuff \n");
    avcodec_free_context(&c);
    av_frame_free(&frame);
    av_packet_free(&pkt);
}
