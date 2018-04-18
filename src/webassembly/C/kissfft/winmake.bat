

emcc test.c kiss_fft.c kiss_fftr.c 
	-O3 --memory-init-file 0 
	-o  ../../../../public/KissFFT.js
	-s WASM=1 
	-s ALLOW_MEMORY_GROWTH=1 
	-s EXPORTED_FUNCTIONS="['_init_r', '_malloc', '_free', '_fft_r']" 
	-s MODULARIZE=1 
	-s EXPORT_NAME="'KissFFT'" 
	-s "BINARYEN_TRAP_MODE='clamp'"
	

	

