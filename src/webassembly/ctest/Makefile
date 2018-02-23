
FLAGS = `pkg-config --libs libavcodec libavformat libswscale` \

FILES = maintest.c avio_write.c avio_write.h \
	-I/home/alex/reg/ffmpeg_build/include \

all:
	gcc -g $(FILES) $(FLAGS) 