
EXPORTED_FUNCTIONS = "['_set_audio', '_malloc', '_free', '_get_buffer']"

EMCC_COMMON_ARGS = \
	-O3 --memory-init-file 0 \
	-o  ../../../../public/KissFFT.js\
	-s WASM=1 \
	-s ALLOW_MEMORY_GROWTH=1 \
	-s EXPORTED_FUNCTIONS=$(EXPORTED_FUNCTIONS) \
	-s MODULARIZE=1 \
	-s EXPORT_NAME="'KissFFT'" \
	

FILES = test.c kiss_fft.c kiss_fftr.c

em:
	emcc $(FILES) -lm $(EMCC_COMMON_ARGS)

test:
	gcc $(FILES) -lm