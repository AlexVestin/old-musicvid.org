
FLAGS = `pkg-config --libs libavcodec libavformat libswscale libswresample x264` \

FILES = maintest.c avio_write.c avio_write.h \
	-I/home/alex/ff/reg/include \
	-L/home/alex/ff/reg/lib \

all:
	gcc -g $(FILES) $(FLAGS) 