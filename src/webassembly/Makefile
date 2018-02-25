
MP4_MUXERS = mp4 mp3 null
MP4_ENCODERS = libx264 libmp3lame 
FFMPEG_MP4_BC = build/ffmpeg/ffmpeg.bc
FFMPEG_MP4_PC_PATH = ../x264/dist/lib/pkgconfig
MP4_SHARED_DEPS = \
	build/lame/dist/lib/libmp3lame.so \
	build/x264/dist/lib/libx264.so

all: ffmpeg.js 

clean: clean-js \
	clean-freetype \
	clean-opus \
	clean-lame clean-x264 clean-ffmpeg
clean-js:
	rm -f -- ffmpeg*.js
clean-lame:
	-cd build/lame && rm -rf dist && make clean
clean-x264:
	-cd build/x264 && rm -rf dist && make clean

clean-ffmpeg:
	-cd build/ffmpeg && rm -f ffmpeg.bc && make clean

build/opus/configure:
	cd build/opus && ./autogen.sh

build/lame/dist/lib/libmp3lame.so: 
	cd build/lame && \
	emconfigure ./configure \
		--prefix="$$(pwd)/dist" \
		--disable-static \
		\
		--disable-gtktest \
		--disable-analyzer-hooks \
		--disable-decoder \
		--disable-frontend \
		&& \
	emmake make -j8 && \
	emmake make install

build/x264/dist/lib/libx264.so:
	cd build/x264 && \
	patch -p1 < ../../x264.patch && \
	emconfigure ./configure \
		--prefix="$$(pwd)/dist" \
		--extra-cflags="-Wno-unknown-warning-option" \
		--enable-shared \
		--disable-cli \
		--disable-opencl \
		--disable-thread \
		--disable-asm \
		--disable-thread \
		\
		--disable-avs \
		--disable-swscale \
		--disable-lavf \
		--disable-ffms \
		--disable-gpac \
		--disable-lsmash \
		&& \
	emmake make -j8 && \
	emmake make install

FFMPEG_COMMON_ARGS = \
	--cc=emcc \
	--enable-cross-compile \
	--target-os=none \
	--disable-runtime-cpudetect \
	--disable-asm \
	--disable-fast-unaligned \
	--disable-pthreads \
	--disable-w32threads \
	--disable-os2threads \
	--disable-debug \
	--disable-stripping \
	\
	--disable-all \
	--enable-ffmpeg \
	--enable-avcodec \
	--enable-avformat \
	--enable-avutil \
	--enable-swresample \
	--enable-swscale \
	--disable-avfilter \
	--disable-network \
	--disable-d3d11va \
	--disable-dxva2 \
	--disable-vaapi \
	--disable-vdpau \
	--disable-bzlib \
	--disable-iconv \
	--disable-libxcb \
	--disable-lzma \
	--disable-sdl2 \
	--disable-securetransport \
	--disable-xlib \
	--disable-zlib

build/ffmpeg/ffmpeg.bc: $(MP4_SHARED_DEPS)
	cd build/ffmpeg && \
	EM_PKG_CONFIG_PATH=$(FFMPEG_MP4_PC_PATH) emconfigure ./configure \
		--prefix="../" \
		$(FFMPEG_COMMON_ARGS) \
		$(addprefix --enable-encoder=,$(MP4_ENCODERS)) \
		$(addprefix --enable-muxer=,$(MP4_MUXERS)) \
		--enable-gpl \
		--enable-libmp3lame \
		--enable-libx264 \
		--extra-cflags="-I../lame/dist/include" \
		--extra-ldflags="-L../lame/dist/lib" \
		&& \
	emmake make -j8 && \
	emmake make install && \
	cp ffmpeg ffmpeg.bc

FILES = ./ctest/avio_write.c
EXPORTED_FUNCTIONS = "['_add_frame', '_open_stream', '_close_stream', '_free_buffer']"

EMCC_COMMON_ARGS = \
	-O3 --memory-init-file 0 \
	-o  ../../public/ffmpeg.js\
	-s WASM=1 \
	-I./build/include \
	-s ALLOW_MEMORY_GROWTH=1 \
	-s EXPORTED_FUNCTIONS=$(EXPORTED_FUNCTIONS) \
	-s ASSERTIONS=2 \

ffmpeg.js: $(FFMPEG_MP4_BC)
	emcc $(FILES) $(FFMPEG_MP4_BC) $(MP4_SHARED_DEPS) $(EMCC_COMMON_ARGS)

