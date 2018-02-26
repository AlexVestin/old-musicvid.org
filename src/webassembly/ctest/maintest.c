#include "avio_write.h"
#include "stdio.h"
#include <stdlib.h>

const int SECONDS = 30;

//DUMMY VIDEO
const int FPS = 30;
const int WIDTH = 400;
const int HEIGHT = 400;
const int BIT_RATE = 400000; 
const int NR_COLORS = 4;

//DUMMY AUDIO
const int SAMPLE_RATE = 44100;
const int CHANNELS = 2;

int main(int argc, char** argv) {
    open_stream(WIDTH,HEIGHT,FPS,BIT_RATE);
    uint8_t* buffer = malloc(WIDTH*HEIGHT*NR_COLORS);
    int i, j;

    
    for(j = 0; j < WIDTH*HEIGHT*NR_COLORS; j++){
        //buffer[j] = j % 255;
        printf("%d\n", j % 255);
        buffer[j] = 255;        
    }
        //add_frame(buffer, WIDTH*HEIGHT*NR_COLORS);
    for(i = 0;i < SECONDS*FPS; i++){
        add_frame(buffer);
    }
    
    uint8_t* out;
    int size = close_stream(&out);

    FILE* out_file = fopen("fi1.mp4", "w");
    printf("out: %p size: %d\n", out, size);
    fwrite(out, size, 1, out_file);
    fclose(out_file);
    free_buffer();
    return 0;
}