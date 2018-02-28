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
const int NR_CLS = 4;

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

float* combine(int *audio_size) {
    int leftSize;
    int rightSize;
    float* left = get_audio_buf("left1.raw", &leftSize);
    float* right = get_audio_buf("right1.raw", &rightSize);

    int biggestSize = leftSize > rightSize ? leftSize : rightSize;
    float* combined = malloc(leftSize + rightSize);
    int i, j;

    
    for(i = 0; i < biggestSize / 2; i++ ){
        combined[i*2] = right[i];
        combined[(i*2) + 1] = left[i];
    }

    //TODO fix segfault
    //free(left);
    //free(right);

    *audio_size = leftSize + rightSize;
    return combined;
}

int main(int argc, char** argv) {
    int i, j, audio_size;

    open_video(WIDTH,HEIGHT,FPS,BIT_RATE);

    float* combined = combine(&audio_size);
    for(j = 0; j < 20; j++)
       printf("%.20f\n", *(combined + j));

    double seconds = audio_size / (double) (44100 * 2);
    open_audio( combined, audio_size, 44100, 2, 320000 );
    uint8_t* buffer = malloc(WIDTH*HEIGHT*NR_CLS);
    
    for(j = 0; j < WIDTH*HEIGHT*NR_CLS; j++){
        if(j < WIDTH*HEIGHT*NR_CLS/2)
            buffer[j] = (j+1) % 3 == 0 ? 100000 : 0;
    }
    for(i = 0;i < (int)seconds*FPS; i++){
        add_frame(buffer);
    }

    write_audio_frame();

    int size = close_stream();
    uint8_t* out = get_buffer();
    
    FILE* out_file = fopen("fi1.mp4", "w");
    printf("out: %p size: %d\n", out, size);
    fwrite(out, size, 1, out_file);
    fclose(out_file);
    free_buffer();
    return 0;
}