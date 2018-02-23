
#include <stdint.h>


void set_audio(int16_t*, const int, const int, const int);
void close_stream();
void add_frame(uint8_t*, int);
void open_stream(int, int, int, int);