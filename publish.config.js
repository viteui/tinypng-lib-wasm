const fs = require('fs');
const path = require('path');

module.exports = {
    // 发布目录
    root: "./pkg",
    // 是否同步git
    syncGit: true,
    // 是否同步git tag
    syncGitTag: true,
    // 升级版本号的等级
    versionLevel: 'patch', // major | minor | patch
    // 自定义发布
    customPublish: false,
    // git 仓库根目录
    gitRoot: '.',
    // 发布前执行
    before(config) {
        // 拷贝当前目录下的 README 到 ./pkg下

        const pkgDir = path.resolve(__dirname, 'pkg');
        const pkgReadmePath = path.resolve(pkgDir, 'README.md');

        if (!fs.existsSync(pkgDir)) {
            fs.mkdirSync(pkgDir);
        }
        fs.copyFileSync(path.resolve(__dirname, 'README.md'), pkgReadmePath);
    },
    // 发布后执行
    after(config) {
        // console.log(config)
    },
    // git tag 格式
    gitTagFormat: (version) => {
        return `v${version}`
    },
}

