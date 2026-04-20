export enum ReactiveFlags{
    IS_REACTIVE = '__v_isReactive'
}
let a=0;
export const mutableHandlers:ProxyHandler<any>={
    get(target,key,recevier){
        // 这里我们在get中判断如果访问的属性是__v_isReactive，就返回true，这样就能知道这个对象已经是响应式对象了，
        if(key === ReactiveFlags.IS_REACTIVE){
            return true;
        }
        // 这里我们使用Reflect.get来获取属性值，防止设置的属性是getter，这样就能正确的处理继承关系了，
        return Reflect.get(target,key,recevier);
    },
    set(target,key,value,recevier){
        Reflect.set(target,key,value,recevier);
      return true;
    }
}