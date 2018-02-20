#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include <libavcodec/avcodec.h>
#include <libavutil/opt.h>
#include <libavutil/imgutils.h>

void openStream(unsigned width, unsigned heigth, unsigned fps, unsigned bitRate);
void addFrame();
void closeStream();

