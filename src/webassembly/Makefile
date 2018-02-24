COMMON_DEMUXERS = matroska ogg avi mov flv mpegps image2 mp3 concat
COMMON_DECODERS = \
	vp8 vp9 theora \
	mpeg2video mpeg4 h264 hevc \
	png mjpeg \
	vorbis opus \
	mp3 ac3 aac \
	ass ssa srt webvtt


MP4_MUXERS = mp4 mp3 null
MP4_ENCODERS = libx264 libmp3lame aac
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
clean-opus:
	-cd build/opus && rm -rf dist && make clean
clean-freetype:
	-cd build/freetype && rm -rf dist && make clean
clean-lame:
	-cd build/lame && rm -rf dist && make clean
clean-x264:
	-cd build/x264 && rm -rf dist && make clean

clean-ffmpeg:
	-cd build/ffmpeg && rm -f ffmpeg.bc && make clean

build/opus/configure:
	cd build/opus && ./autogen.sh

build/opus/dist/lib/libopus.so: build/opus/configure
	cd build/opus && \
	emconfigure ./configure \
		CFLAGS=-O3 \
		--prefix="$$(pwd)/dist" \
		--disable-static \
		--disable-doc \
		--disable-extra-programs \
		--disable-asm \
		--disable-rtcd \
		--disable-intrinsics \
		&& \
	emmake make -j8 && \
	emmake make install

build/freetype/builds/unix/configure:
	cd build/freetype && ./autogen.sh

# XXX(Kagami): host/build flags are used to enable cross-compiling
# (values must differ) but there should be some better way to achieve
# that: it probably isn't possible to build on x86 now.
build/freetype/dist/lib/libfreetype.so: build/freetype/builds/unix/configure
	cd build/freetype && \
	emconfigure ./configure \
		CFLAGS="-O3" \
		--prefix="$$(pwd)/dist" \
		--disable-static \
		\
		--without-zlib \
		--without-bzip2 \
		--without-png \
		--without-harfbuzz \
		&& \
	emmake make -j8 && \
	emmake make install


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
	$(addprefix --enable-decoder=,$(COMMON_DECODERS)) \
	$(addprefix --enable-demuxer=,$(COMMON_DEMUXERS)) \
	--enable-protocol=file \
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

# Compile bitcode to JavaScript.
# NOTE(Kagami): Bump heap size to 64M, default 16M is not enough even
# for simple tests and 32M tends to run slower than 64M.

FILES = ./ctest/avio_write.c
EXPORTED_FUNCTIONS = "['_add_frame', '_open_stream', '_close_stream', '_free_buffer']"

EMCC_COMMON_ARGS = \
	-O3 --memory-init-file 0 \
	-o $@ \
	-s WASM=1 \
	-I./build/include \
	-s ALLOW_MEMORY_GROWTH=1 \
	-s EXPORTED_FUNCTIONS=$(EXPORTED_FUNCTIONS) \

ffmpeg.js: $(FFMPEG_MP4_BC)
	emcc $(FILES) $(FFMPEG_MP4_BC) $(MP4_SHARED_DEPS) $(EMCC_COMMON_ARGS)

