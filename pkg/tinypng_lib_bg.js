let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}


const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

let WASM_VECTOR_LEN = 0;

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function getObject(idx) { return heap[idx]; }

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

const ImagequantFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_imagequant_free(ptr >>> 0, 1));
/**
*/
export class Imagequant {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ImagequantFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_imagequant_free(ptr, 0);
    }
    /**
    */
    constructor() {
        const ret = wasm.imagequant_new();
        this.__wbg_ptr = ret >>> 0;
        ImagequantFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
    * Make an image from RGBA pixels.
    * Use 0.0 for gamma if the image is sRGB (most images are).
    * @param {Uint8Array} data
    * @param {number} width
    * @param {number} height
    * @param {number} gamma
    * @returns {ImagequantImage}
    */
    static new_image(data, width, height, gamma) {
        const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.imagequant_new_image(ptr0, len0, width, height, gamma);
        return ImagequantImage.__wrap(ret);
    }
    /**
    * It's better to use `set_quality()`
    * @param {number} max_colors
    */
    set_max_colors(max_colors) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.imagequant_set_max_colors(retptr, this.__wbg_ptr, max_colors);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Range 0-100, roughly like JPEG.
    *
    * If the minimum quality can't be met, the quantization will be aborted with an error.
    *
    * Default is min 0, max 100, which means best effort, and never aborts the process.
    *
    * If max is less than 100, the library will try to use fewer colors.
    * Images with fewer colors are not always smaller, due to increased dithering it causes.
    * @param {number} minimum
    * @param {number} target
    */
    set_quality(minimum, target) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.imagequant_set_quality(retptr, this.__wbg_ptr, minimum, target);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * 1-10.
    *
    * Faster speeds generate images of lower quality, but may be useful
    * for real-time generation of images.
    *
    * The default is 4.
    * @param {number} value
    */
    set_speed(value) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.imagequant_set_speed(retptr, this.__wbg_ptr, value);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Number of least significant bits to ignore.
    *
    * Useful for generating palettes for VGA, 15-bit textures, or other retro platforms.
    * @param {number} value
    */
    set_min_posterization(value) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.imagequant_set_min_posterization(retptr, this.__wbg_ptr, value);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Create PNG based on specified settings Vec<u8>
    * @param {ImagequantImage} image
    * @returns {Uint8Array}
    */
    process(image) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(image, ImagequantImage);
            var ptr0 = image.__destroy_into_raw();
            wasm.imagequant_process(retptr, this.__wbg_ptr, ptr0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
            if (r3) {
                throw takeObject(r2);
            }
            var v2 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1, 1);
            return v2;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

const ImagequantImageFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_imagequantimage_free(ptr >>> 0, 1));
/**
*/
export class ImagequantImage {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ImagequantImage.prototype);
        obj.__wbg_ptr = ptr;
        ImagequantImageFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ImagequantImageFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_imagequantimage_free(ptr, 0);
    }
    /**
    * Make an image from RGBA pixels.
    * Use 0.0 for gamma if the image is sRGB (most images are).
    * @param {Uint8Array} data
    * @param {number} width
    * @param {number} height
    * @param {number} gamma
    */
    constructor(data, width, height, gamma) {
        const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.imagequantimage_new(ptr0, len0, width, height, gamma);
        this.__wbg_ptr = ret >>> 0;
        ImagequantImageFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
}

export function __wbindgen_error_new(arg0, arg1) {
    const ret = new Error(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

export function __wbindgen_throw(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

