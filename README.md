# 图片压缩wasm

## 介绍

本项目是使用rust编写功能类似于[tinypng](https://tinypng.com/)，使用wasm打包成js，用于压缩图片，压缩后图片体积会减少，但是图片质量会下降。

优点：使用客户端压缩图片，减少服务器压力，同时减少图片上传时间。


## 编译

```bash
wasm-pack build -t bundler
```

## 注意

本项目使用rust编写，需要安装rust环境，具体安装方法可以参考rust官方文档。