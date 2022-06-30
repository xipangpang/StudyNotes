### 解决方法：Layui hint: Table modules: Did not match to field

Layui hint: Table modules: Did not match to field

楼主因为这个问题搜索了两个小时百度，然后现在过来总结一下百度大神们都是如何解决这个问题的

1.根据百度翻译来看，这个报错就是因为字段名不匹配，于是楼主一个个去对着字段看了十分钟，发现楼主的字段名并没有错误

所以第一个选项pass

2.还有人说是因为cols里面的filed=""就是也是空，但是楼主也看了一眼发现并不是这个问题，于是这个选项pass

3.还有人说是sort的问题，其实的的确确就是sort问题，楼主在论坛发现一个古早的帖子发现就是layui文档上要求写的是这样的

initSort: {
        field: 'id',
        type: 'asc'
        }
就是id就可以获取到filed值，但是其实并不能获取到，具体是什么问题，可能就是贤心大大可以解答。

后来将id改成filed字段名就变好了

initSort: {
        field: 'recTime',
        type: 'asc'
                    }
这就是两个小时的百度成果，此时是百度分享时刻