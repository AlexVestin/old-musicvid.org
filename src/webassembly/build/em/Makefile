MP4_ENCODERS = libx264 libmp3lame
MP4_MUXERS = mp4

FFMPEG_MP4_BC = build/ffmpeg/ffmpeg.bc
FFMPEG_MP4_PC_PATH = ../../em/lib/pkgconfig
MP4_SHARED_DEPS = libmp3lame libx264

all: build/ffmpeg/ffmpeg.bc

clean: clean-js \
	clean-lame clean-x264 clean-ffmpeg lib include
lib:
	rm -rf build/lib/*
include: 
	rm -rf build/include/*
clean-js:
	rm -f -- ffmpeg*.js
clean-lame:
	-cd build/lame && rm -rf dist && make clean
clean-x264:
	-cd build/x264 && rm -rf dist && make clean
clean-ffmpeg:
	-cd build/ffmpeg && rm -f ffmpeg.bc && make clean

libmp3lame:
	cd ../dependencies/lame && \
	git reset --hard && \
	patch -p1 < ../../lame-configure.patch && \
	emconfigure ./configure \
		--prefix="$$(pwd)/../../em" \
		--host=x86-none-linux \
		--disable-static \
		\
		--disable-gtktest \
		--disable-analyzer-hooks \
		--disable-decoder \
		--disable-frontend \
		&& \
	emmake make -j8 && \
	emmake make install

libx264:
	cd ../dependencies/x264 && \
	git reset --hard && \
	patch -p1 < ../../x264-configure.patch && \
	emconfigure ./configure \
		--prefix="$$(pwd)/../../em" \
		--extra-cflags="-Wno-unknown-warning-option" \
		--host=x86-none-linux \
		--disable-cli \
		--enable-shared \
		--disable-opencl \
		--disable-thread \
		--disable-asm \
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
	--arch=x86 \
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
	--disable-swscale \
	--disable-avfilter \
	--disable-network \
	--disable-d3d11va \
	--disable-dxva2 \
	--disable-vaapi \
	--disable-vdpau \
	--disable-protocol=file \
	--disable-bzlib \
	--disable-iconv \
	--disable-libxcb \
	--disable-lzma \
	--disable-sdl2 \
	--disable-securetransport \
	--disable-xlib \
	--disable-zlib

build/ffmpeg/ffmpeg.bc: $(MP4_SHARED_DEPS)
	cd ../dependencies/ffmpeg && \
	git reset --hard && \
	EM_PKG_CONFIG_PATH=$(FFMPEG_MP4_PC_PATH) emconfigure ./configure \
		--prefix="$$(pwd)/../../em" \
		$(FFMPEG_COMMON_ARGS) \
		$(addprefix --enable-encoder=,$(MP4_ENCODERS)) \
		$(addprefix --enable-muxer=,$(MP4_MUXERS)) \
		--enable-gpl \
		--enable-libmp3lame \
		--enable-libx264 \
		--extra-cflags="-I../../em/include" \
		--extra-ldflags="-L../../em/lib" \
		&& \
	emmake make -j8 && \
	emmake make install && \
	cp ffmpeg ~/videoeditor/src/webassembly/ffmpeg_prod.bc 
