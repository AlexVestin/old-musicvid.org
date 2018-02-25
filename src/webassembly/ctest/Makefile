
FLAGS = `pkg-config --libs libavcodec libavformat libswscale x264` \

FILES = maintest.c avio_write.c avio_write.h \
	-I/home/alex/reg/ffmpeg_build/include \
	-L/home/alex/reg/ffmpeg_build/lib \

all:
	gcc -g $(FILES) $(FLAGS) 