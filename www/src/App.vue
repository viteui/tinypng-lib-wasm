<template>
  <div id="app">
    <input type="file" @input="uploadImg" />
    <img :src="imgUrl" alt="">
  </div>
</template>

<script>
import init, { ImagequantImage, Imagequant } from 'tinypng-lib'
// import { ImagequantImage, Imagequant } from "../../pkg/index.js"

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


// 获取图片的宽高、buffer、大小
// const getImageData = (file) => {
//   return new Promise(async (resolve, reject) => {
//     console.log(await file.arrayBuffer())
//     const reader = new FileReader()
//     // 获取图片的宽高、buffer、大小

//     // 通过fileReader获取buffer
//     reader.readAsArrayBuffer(file)
//     // 获取图片的宽高
//     const img = new Image()
//     img.src = URL.createObjectURL(file)
//     reader.onload = function (e) {
//       const buffer = e.target.result
//       setTimeout(async () => {
//         resolve({
//           buffer: padArrayBuffer(buffer),
//           width: img.width,
//           height: img.height,
//           size: file.size
//         })
//       }, 1000)
//     }
//   })

// }
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
  async mounted() {
    // result().then(res => {
    //   console.log('res', res)
    // })
    // console.log('result', ImagequantImage, Imagequant)
    // await init("node_modules/tinypng-lib/tinypng_lib_bg.wasm")
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
        // 将buffer转为图片
        // const blob = new Blob([buffer], { type: 'image/png' })
        // const url = URL.createObjectURL(blob)
        // const img = new Image()
        // this.imgUrl = url

        // 将 Uint8Array 数据从发给 Imagequant/WASM
        const uint8Array = new Uint8Array(buffer)
        console.log('uint8Array', buffer, uint8Array, width, height)
        // buffer 转图片


        console.log(ImagequantImage)
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

          // img.onload = () => {
          //   setTimeout(() => {
          //     console.log('压缩后图片大小', img.size)
          //   }, 1000)
          // }
          console.timeEnd('压缩时间')
          console.log('压缩后大小', size, blob.size, "压缩比率", `${((blob.size / size) * 100).toFixed(2)}%`)
        } catch (error) {
          console.log('error', error)
        }

        // const outputBlob = new Blob([output.buffer], { type: 'image/png' })
        // console.log('压缩前大小', size)
      })
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
