
### promise 细节讲解

###### 回调地狱
在es6之前，ajax的使用如果遇到需要上一个请求返回的参数用于下一个请求的时候都会不可避免的产生回调地狱，不仅如此请求之前还需要把回调结果的处理方法都设定才可以去请求。以下就是基于jquery的ajax()的回调地狱：
```
$.ajax({
             type: "GET",
             url: "url",
             data: params,
             success: function(data){
             $.ajax({
             type: "GET",
             url: "url",
             data: data, // 成功返回的data
             success: function(data){
             $.ajax({
             type: "GET",
             url: "url",
             data: data, // 成功返回的data
             success: function(data){
             },
             error: function(error){
             }
         });
             },
             error: function(error){
             }
         });
             },
             error: function(error){
             }
         });
    
```

###### promise的诞生
es6提出了promise进行异步编程处理，而其链式的调用方法比之前的回调地狱的代码逻辑更容易维护。Promise对象的接收同步回调函数(执行器函数),执行器函数自带两个参数（resolve，reject）,执行器函数返回一个promise实例,下面就是一个鲜明的Promise对象例子:

```
new Promise(
  // 执行器函数
  (resolve,reject)=>{
    // 异步回调函数
            setTimeout(()=>{
                resolve('onResolved-成功的回调');
            },1000)
        }).then((value)=>console.log(value))
```
###### promise 内部的状态
描述：promise对象有三种状态，分别是pendding（初始化）、resolved（成功状态）和rejected(失败状态)。promise对象内部状态一旦改变就无法再回转。
思考：
1. 那么怎么才可以改变promise实例内部的状态呢？
最常规的想法，就是利用在执行器函数中调用resolve(reject)函数进而更改状态：

1) resolve : pendding => resolved
2) reject : pendding => rejected

```
let promise1 = new Promise((resolve,reject)=>{
             setTimeout(()=>{
            // resolve('onResolved-成功的回调');
             reject('onRejected-失败的回调');
             },1000)
        })
        .then(
        value => console.log('成功回调',value),
        reason => console.log('失败回调', reason)
        )
```

那么除了以上的方法是否还有其他的方法可以更改Promise对象内部的状态呢？
如果执行器函数内部抛出异常，是否可以更改状态呢？
答案是当然可以（pendding=>rejected）

2. 那么在执行器里面抛出异常可以更改对象的状态，那么在异步回调内抛出异常是否可以向上冒泡进而更改状态呢？

```
let promise1 = new Promise((resolve,reject)=>{
            //throw new Error('执行器内部报错')
             setTimeout(()=>{
                throw new Error('执行器内回调函数报错')
             },1000)
        })
        .then(
        value => console.log('成功回调',value),
        reason => console.log('失败回调', reason)
        )
```

1) setTimeout 抛出异常并不能被.then捕获到,所以就会报错。
2) 执行器函数内抛出异常，reject可以改变状态，而失败的value就是抛出的异常
###### promise 的链式调用
思考：
1. promise.prototype.then()返回新的promise的结果状态由什么决定？
```
let promise3 = new Promise((resolve,reject)=>{
            setTimeout(()=>{
                // resolve('onResolved-成功的回调');
                reject('onRejected-失败的回调');
            },1000)
        })
        promise3
        .then(
        value=>{
            console.log(value,'成功的回调1')
            return '成功的回调1的结果'
            },
        reason => {
            console.log(reason,'失败的调用1')
            return '失败回调1的结果'
        }
        )
        .then(
        value=>{
            console.log(value,'成功的回调2')
            // return '成功'
            },
        reason => console.log(reason,'失败的调用2')
        )
```

1) 如果返回的是新的promise此时promise的结果就成为了新的promise结果
2) 如果返回的是非promise任意值，新promise就变成了resolved状态，value为返回的值
3) 抛出异常，新的promise变成了rejected状态，reason为抛出的异常

2. 如何中断promise链？
```
let promise1 = new Promise((resolve,reject)=>{
            setTimeout(()=>{
                resolve('onResolved-成功的回调')
            },1000)
        })
        .then(value => {
            console.log('第一次成功回调',value)
            return Promise.reject('第二次失败的回调')
            }
        )
        .then(value => console.log('第二次成功回调',value))
        .catch(reason => console.log('失败的回调',reason))
        .then(value => console.log(value,'第三次成功的回调'))
        .then(value => console.log(value,'第四次成功的回调'))
        .then(value => {
            console.log(value,'以为可以终止的回调')
            return new Promise(()=>{})
        })
        .then(value => console.log(value,'真的终止了嘛？？？'))
```
通过上面的代码运行结果可知=>返回一个状态为pendding的promise即可
###### promise的属性
描述：promise的属性分为.then、.catch(.then的语法糖)和.finally

```
new Promise((resolve, reject)=>{
            setTimeout(()=>{
                resolve('onResolve-成功的回调');
            })
        }).then(
            value => console.log(value),
            reason => console.log(reason)
        ).finally(
            console.log('结束了')
        )
```
由上面可知：
当promise的状态变成resolved的时候，会进入.then的第一个回调对象，
当状态变成rejected的时候会进入.then的第二个回调对象（或者.catch）,
.finally是promise返回结果之后执行的回调。
思考：
1. 一个promise实例指定多个成功、失败的回调函数，这些函数都会调用、数值会被覆盖吗？
```
let promise2 = new Promise((resolve,reject)=>{
            setTimeout(()=>{
                resolve('onResolved-成功的回调');
            },1000)
        })
        promise2.then(
        value=>console.log(value,'回调函数1'), 
        reason => console.log(reason,'回调函数1')
        )
        promise2.then(
        value=>console.log(value,'回调函数2'), 
        reason => console.log(reason,'回调函数2')
        )
        promise2.then(
        value=>console.log(value,'回调函数3'), 
        reason => console.log(reason,'回调函数3')
        )
```
执行之后可以得知，由于promise执行器会将每一个回调的状态对象存储在数组中，故而回调函数会依次调用，顺序输出。

2. 改变promise对象状态与指定回调函数先后顺序是什么呢？
```
        let promise3 = new Promise((resolve,reject)=>{
            setTimeout(()=>{
                resolve('onResolved-成功的回调');
            },3000)
        })
        setTimeout(()=>{
            promise3.then((value)=>console.log(value)) // 指定回调函数
        },6000)
```
都有可能

1) 可以先改变状态，再指定回调函数（非常规）
2) 先指定回调函数，再改变状态（常规）=> promise执行器函数内部是异步回调函数
总之想拿到结果=>状态和实例的回调函数缺一不可

3. 如果promise.prototype.then里面的参数是非函数，会报错吗？
```
let promise7 = new Promise((resolve, reject)=>{
            // resolve('onResolved-成功');
            reject('onRejected-失败');
        })
promise7.then(console.log('8888888'),(reason)=>console.log(reason))
```
不会报错，如果状态是onResolved会静默处理，如果状态是onrejected由于没有回调.then就无法捕获错误，错误就会抛出。

4. promise的错误透穿=>promise.prototype.catch语法糖的产生
```
let promise1 = new Promise((resolve,reject)=>{
            setTimeout(()=>{
                reject('onRejected-失败的回调');
                // resolve('onResolved-成功的回调')
            },1000)
        })
        .then(value => console.log('第一次成功回调',value)
        // , (reason)=>{throw '000000'}
        )
        .then(value => console.log('第二次成功回调',value))
        .catch(reason => console.log('失败的回调',reason))
        .then(value => console.log(value,'第三次成功的回调'))
```
promise对象的状态如果变成rejected时: .then()就算没有第二个参数，也会默认改成(reason)=>{throw reason}，将reason信息转化成错误抛出，.catch就可以捕获这种错误。
而以上代码块为什么没有返回‘第二次成功回调’是因为第一次回调返回的实例对象的状态是rejected,第二次回调没有第二个参数就又一次默认抛出了错误，等到.catch才捕获这个错误传出。

5. promise.catch的好处=>为什么要生成一个新的语法糖？
```
let promise8 = new Promise((resolve, reject)=>{
            resolve('onResolved-成功的回调')
        })
        promise8.then(
        value => {
            console.log('第一次成功的回调',value)
            throw new Error('不小心抛出了一个错误')
        },
        reason => console.log('第一次失败的回调',reason)
        )
        // .then(
        // value => console.log('第二次成功的回调',value),
        // reason => console.log('第二次失败的回调',reason)
        // )
        .catch(reason => console.log('捕获的错误',reason))
```
如果第一次回调的.then返回了错误信息，并且没有写第二次回调.then，错误就无法被捕获。

###### promise的相关api:
promise.all()
描述：只要所有都返回成功才是成功状态，只要有一个错误状态，就会走错误状态；传参不一定是数组，但是必须拥有遍历器（遍历器介绍）
```
let promise4 = new Promise((resolve,reject)=>{
            setTimeout(()=>{
                resolve('onResolved-成功的回调1');
            },3000)
        })
        let promise5 = new Promise((resolve,reject)=>{
                resolve('onResolved-成功的回调2');
        })
        let promise6 = new Promise((resolve,reject)=>{
                resolve('onResolved-成功的回调3');
        })
        let allPromise = Promise.all([promise4,promise5,promise6])
        allPromise.then(
            value => console.log(value,'成功的回调'),
            reason => console.log(reason, '失败的回调')
        )
```
思考
1. promise.all()执行顺序=>输入的顺序就等于了返回的顺序吗？
通过以上的代码输出可知，输入的顺序就等于返回的顺序。

2. promise.all()如果存在两个失败状态会返回两个错误吗？
通过以上代码可知会返回一个错误，会将快速的那个失败进行返回

promise.race()
描述：哪一个实例的状态更改最快，就返回哪一个。入参同上
```
let promise4 = new Promise((resolve,reject)=>{
            setTimeout(()=>{
                resolve('onRejected-成功的回调1')
            },500)
        })
        let promise5 = new Promise((resolve,reject)=>{
                reject('onRejected-失败的回调2')
        })
        let promise6 = new Promise((resolve,reject)=>{
                resolve('onResolved-成功的回调3');
        })
        let racePromise = Promise.race([promise4,promise5,promise6])
        racePromise.then(
            value => console.log(value,'成功的回调'),
            reason => console.log(reason, '失败的回调')
        )
```
Promise.allSettled ()
描述：无论实例的状态是reject还是resolve;最后都会调用.then方法。
```
let promise4 = new Promise((resolve,reject)=>{
            setTimeout(()=>{
                resolve('onRejected-成功的回调1')
            },500)
        })
        let promise5 = new Promise((resolve,reject)=>{
                reject('onRejected-失败的回调2')
        })
        let promise6 = new Promise((resolve,reject)=>{
                resolve('onResolved-成功的回调3');
        })
        let allSettledPromise = Promise.allSettled([promise4,promise5,promise6])
        allSettledPromise.then(
            value => console.log(value,'成功的回调'),
            reason => console.log(reason, '失败的回调')
        )
```
运行上面代码可知：返回的格式[{reason: ‘error’,status: ‘reject’},{status:’fulfilled’,value:’success’}]

Promise.any()
描述：返回的实例状态有成功状态则走.then,如果全是reject状态，则返回‘AggregateError: All promises were rejected’被.then()第二个参数捕获
```
let promise4 = new Promise((resolve,reject)=>{
                reject('onRejected-失败的回调1')
        })
        let promise5 = new Promise((resolve,reject)=>{
                reject('onRejected-失败的回调2')
        })
        let promise6 = new Promise((resolve,reject)=>{
                reject('onResolved-失败的回调3');
        })
        let anyPromise = Promise.any([promise4,promise5,promise6])
        anyPromise.then(
            value => console.log(value,'成功的回调'),
            reason => console.log(reason, '失败的回调')
        )
```
Promise.resolve()
描述：该方法返回一个解析过的Promise对象

思考：
如果Promise.resolve（）参数是一个promise.reject(reason)，会返回什么呢？
```
let promise9 = Promise.resolve('promise对象')
        console.log(promise9)
        let promise10 = Promise.resolve(Promise.reject('失败状态的Promise对象'))
        console.log(promise10)
```
运行上面代码可知,promise.resolve的参数如果本身是promise对象则返回该对象。