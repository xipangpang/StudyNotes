#### 通俗解释
遍历器就是为各种数据结构提供一个接口（iteraor）,拥有这个接口就可以运用next()方法进行数据的遍历（遍历的流程类似于指针，next指向，一直指向done为true,value为undefined）;

#### 可以使用的数据结构

* Array;
* Map;
* Set;
* String;
* TypedArray;
* 函数的 arguments 对象;
* NodeList 对象
* 字符串

示例代码： 
```
let arrXyy = ['a','b','c','d'];
let iter = arrXyy[Symbol.iterator](); // 接口方法，存在就可以遍历
iter.next(); // {value: "a", done: false}
iter.next(); // {value: "b", done: false}
iter.next(); // {value: "c", done: false}
iter.next(); // {value: "d", done: false}
iter.next(); // {value: "undefined", done: true}
```
同时也可以给拥有长度&键值是数字的对象进行lterator遍历；普通的对象不可以
```
let iterable = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3,
  [Symbol.iterator]: Array.prototype[Symbol.iterator] // 调用了数组属性的遍历器接口
};
for (let item of iterable) {
  console.log(item); // 'a', 'b', 'c'
}
```

#### 使用场景
##### 1.解构赋值(数组orSet解构):原理是遍历器
```
let set = new Set().add('a').add('b').add('c');
let [x,y] = set;
// x='a'; y='b'
let [first, ...rest] = set;
// first='a'; rest=['b','c'];
```

##### 2.扩展运算符
```
let str = 'hello';
[..str] // 'h','e','l','l','o'
```

##### 3.yield*
```
// 构造器
let generator = function* () {
  yield 1;
  yield* [2,3,4];
  yield 5;
};
var iterator = generator();
iterator.next() // { value: 1, done: false }
iterator.next() // { value: 2, done: false }
iterator.next() // { value: 3, done: false }
iterator.next() // { value: 4, done: false }
iterator.next() // { value: 5, done: false }
iterator.next() // { value: undefined, done: true }
```

##### 4.其他接受数组为参数的场合都会使用遍历器
* for... of
* promise.all or promose.race
* Array.from
* Map() or Set() or WeakMap() or WeakSet()



#### for...of 对比 for... in & forEach
共同点:都是可以遍历数组
不同处:
 1. forEach作为数组内置的方法
 - 只能遍历数组
 - 内部使用break;&return不起作用；
 2. for ... in 作为遍历方法，可以返回键值:
 - 但是键值的类型是String,
 - 并且遍历的时候会遍历到原型链上面的键值，
 - 遍历没有顺序
 - 不建议用于数组的遍历，适用于遍历对象
 3. for ... of :es6提出的遍历方法
 - 不仅可以返回内容也可以返回键值
 - 可以使用break;return;continue等方法
 - 可以遍历lterator遍历器适用的所有数据结构
 
#### 仔细讲解各类数据结构-for...of
1. 数组，可以直接遍历，返回内容，获取数组的键值和键名（使用方法详见计算数据结构）
2. Map() or Set()结构，可以直接遍历，set()遍历是一个值，Map()是一个数组（Map在遍历的时候调用了该方法entries()）
3. 计算而来的数据结构：ES6 的数组、Set、Map ，可以使用以下三种方法:
 - entries():返回遍历器的对象，形式是数组[键名，键值]，对于数组来说键名就是索引值；对于Set()结构键名=键值，而Map()结构本身用的就是这个方法；
 - keys():返回遍历器对象，返回遍历的键名；
 - values():返回遍历器对象，返回遍历的键值；
 ```
 let arr = ['a', 'b', 'c'];
for (let pair of arr.entries()) { // 使用的是entries（）方法
  console.log(pair);
}
// [0, 'a']
// [1, 'b']
// [2, 'c']
 ```
4. 类似数组的对象
 - 字符串:会正确识别 32 位 UTF-16 字符
 - DOM NodeList对象
 - arguments对象
 ```
 function printArgs() {
  for (let x of arguments) {
    console.log(x);
  }
}
printArgs('a', 'b');
// 'a'
// 'b'
 ```
 - 如果有类似数组的对象在遍历过程中报错，可以采用Array.from()转化为数组再进行遍历

5. 对象
for..of不能直接遍历对象，同时也不能遍历对象的键值，但是for...in可以遍历对象的键值；
 - 解决方法1: 使用Object.keys将对象的key值取成一个数组，进行遍历；
 ```
 let someObject={
   abc:6,
   commit:'TVVA',
   stander:'baababba'
 };
for(var key of Object.keys(someObject))
{
  console.log(key,someObject[key])
}
 ```
 - 解决方法2:Generator 函数将对象重新包装一下
```
 let someObject={
   abc:6,
   commit:'TVVA',
   stander:'baababba'
 };
 function* entries(someObject) {
  for (let key of Object.keys(someObject)) {
    yield [key, someObject[key]];
  }
}

for (let [key, value] of entries(someObject)) {
  console.log(key, '->', value);
}
// abc -> 6
// commit -> TVVA
// stander -> baababba
```
