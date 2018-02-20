#include "encode.h"


const int FPS = 60;
const int WIDTH = 1080;
const int HEIGHT = 720;
const int BIT_RATE = 12000000; 

int main(int argc, char** argv) {
    openStream(WIDTH,HEIGHT,FPS,BIT_RATE);
    
    int i;
    for(i = 0;i < 600; i++)
        addFrame();
    
    closeStream();
    printf("here\n");
    return 0;
}