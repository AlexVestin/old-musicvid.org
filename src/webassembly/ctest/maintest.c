#include "avio_write.h"
#include "stdio.h"
#include <stdlib.h>

const int SECONDS = 100;

//DUMMY VIDEO
const int FPS = 30;
const int WIDTH = 1080;
const int HEIGHT = 720;
const int BIT_RATE = 4000000; 
const int NR_COLORS = 4;

//DUMMY AUDIO
const int SAMPLE_RATE = 44100;
const int CHANNELS = 2;

int main(int argc, char** argv) {
    open_stream(WIDTH,HEIGHT,FPS,BIT_RATE);
    
    int nr_samples = SAMPLE_RATE*CHANNELS*SECONDS;
    int16_t *soundbuffer = malloc(nr_samples * sizeof(int16_t));
    int t;
    for(t = 0; t < nr_samples -1; t++){
        soundbuffer[t] = 0;
    }
    set_audio(soundbuffer, CHANNELS, SAMPLE_RATE, nr_samples);

    uint8_t* buffer = malloc(WIDTH*HEIGHT*NR_COLORS);
    int i, j, int_max = 2147483647;

    
    for(j = 0; j < WIDTH*HEIGHT*NR_COLORS; j++){
        buffer[j] = (j*i)+i % 255;
        //buffer[j] = 0;        
    }
        //add_frame(buffer, WIDTH*HEIGHT*NR_COLORS);
    for(i = 0;i < SECONDS*FPS; i++){
        add_frame(buffer);
    }
    
    uint8_t* out;
    int size;  
    close_stream(&out, &size);

    FILE* out_file = fopen("fi1.mp4", "w");
    printf("out: %p size: %d\n", out, size);
    fwrite(out, size, 1, out_file);
    fclose(out_file);

    free_buffer();
    return 0;
}