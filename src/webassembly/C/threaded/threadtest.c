#include "avio_write.h"
#include "stdio.h"
#include <stdlib.h>
#include <inttypes.h>

#include <time.h>


const int SECONDS = 2;

//DUMMY VIDEO
const int FPS = 30;
const int WIDTH = 1280;
const int HEIGHT = 720;
const int BIT_RATE = 400000; 
const int NR_CLS = 4;

//DUMMY AUDIO
const int SAMPLE_RATE = 44100;
const int CHANNELS = 2;



int main(int argc, char** argv) {
    int i, j, audio_size;
    double seconds = 10;

    muxer_video_init(WIDTH,HEIGHT,FPS,BIT_RATE);
    encoder_init(WIDTH,HEIGHT,FPS,BIT_RATE);
    
    write_header();

    clock_t start = clock(), diff;
    int i;
    for(i = 0;i < (int)20*FPS; i++){
        uint8_t* buffer = malloc(WIDTH*HEIGHT*NR_CLS * 10);
        for(j = 0; j < WIDTH*HEIGHT*NR_CLS; j++){
        buffer[j] = 0;
        //Spoof red at half the screen
        
        if(j < (WIDTH*HEIGHT*NR_CLS)/2)
            buffer[j] = !(j % NR_CLS) ? 255 : 0;
        }
        add_frame(buffer);
    }
    diff = clock() - start;
    int msec = diff * 1000 / CLOCKS_PER_SEC;
    printf("Time taken %d seconds %d milliseconds\n", msec/1000, msec%1000);

    //write_audio_frame();

    int size = close_stream();
    uint8_t* out = get_buffer();
    
    FILE* out_file = fopen("fi1.mp4", "w");
    fwrite(out, size, 1, out_file);
    fclose(out_file);
    free_buffer();
    return 0;
}