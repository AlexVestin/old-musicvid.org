MP4_ENCODERS = libx264 libmp3lame
MP4_MUXERS = mp4 mp3 null

FFMPEG_MP4_PC_PATH = ../../reg/lib/pkgconfig
MP4_SHARED_DEPS = libmp3lame libx264

all: ffmpeg

clean: clean-lame clean-x264 clean-ffmpeg lib include
lib:
	rm -rf lib/*
include: 
	rm -rf include/*
clean-lame:
	-cd ../dependencies/lame && make clean
clean-x264:
	-cd ../dependencies/x264 && make clean
clean-ffmpeg:
	-cd ../dependencies/ffmpeg && make clean

libmp3lame:
	cd ../dependencies/lame && \
	git reset --hard && \
	patch -p1 < ../../lame-configure.patch && \
	./configure \
		--prefix="$$(pwd)/../../reg" \
		--disable-static \
		\
		--disable-gtktest \
		--disable-analyzer-hooks \
		--disable-decoder \
		--disable-frontend \
		&& \
	make -j8 && \
	make install

libx264:
	cd ../dependencies/x264 && \
	git reset --hard && \
	patch -p1 < ../../x264-configure.patch && \
	./configure \
		--prefix="$$(pwd)/../../reg" \
		--extra-cflags="-Wno-unknown-warning-option" \
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
	make -j8 && \
	make install

FFMPEG_COMMON_ARGS = \
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
	--enable-avfilter \
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

ffmpeg: $(MP4_SHARED_DEPS)
	cd ../dependencies/ffmpeg && \
	git reset --hard && \
	PKG_CONFIG_PATH=$(FFMPEG_MP4_PC_PATH) ./configure \
		--prefix="$$(pwd)/../../reg" \
		$(FFMPEG_COMMON_ARGS) \
		$(addprefix --enable-encoder=,$(MP4_ENCODERS)) \
		$(addprefix --enable-muxer=,$(MP4_MUXERS)) \
		--enable-gpl \
		--enable-libmp3lame \
		--enable-libx264 \
		--extra-cflags="-I../../reg/include" \
		--extra-ldflags="-L../../reg/lib" \
		&& \
	make -j8 && \
	make install
