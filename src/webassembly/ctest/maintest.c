#include "avio_write.h"
#include "stdio.h"
#include <stdlib.h>

const int FPS = 60;
const int WIDTH = 1080;
const int HEIGHT = 720;
const int BIT_RATE = 8000000; 
const int NR_COLORS = 4;

int main(int argc, char** argv) {
    open_stream(WIDTH,HEIGHT,FPS,BIT_RATE);
    uint8_t* buffer = malloc(WIDTH*HEIGHT*NR_COLORS);
    int i, j, int_max = 2147483647;


    for(i = 0;i < 300; i++){
        for(j = 0; j < WIDTH*HEIGHT*NR_COLORS; j++){
            //buffer[j] = (j*i)+i % int_max;
            buffer[j] = 0;        
        }
           
        add_frame(buffer, WIDTH*HEIGHT*NR_COLORS);
    }
    
    close_stream();
    return 0;
}