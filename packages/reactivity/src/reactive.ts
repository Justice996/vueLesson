import { isObject } from '@vue/shared';
import { mutableHandlers, ReactiveFlags } from './baseHandler';


//防止重复创建proxy

// 核心区别就两点：键类型和内存回收。
// Map
// 键可以是任意类型（对象、字符串、数字等）
// 强引用键和值：你不 delete，它就一直在
// 可遍历（for...of、size、keys()）
// WeakMap
// 键只能是对象（不能是字符串/数字）
// 对键是弱引用：当键对象在外部没引用时，GC 会自动回收对应条目
// 不可遍历、没有 size（因为条目可能随时被回收）
// 为什么响应式里常用 WeakMap（你这行 reactiveMap）：

// 通常是 原对象 -> 代理对象 的缓存
// 当原对象不用了，希望缓存自动释放，避免内存泄漏
// 正好 WeakMap 的键必须是对象，也符合这个场景
// 所以这里用 WeakMap 比 Map 更合适。
const reactiveMap = new WeakMap();






function createReactiveObject(target){
    if(!isObject(target)){
        return target;
    }
    
    //防止二次包装 如果已经是响应式了，就直接返回 如果这个对象已经是响应式对象了，访问他的属性就会触发get，
    // 然后我们在get中判断如果访问的属性是__v_isReactive，就返回true，这样就能知道这个对象已经是响应式对象了，
    // 就不需要再次包装了，直接返回这个对象就行了。
    // 这样既不会污染对象，也能有效地避免重复创建代理对象，提高性能。
    // 属实魔法Magic
    if(target[ReactiveFlags.IS_REACTIVE]){
        return target;
    }

    // 如果有就取缓存
    const exitsProxy = reactiveMap.get(target);
    if(exitsProxy){
        return exitsProxy;
    }
    let proxy =  new Proxy(target,mutableHandlers);
    reactiveMap.set(target,proxy);
    return proxy;
}


export function reactive(target){
    return createReactiveObject(target);
}