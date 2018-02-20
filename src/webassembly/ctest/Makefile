
FLAGS = -L/home/alex/reg/ffmpeg_build/lib -lavformat -lm -lz -lavcodec -lvpx -lm -lpthread -lvpx -lm -lpthread -lvpx -lm -lpthread -lvpx -lm -lpthread -pthread -lm -lz -lfdk-aac -lm -lmp3lame -lm -lopus -lm -ltheoraenc -ltheoradec -logg -lvorbis -lm -logg -lvorbisenc -lvorbis -lm -logg -lx264 -lpthread -lm -ldl -lx265 -lstdc++ -lm -lrt -ldl -lva -ldl -lswresample -lm -lavutil -pthread -lva -lva-drm -lva -lva-x11 -lX11 -lvdpau -lX11 -lm -lva -ldl

FILES = maintest.c encode.h encode.c \
	-I/home/alex/reg/ffmpeg_build/include \

all:
	gcc $(FILES) $(FLAGS)