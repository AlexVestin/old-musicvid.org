
FLAGS = `pkg-config --libs libavcodec libavformat libswscale libswresample x264` \

FILES = avio_write.c avio_write.h \
	-I/home/alex/ff/reg/include \
	-L/home/alex/ff/reg/lib \

main:
	gcc -g maintest.c $(FILES) $(FLAGS) 

mult:
	gcc -g testmultiple.c $(FILES) $(FLAGS) 