#include <stdio.h>
#include <stdint.h>
#include "kiss_fft.h"
#include "kiss_fftr.h"

#define PI 3.141592653589793238462643383

const int N = 1024;
const int NR_BARS = 10;
float* audi_buf;

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


float* get_hanning_window(int N) {
    int i;
    float* hann = malloc((N-1) * sizeof(float));
    float di = N-1;
    float tau = (float)2*PI;

    for(i = 0; i < N-1; i++) {
        hann[i] = 0.5 * (1 - cos(tau / di));
    }

    return hann;
}

void apply_window(const float* buf, size_t size, float* out, float* hann) {
    int i;
    for(i = 0; i < size; i++) {
        *(out + i) = *(buf + i) * *(hann + i); 
    }
}

uint8_t* magavg;
int set_audio(const float* audio, const size_t size) {
    float* hann = get_hanning_window(N);    
    kiss_fftr_cfg cfg = kiss_fftr_alloc(N , 0, NULL, NULL);

    size_t samples_read = 0;
    kiss_fft_cpx out[N / 2 + 1];
    int masize = (size / N) * NR_BARS;
    magavg = malloc( masize );

    int j, step = (N/2+1) / NR_BARS, magIdx = 0; 

    while(samples_read + N < size) {
        float buf[N];
        apply_window(audio + samples_read, N, buf, hann);
        kiss_fftr(cfg, buf, out);  
       
        for(j = 0; j < (N / 2 )+ 1; j+= step) {
            float avg = 0;
            int k, idx;
            for(k = 0; k < step; k++) {
                idx = j + k; 
                avg += sqrt((out[idx].r * out[idx].r) + (out[idx].i * out[idx].i)) / step;
            }
            magavg[magIdx++] = (uint8_t)(avg * 256);
        }   

        magIdx--;
        samples_read += N;
    }

    free(hann);
    return masize;
}

uint8_t* get_buffer() {
    return magavg;
}
/*
int main(int argc, const char **argv) {
    int size;
    const float* audio = get_audio_buf("../assets/right1.raw", &size);

    float* averages ;
    int outsize = set_audio(audio, size);

    int i;
    for(i = 0; i < 100; i++)
        printf("%f\n", averages[i]);
    return 0;
}
*/

