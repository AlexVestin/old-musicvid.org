
#include <stdint.h>

void free_buffer();
void set_audio(int16_t*, const int, const int, const int);

uint8_t* get_buffer();
int close_stream();

void add_frame(uint8_t*);
void open_stream(int, int, int, int);