#include "memmux.h";

#include "libavcodec/avcodec.h"
#include "libavformat/avformat.h"

AVFormatContext *fc = 0;
AVCodecContext* pcc;
int vi = -1, waitkey = 1;

typedef struct  {
    uint8_t* buf;
    int bytesSet;
} buffer_data;
buffer_data* out;

int write_packet (void *opaque, uint8_t *buf, int buf_size) {
    buffer_data* out = (buffer_data*)(opaque);
    memcpy(out->buf+out->bytesSet, buf, buf_size);
    out->bytesSet+=buf_size;
    return buf_size;
}

void close_stream(){
    printf("closing stream\n");
}

void open_stream(int w, int h, int fps, int br) {
    out = malloc(sizeof(buffer_data));
    out->bytesSet = 0;
    size_t buffer_size = 1024*64;
    out->buf = (uint8_t*)av_malloc(buffer_size);

    AVOutputFormat *of = av_guess_format( "mp4", 0, 0 );
    fc = avformat_alloc_context();
    AVStream *pst = avformat_new_stream( fc, 0 );
    vi = pst->index;

    void* outptr = (void*)out;
    AVIOContext* pIOCtx = avio_alloc_context(out->buf, buffer_size, 1, outptr, NULL, write_packet, NULL);

    fc->oformat = of;
    fc->pb = pIOCtx;
    fc->flags = AVFMT_FLAG_CUSTOM_IO;

   
    pcc = pst->codec;

    AVCodec c={0};
    c.type= AVMEDIA_TYPE_VIDEO;
    
    avcodec_get_context_defaults3( pcc, &c );
    pcc->codec_type = AVMEDIA_TYPE_VIDEO;

    pcc->bit_rate = br;
    pcc->width = w;
    pcc->height = h;
    pcc->time_base.num = 1;
    pcc->time_base.den = fps;
}
void add_frame(const void* p, int len ) {
    printf("writing---------------------------------\n"); 
    
   AVStream *pst = fc->streams[vi];

   // Init packet
   AVPacket pkt;
   av_init_packet( &pkt );
   pkt.stream_index = pst->index;
   pkt.data = (uint8_t*)p;
   pkt.size = len;

   pkt.dts = AV_NOPTS_VALUE;
   pkt.pts = AV_NOPTS_VALUE;

   av_interleaved_write_frame( fc, &pkt );
}