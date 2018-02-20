#include "stdint.h"
#include <stdio.h>
#include <time.h>
#include <stdlib.h>

int temp = 10;
unsigned frameIdx = 0;
unsigned width, height, bitRate, fps;
FILE* file = NULL;

void init(unsigned width, unsigned height, unsigned channels, unsigned bitRate, unsigned fps, const char* filename) {
    file = fopen(filename, "wb");

}

int fos() {
    return !file;
}

FILE* closeStream(){
    fclose(file);
    return file;
}


void invertColor(uint8_t* in, unsigned width, unsigned height, unsigned channels, uint8_t* out){
    for(int i = 0; i < width*height*channels; i++){
        out[i] = 121;
    }
}

