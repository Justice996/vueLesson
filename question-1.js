const person ={
    name:'justice',
    get aliasName(){
        console.log(2);
        
        return this.name + 'liang';
    }
}

let proxyPerson = new Proxy(person,{
    get(target,key,recevier){
        console.log(1);
        return Reflect.get(target,key,recevier);
    }
});

console.log(proxyPerson.aliasName);
