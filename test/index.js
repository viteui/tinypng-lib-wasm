import { ImagequantImage, Imagequant } from 'tinypng-lib-wasm'

export const canvastoFile = (
    canvas,
    type,
    quality
) => {
    return new Promise((resolve) =>
        canvas.toBlob((blob) => resolve(blob), type, quality)
    );
};


export const dataURLToImage = (dataURL) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = dataURL;
    });
};


export function fileToDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            if (reader.result && typeof reader.result == "string") {
                resolve(reader.result);
            }
        };
        reader.onerror = function (e) {
            reject(e);
        };
        reader.readAsDataURL(file);
    });
}

class TinyPNG {
    constructor() {
        // this.imagequant = new Imagequant()
    }

    async compressJpegImage() {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const base64 = await fileToDataURL(file);
        const img = await dataURLToImage(base64);
        canvas.width = img.width;
        canvas.height = img.height;
        const blob = (await canvastoFile(
            canvas,
            file.type,
            this.options.quality / 100
        )); // quality:0.5可根据实际情况计算
        return new File([blob], file.name, {
            type: file.type,
        });
    }
    async compressImage(file, {
        minimumQuality = 0,
        quality = 100
    } = {}) {
        if (!file) throw new Error("file can not be null");
        if (!file.type.includes("image/")) throw new Error("file must be image");

        try {

            if (["image/jpeg", "image/jpg"].includes(file.type)) {

            } else {
                const {
                    buffer,
                    width: imageDataWidth,
                    height: imageDataHeight,
                    size: originalSize
                } = await this.getImageData(file);
                const uint8Array = new Uint8Array(buffer)
                const image = new ImagequantImage(uint8Array, imageDataWidth, imageDataHeight, 0);
                const imagequantnstance = new Imagequant()
                imagequantnstance.set_quality(minimumQuality, quality); // 设置压缩质量范围
                const output = imagequantnstance.process(image);
                const { file: outputFile, blob } = this.uint8ArrayToFile(output, file?.name || file.url);
                const rate = outputFile.size / originalSize;
                return {
                    success: true,
                    file: outputFile,
                    output,
                    originalSize,
                    compressedSize: outputFile.size,
                    rate: rate,
                    blob,
                    rateString: `${(rate * 100).toFixed(2)}%`
                }
            }

        } catch (error) {
            return {
                success: false,
                error
            }
        }

    }
    getImageData = (file) => {
        return new Promise((resolve, reject) => {

            // 创建一个 Image 对象
            const img = new Image();
            img.src = URL.createObjectURL(file);

            img.onload = () => {
                // 创建一个 canvas 元素
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');

                if (!ctx) {
                    reject(new Error('无法获取 canvas 上下文'));
                    return;
                }

                // 将图像绘制到 canvas 上
                ctx.drawImage(img, 0, 0);

                // 获取 ImageData
                const imageData = ctx.getImageData(0, 0, img.width, img.height);
                const data = imageData.data; // Uint8ClampedArray

                // 将 Uint8ClampedArray 转换为普通的 Uint8Array
                const buffer = new Uint8Array(data).buffer;

                // 确保缓冲区长度是 width * height * 4
                const expectedLength = img.width * img.height * 4;
                if (buffer.byteLength !== expectedLength) {
                    reject(new Error(`缓冲区长度不匹配：期望 ${expectedLength} 字节，但得到 ${buffer.byteLength} 字节`));
                    return;
                }

                resolve({
                    buffer,
                    width: img.width,
                    height: img.height,
                    size: file.size
                });

                // 释放对象 URL
                URL.revokeObjectURL(img.src);
            };

            img.onerror = () => {
                reject(new Error('图片加载失败'));
                URL.revokeObjectURL(img.src);
            };
        });
    };
    uint8ArrayToFile(uint8Array, fileName) {
        const blob = new Blob([uint8Array], { type: 'image/png' });
        return {
            file: new File([blob], fileName || `${Date.now()}.png`, { type: 'image/png', lastModified: Date.now() }),
            blob,
        };
    }
}

export default new TinyPNG();