const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
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
        // 构建wasm 
        execSync('npm run build'); // 或者使用 wasm-pack build --target bundler
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
        // 修改Cargo.toml 中的版本号
        const pkgDir = path.resolve(__dirname, '.');
        const pkgTomlPath = path.resolve(pkgDir, 'Cargo.toml');
        const pkgToml = fs.readFileSync(pkgTomlPath, 'utf-8');
        const newPkgToml = pkgToml.replace(/version = ".*?"/, `version = "${config.version}"`);
        fs.writeFileSync(pkgTomlPath, newPkgToml, 'utf-8');
    },
    // git tag 格式
    gitTagFormat: (version) => {
        return `release/v${version}`
    },
}

