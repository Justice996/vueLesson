

export function effect(fn, options?) {
    //创建一个响应式effect 数据变化后可以重新执行


    //创建一个effect 只要属性变化了就触发回调
    const _effect = new ReactiveEffect(fn, () => {
        _effect.run();
    })
    _effect.run();
    return _effect;
}
//创建全局变量 进行依赖收集
export let activeEffect;
class ReactiveEffect {
    public active = true; // 创建的effect是响应式的
    //fn为用户编写的函数  scheduler用来判断数据是否更新，数据更新后需要触发fn
    constructor(public fn, public scheduler) {

    }
    run() {
        if (!this.active) {
            return this.fn();
        }

        //用户编写函数执行结束后 不应该继续进行依赖收集

        let lastEffect = activeEffect;
        try {
            // 保存当前变量
            activeEffect = this;
            this.fn();
        } finally {
            activeEffect=lastEffect; 
        }



    }
}