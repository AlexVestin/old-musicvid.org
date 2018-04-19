#include <stdio.h>
#include <stdint.h>
#include <inttypes.h>
#include "kiss_fft.h"
#include "kiss_fftr.h"

#define PI 3.141592653589793238462643383

const int N = 1024;
const int NR_BARS = 10;
kiss_fftr_cfg cfg;
/*
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
        *(out + i) = *(buf + i); //* *(hann + i); 
    }
}
*/

void init_r(int size) {
    cfg = kiss_fftr_alloc(size , 0, NULL, NULL);
}


float* fft_r(float* data, unsigned size, int window) {
    int i, j;
    if(window) {
        for(i=0;i<size;i++) {
            data[i] = data[i] * 0.5 * (1 - cos((float)2*PI / size-1));
        }
    }
    
    kiss_fft_cpx out[size / 2 + 1];
    kiss_fftr(cfg, data, out);  
    float* mag = malloc(size*4);

    for(i = 0; i < size/2; i++) {
        mag[i] = sqrt( (out[i].r * out[i].r) + (out[i].i * out[i].i) ); 
    }

    return mag;
}

float* fft_r_bins(float* data, unsigned size, unsigned bins, int window) {
    int i, j;
    if(window) {
        for(i=0;i<size;i++) {
            data[i] = data[i] * 0.5 * (1 - cos((float)2*PI / size-1));
        }
    }
    
    kiss_fft_cpx out[size / 2 + 1];
    kiss_fftr(cfg, data, out);  
    float* avg_result = malloc(bins*4);

    int step = (size / 2 + 1) / bins, idx;
    float avg;

    int last_upper = 0, lower, upper;
    for(i = 0; i < bins; i++) {
        lower = last_upper;
        upper = ((i+1)*(i+1));

        avg = 0.0;
        for(j = lower; j < upper; j++) {
            float dB = 20 * log10( sqrt((out[j].r * out[j].r) + (out[j].i * out[j].i) )); 
            avg += dB;  
        }

        last_upper = upper;
        avg_result[i] = avg / (upper-lower);

    }

    /*
    for(i = 0; i < bins; i++) {
        avg = 0;
        for(j = 0; j < step; j++) {
            idx = (step * i) + j;
            float dB = (out[idx].r * out[idx].r) + (out[idx].i * out[idx].i); 
            avg += dB;
        }
        
        avg_result[i] = log10(avg / step);
    }
    */
    return avg_result;
}
/*
int main(int argc, const char **argv) {
    int size;
    float* audio = get_audio_buf("../assets/right1.raw", &size);

    //int outsize = set_audio(audio, size);
    //uint8_t* averages = get_buffer();
    
    const unsigned nr_bins = 16, window_size = 2048;
    init_r(window_size);
    uint8_t* averages = fft_r(audio, window_size, nr_bins, 0);

    int j;
    for(j = 0; j < nr_bins; j++) {
        printf("%" PRIu8 "\n", averages[j]);
    }
        
    return 0;
}



*/