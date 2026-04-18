### 4月17日 vue3源码阅读

1.搭建环境
  - 创建项目文件夹
  - 初始化项目  安装pnpm 初始化 ``` pnpm init```
  - 修改package.json 设置仓库为私有
  - 添加.npmrc配置文件
     作用是让 pnpm 把依赖尽量提升到根 node_modules（更接近 npm/yarn 的扁平结构），主要用于兼容一些“假设依赖在顶层”的老包。
  - 搭建monorepo环境(Monorepo 是一种项目代码管理方式，指单个仓库中管理多个项目，有助于简化代码共享、版本控制、构建和部署等方面的复杂性，并提供更好的可重用性和协作性。)
      - 指定工作目录 packages
      - 建立pnpm-workspace.yaml,添加文件配置```packages:-"packages/*"```,指定工作目录为packages下的所有项目
      - 搭建完成
      - 安装依赖```pnpm add typescript esbuild minimist -D -w``` minimist用于获取命令行传过来的参数；-D表示开发环境使用；-w表示安装到根目录，因为使用monorepo所以需要指定
      - esbuild 是一个构建工具，核心用途是：
            打包（bundle）JS/TS
            转译（TS/JSX -> JS）
            压缩（minify）
            开发时快速构建
            它最大的特点是：非常快（Go 写的，速度通常远超传统 JS 工具链）。
      - 初始化ts配置 ```npx tsc --init```,修改配置文件
      - 新建脚本文件夹 scripts，新建脚本文件 dev.js,在packages.json中的script中配置命令"dev":"node scripts/dev.js reactivity -f esm"\\
      - 新建项目文件 reactivity(响应式模块) 和shared(存放公用模块)
          - 在两个文件夹下分别新建src目录以及入口文件index.ts
          - 分别添加package.json并写入基本配置
      - 从tsconfig中配置基本路径
        - baseUrl: "." 把项目根目录设为“路径解析基准”。后续 paths 的映射路径就是相对这个基准来的。
        - paths 配置路径别名。你这里表示：当代码里写 @vue/xxx，TS 会把它映射到 packages/xxx/src 去找。
      - 给reactivity项目安装本地的这个依赖@vue/shared   ```pnpm install @vue/shared --workspace --filter @vue/reactivity ```
      - 添加esbuild打包相关配置代码
2.开始写reactivity模块
   