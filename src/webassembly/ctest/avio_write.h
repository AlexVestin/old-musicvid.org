
#include <stdint.h>

void write_audio_frame();
void free_buffer();

void open_video(int, int, int, int);
void open_audio(uint8_t*, int size, int sample_rate, int nr_channels, int bit_rate);

uint8_t* get_buffer();
int close_stream();

void add_frame(uint8_t*);
