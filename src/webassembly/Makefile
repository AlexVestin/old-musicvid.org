FFMPEG_MP4_BC = ffmpeg.bc
MP4_SHARED_DEPS = \
	/home/alex/ff/em/lib/libmp3lame.so \
	/home/alex/ff/em/lib/libx264.so

all: mp4
mp4: ffmpeg.js

FILES = ./C/avio_write.c
EXPORTED_FUNCTIONS = "[ \
		'_open_audio', '_write_audio_frame', '_add_frame', \
		'_open_video', '_close_stream', '_free_buffer', '_get_buffer', \
		'_write_header', '_set_audio']"

EMCC_COMMON_ARGS = \
	-O3 --memory-init-file 0 \
	-o  ../../public/WasmVideoEncoderTest2.js\
	-s WASM=1 \
	-s ALLOW_MEMORY_GROWTH=1 \
	-s EXPORTED_FUNCTIONS=$(EXPORTED_FUNCTIONS) \
	-s MODULARIZE=1 \
	-s EXPORT_NAME="'WasmVideoEncoderTest2'" \
	-s NO_FILESYSTEM=1

ffmpeg.js:
	emcc -I./build/em/include $(FILES) $(EMCC_COMMON_ARGS) $(FFMPEG_MP4_BC) $(MP4_SHARED_DEPS) 
