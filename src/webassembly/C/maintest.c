#include "avio_write.h"
#include "stdio.h"
#include <stdlib.h>
#include <inttypes.h>

const int SECONDS = 2;

//DUMMY VIDEO
const int FPS = 30;
const int WIDTH = 400;
const int HEIGHT = 400;
const int BIT_RATE = 400000; 
const int NR_CLS = 3;

//DUMMY AUDIO
const int SAMPLE_RATE = 44100;
const int CHANNELS = 2;

float* get_audio_buf(const char* filename, int *fs){
    FILE* f = fopen(filename, "rb");
    
    fseek(f, 0, SEEK_END);
    int size = ftell(f) / sizeof(float);
    fseek(f, 0, SEEK_SET);

    float* buf = malloc(sizeof(float) * size);
    int bytes_read = fread(buf, sizeof(float), size, f);
    if(bytes_read != size){
        printf("ERROR READING FILE\n");
        exit(1);
    }
    *fs = size;
    fclose(f);
    return buf;   
}

int main(int argc, char** argv) {
    int i, j, audio_size;
    double seconds = 10;

    open_video(WIDTH,HEIGHT,FPS,BIT_RATE);

    int leftSize, rightSize;
    float* left = get_audio_buf("right1.raw", &leftSize);
    float* right = get_audio_buf("left1.raw", &rightSize);
    open_audio( left, right, leftSize, 44100, 2, 320000 );
    seconds = (leftSize+rightSize) / (double) (44100 * 2);

    write_header();
    for(i = 0;i < (int)10*FPS; i++){
        uint8_t* buffer = malloc(WIDTH*HEIGHT*NR_CLS);
        for(j = 0; j < WIDTH*HEIGHT*NR_CLS; j++){
        buffer[j] = 0;
        //Spoof red at half the screen
        if(j < WIDTH*HEIGHT*NR_CLS/2)
            buffer[j] = !(j % 3) ? 255 : 0;
        }
        add_frame(buffer);
    }

    write_audio_frame();

    int size = close_stream();
    uint8_t* out = get_buffer();
    
    FILE* out_file = fopen("fi1.mp4", "w");
    fwrite(out, size, 1, out_file);
    fclose(out_file);
    free_buffer();
    return 0;
}