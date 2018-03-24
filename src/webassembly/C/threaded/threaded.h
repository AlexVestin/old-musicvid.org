
#include <stdint.h>

void write_audio_frame();
void free_buffer();
void muxer_video_init(int, int, int, int, int); 
void encoder_init(int, int, int, int, int); 

void open_audio(float*, float*, int, int, int, int);
void write_header();
uint8_t* get_buffer();
int close_stream();

void add_frame(uint8_t*, int);
void encoder_add_frame(uint8_t*, uint8_t*);

