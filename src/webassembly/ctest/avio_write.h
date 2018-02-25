
#include <stdint.h>

void free_buffer();
void set_audio(int16_t*, const int, const int, const int);
int close_stream(uint8_t** out, int* size);
void add_frame(uint8_t*, int);
void open_stream(int, int, int, int);