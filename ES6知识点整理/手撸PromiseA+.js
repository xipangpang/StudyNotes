const PENDING = 'pending';
const REJECTED = 'rejected';
const RESOLVED = 'resolved';
function myPromise(fn) {
    let self = this;
    this.resolveArr = [];
    this.rejectArr = [];
    this.status = PENDING;
    this.value = null;
    function resolve(value) {
        if(value instanceof myPromise) {
            value.then(resolve,reject)
        }
        setTimeout(()=>{
            if (self.status === PENDING) {
                self.status = RESOLVED;
                self.value = value;
                self.resolveArr.forEach(callback => {
                    callback(value)
                });
            }
        })
    }

    function reject(value) {
        setTimeout(()=>{
            if(self.status === PENDING){
                self.status = REJECTED;
                self.value = value;
                self.rejectArr.forEach((value)=>{
                    callback(value)
                })
            }
        })
    }

    try {
        fn(resolve,reject)
    } catch (error) {
        reject(error)
    }
}
function resolvePromise (promise,x,resolve,reject) {
    if(promise === x) throw '不要重复循环';
    let called
    if((x !== null && typeof x === 'object') || typeof x === 'function'){
        let then = x.then;
        try {
            if(typeof then === 'function') {
                    then.call(x,function(y){
                        if(called) return;
                        called = true;
                        resolvePromise(promise,y,resolve,reject)
                    },function(r){
                        if(called) return;
                        called = true;
                        reject(r)
                    })
            
            }else {
                resolve(x)
            }
        } catch (error) {
            if(called) return;
            called = true;
            reject(error)
        }
    }else{
        resolve(x)
    }
}

myPromise.prototype.then = function(onResolved,onRejected) {
    typeof onResolved === 'function' ? onResolved : function(value){return value};
    typeof onReject === 'function' ? onRejected : function(error){throw '报错'};
    let self = this;
    let promise2 = new myPromise(function(resolve,reject){
        if(self.status === RESOLVED) {
            setTimeout(()=>{
                try {
                    const x = onResolved(self.value);
                    resolvePromise(promise2, x, resolve,reject)
                } catch (error) {
                    reject(error)
                }
            })
        }

        if(self.status === REJECTED) {
            setTimeout(()=>{
                try {
                    const x = onRejected(self.value);
                    resolvePromise(promise2,x,resolve,reject)
                } catch (error) {
                    reject(error)
                }
            })
        }

        if(self.status === PENDING) {
            self.resolveArr.push(function(){
                setTimeout(()=>{
                    try {
                        const x = onResolved(self.value);
                        resolvePromise(promise2,x,resolve,reject)
                    } catch (error) {
                        reject(error)
                    }
                })
            });

            self.rejectArr.push(function(){
                setTimeout(()=>{
                    try {
                        const x = onRejected(self.value);
                        resolvePromise(promise2,x,resolve,reject)
                    } catch (error) {
                        reject(error)
                    }
                })
            })
        }
    })
    return promise2;
}
new myPromise((resolve,reject)=>{
    resolve(11)
}).then((value)=>{
    return new myPromise((resolve,reject)=>{
        resolve('结果')
    })
})
.then((value)=>{
    console.log(value,'结果二次')
})


