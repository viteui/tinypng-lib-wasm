import { ImagequantImage, Imagequant } from 'tinypng-lib'

export default class TinyPNG {
    constructor() {
        this.imagequant = new Imagequant()
        this.imagequant.set_quality(80, 100)
    }

    /**
     * @param {string} image
     * @returns {Promise<ImagequantImage>}
     */
    async load(image) {
        return this.imagequant.load(image)
    }
    getImageData = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

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
}