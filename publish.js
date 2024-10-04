


const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 拷贝当前目录下的 README 到 ./pkg下
const pkgDir = path.resolve(__dirname, 'pkg');
const pkgReadmePath = path.resolve(pkgDir, 'README.md');

if (!fs.existsSync(pkgDir)) {
    fs.mkdirSync(pkgDir);
}
fs.copyFileSync(path.resolve(__dirname, 'README.md'), pkgReadmePath);
// 升级./pkg下 package.json的版本号最后一位+1
const pkgJsonPath = path.resolve(pkgDir, 'package.json');
const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath));
if (!pkgJson.version) {
    throw new Error('package.json 中没有 version 字段');
}
const versions = pkgJson.version.split(".");
console.log(versions);
if (versions.length !== 3) {
    throw new Error('package.json 中 version 字段格式不正确');
}
if (!versions[2]) {
    throw new Error('package.json 中 version 字段格式不正确');
}
if (isNaN(versions[2])) {
    throw new Error('package.json 中 version 字段格式不正确');
}
let lastVersion = parseInt(versions[2]);
lastVersion += 1;
versions[2] = lastVersion.toString();
pkgJson.version = versions.join(".");
// 新版本
console.log("新版本: " + pkgJson.version);
fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2));


// 打包
execSync('cd ./pkg && npm publish');
// 同步git
execSync('git add .');
execSync('git commit -m "publish version ' + pkgJson.version + '"');
execSync('git push');
