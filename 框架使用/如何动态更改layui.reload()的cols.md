### 如何动态更改layui.reload()的cols
layui一般的数据表格的表头都是固定的，一般都是像下面的写法：
```
table.render({
    elem: '#demo'
    ,height: 312
    ,url: '/demo/table/user/' //数据接口
    ,page: true //开启分页
    ,cols: [[ //表头
      {field: 'id', title: 'ID', width:80, sort: true, fixed: 'left'}
      ,{field: 'username', title: '用户名', width:80}
      ,{field: 'sex', title: '性别', width:80, sort: true}
      ,{field: 'city', title: '城市', width:80} 
      ,{field: 'sign', title: '签名', width: 177}
      ,{field: 'experience', title: '积分', width: 80, sort: true}
      ,{field: 'score', title: '评分', width: 80, sort: true}
      ,{field: 'classify', title: '职业', width: 80}
      ,{field: 'wealth', title: '财富', width: 135, sort: true}
    ]]
  });
  
});
```

但是根据项目的需要，表头可能需要刷新更改数据，这个时候我们就应该将reload函数里面cols的col变成变量
```
obj.reload({
        where: opt,
        cols: [
            newcol
            ],
        page: {
            curr: 1 //重新从第 1 页开始
            }
                    });
```
至于看到这里了，表头如何改变呢，楼主最开始看表头是数组字符串想能不能用数组进行操作进行删除和添加呢，经过了一个端午节的纠结发现并不太行
于是吃了一个粽子的楼主发现原来cols里面有一个属性可以直接对表头数据进行修改，贤心大大真的是十分贴心了
当hide属性选择true的时候就不可以进行显示，当hide属性选择false的时候就能进行显示。

```
table.render({
    elem: '#demo'
    ,height: 312
    ,url: '/demo/table/user/' //数据接口
    ,page: true //开启分页
    ,cols: [[ //表头
      {field: 'id', title: 'ID', width:80, sort: true, fixed: 'left'}
      ,{field: 'username', title: '用户名', width:80}
      ,{field: 'sex', title: '性别', width:80, sort: true}
      ,{field: 'city', title: '城市', width:80} 
      ,{field: 'sign', title: '签名', width: 177}
      ,{field: 'experience', title: '积分', width: 80, sort: true}
      ,{field: 'score', title: '评分', width: 80, sort: true}
      ,{field: 'classify', title: '职业', width: 80}
      ,{field: 'wealth', title: '财富', width: 135, sort: true，hide:true}
    ]]
  });
  
});
```
此时财富就被隐藏掉了