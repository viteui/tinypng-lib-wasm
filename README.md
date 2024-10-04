# 图片压缩wasm

## 介绍

本项目是使用rust编写功能类似于[tinypng](https://tinypng.com/)，将Rust打包成wasm的npm包，用于压缩图片，压缩后图片体积会减少，但是图片质量会下降。

优点：使用客户端压缩图片，减少服务器压力，同时减少图片上传时间。


## 编译

```bash
wasm-pack build -t bundler
```

## Demo
```vue
<template>
  <div id="app">
    <input type="file" @input="uploadImg" />
    <img :src="imgUrl" alt="">
  </div>
</template>

<script>
import { ImagequantImage, Imagequant } from 'tinypng-lib-wasm'

function padArrayBuffer(buffer) {
  const padding = buffer.byteLength % 4;
  if (padding === 0) return buffer;

  const paddingBytes = 4 - padding;
  const paddedBuffer = new ArrayBuffer(buffer.byteLength + paddingBytes);
  const paddedView = new Uint8Array(paddedBuffer);
  paddedView.set(new Uint8Array(buffer));
  // 填充额外的字节为0
  for (let i = buffer.byteLength; i < paddedBuffer.byteLength; i++) {
    paddedView[i] = 0;
  }
  return paddedBuffer;
}
// 获取图片信息：宽、高、像素数据、图片大小
const getImageData = (file) => {
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

export default {
  name: 'App',
  components: {
  },
  data() {
    return {
      imgUrl: ''
    }
  },
  methods: {
    uploadImg(e) {
      const file = e.target.files[0]
      getImageData(file).then(async ({
        buffer,
        width,
        height,
        size
      }) => {
        // 将 Uint8Array 数据从发给 Imagequant/WASM
        const uint8Array = new Uint8Array(buffer)
        console.log('uint8Array', buffer, uint8Array, width, height)
        // buffer 转图片


        const image = new ImagequantImage(uint8Array, width, height, 0)
        const instance = new Imagequant()
        // 配置压缩质量
        instance.set_quality(30, 50)
        console.log('set_quality', instance, image)
        try {
          console.time('压缩时间')
          // 启动压缩
          const output = instance.process(image);
          // console.log('output', output)
          const blob = new Blob([output], { type: 'image/png' })
          const url = URL.createObjectURL(blob)
          const img = new Image()
          this.imgUrl = url;
          img.src = url;
          // 压缩后图片文件大小
          console.timeEnd('压缩时间')
          console.log('压缩后大小', blob.size, "压缩之前", size, "压缩比率", `${((blob.size / size) * 100).toFixed(2)}%`)
        } catch (error) {
          console.log('error', error)
        }
      })
    }
  }
}
</script>
```

## 注意

本项目使用rust编写，需要安装rust环境，具体安装方法可以参考rust官方文档。