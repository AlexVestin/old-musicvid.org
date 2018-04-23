#include "muxer.h"
#include "encoder.h"

#include "stdio.h"
#include <stdlib.h>
#include <inttypes.h>
#include <time.h>

const int SECONDS = 2;

//DUMMY VIDEO
const int FPS = 30;
const int WIDTH = 2048;
const int HEIGHT = 1080;
const int BIT_RATE = 400000; 
const int NR_CLS = 4;
const int PRESET = 0;

int int_from_uint8_t(uint8_t* in) {
    return (int) in[0] << 0 | (int) in[1] << 8 | (int) in[2] << 16 | (int) in[3] << 24;
}

int main(int argc, char** argv) {
    int i, j, audio_size;
    double seconds = 10;

    muxer_video_init(WIDTH,HEIGHT,FPS,BIT_RATE,PRESET);
    encoder_init(WIDTH,HEIGHT,FPS,BIT_RATE,PRESET);
    
    write_header();

    int nr_frames = 1;

    clock_t start = clock(), diff;
    int k, frame_size = WIDTH*HEIGHT*NR_CLS;
    for(i = 0;i < (int)3*FPS; i++){
        uint8_t* buffer = malloc(frame_size * nr_frames);
        for(k = 0; k < nr_frames; k++) {
            for(j = 0; j < frame_size; j++){
                buffer[j + k*frame_size] = 0;

                //Spoof red at half the screen
                if(j < (frame_size / 2))
                    buffer[j + k*frame_size] = !(j % NR_CLS) ? 120 : 0;
            }
        }
        uint8_t* packets = 0;
        int nr_packets = encoder_add_frame(buffer, &packets); 
        
        int p;
        printf("nr packets: %d\n", nr_packets);
        for(p = 0; p < nr_packets; p++) {
            int dts         = int_from_uint8_t(packets);
            packets += sizeof(int);
            int pts         = int_from_uint8_t(packets); 
            packets += sizeof(int);
            int size        = int_from_uint8_t(packets); 
            packets += sizeof(int);
            uint8_t* data   = *packets;  
            packets += size;

            printf("in main dts : %d, pts: %d, size: %d \n", dts, pts, size);
            muxer_add_frame(data, dts, pts, size);
        }
    }

    diff = clock() - start;
    int msec = diff * 1000 / CLOCKS_PER_SEC;
    printf("--\n");
    printf("Time taken %d seconds %d milliseconds\n", msec/1000, msec%1000);
    printf("--\n");

    int size = close_stream();
    uint8_t* out = get_buffer();

    printf("pit\n");
    
    FILE* out_file = fopen("fi.mp4", "w");
    fwrite(out, size, 1, out_file);
    fclose(out_file);
    free_buffer();
    
    return 0;
}