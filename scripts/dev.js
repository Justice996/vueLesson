import minimist from "minimist";

import {resolve,dirname} from 'path'
import { fileURLToPath } from "url";
import {createRequire} from 'module'
import esbuild from 'esbuild'

//node中命令行参数使用process.argv来获取  前两个参数分别为node的路径和执行的命令，后面是参数，minimist会把他处理成对象数组{ _: [ 'reactivity' ], f: 'esm' }
const args = minimist(process.argv.slice(2));

const __filename=fileURLToPath(import.meta.url);  //获取文件的绝对路径
const __dirname = dirname(__filename)


const require = createRequire(import.meta.url);


const target = args._[0]||"reactivity"; //打包那个项目
const format = args.f || "iife"; //打包后的模块化规范

//node中esm模块—__dirname不存在需要自己解析
//入口文件
const entry = resolve(__dirname,`../packages/${target}/src/index.ts`);
const pkg = require(`../packages/${target}/package.json`)



//根据需要开始打包
esbuild.context({
  entryPoints:[entry], //入口
  outfile:resolve(__dirname,`../packages/${target}/dist/${target}.js`), //出口
  bundle:true, // 会打包到一个文件
  platform:"browser", //打包给浏览器运行
  sourcemap:true, // 是否允许调试
  format, //cjs esm iife
  globalName:pkg.buildOptions?.name,
}).then((ctx)=>{
    console.log('打包成功');
     return ctx.watch();
});

