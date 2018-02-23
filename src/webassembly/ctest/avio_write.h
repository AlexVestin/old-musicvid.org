
#include <stdint.h>


void set_audio(uint16_t*, int, int, int);
void close_stream();
void add_frame(uint8_t*, int);
void open_stream(int, int, int, int);