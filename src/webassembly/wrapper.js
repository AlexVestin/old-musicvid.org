function encode(buffer){
    var encodedBuffer_p, decodedBuffer_p;
    try{
        encodedBuffer_p = Module._malloc(buffer.length)
        decodedBuffer_p = Module._malloc(buffer.length)

        Module.HEAPU8.set(buffer, encodedBuffer_p)
        var result = Module._invertColor(encodedBuffer_p, 400, 400, 4, decodedBuffer_p)
        var buf = Buffer.from(Module.buffer, decodedBuffer_p, buffer.length)
        return Buffer.from(buf);
    }finally {
        Module._free(decodedBuffer_p)
        Module._free(encodedBuffer_p)
    }
}