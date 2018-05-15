
#include <stdint.h>

void write_audio_frame();
void free_buffer();
void open_video(int, int, int, int, int); 
void add_audio_frame(float*, float*, int);
void open_audio_pre(float*, float*, int);
void open_audio( int, int, int);

void write_header();
uint8_t* get_buffer();
int close_stream();
void add_frame(uint8_t*, int);
