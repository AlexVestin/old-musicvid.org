
FLAGS = `pkg-config --libs libavcodec libavformat libswscale`

FILES = maintest.c encode.h encode.c \
	-I/home/alex/reg/ffmpeg_build/include \

all:
	gcc $(FILES) $(FLAGS) 