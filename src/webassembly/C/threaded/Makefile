
FLAGS = `pkg-config --libs libavcodec libavformat libswscale libswresample x264` \

FILES = encoder.c encoder.h muxer.c muxer.h \
	-I/home/alex/ff/reg/include \
	-L/home/alex/ff/reg/lib \

threaded:
	gcc -g threadtest.c $(FILES) $(FLAGS) 

