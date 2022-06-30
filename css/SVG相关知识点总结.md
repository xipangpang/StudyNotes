### SVG相关知识点总结

##### 一、SVG基本形状：

###### 1.线段
```
<svg>
<line x1="0.7cm" y1="1cm" x2="0.7cm" y2="2.0cm" style="stroke:black;"/>
</svg>
```

###### 2.矩形
```
<svg>
<rect x="10" y="10" width="30" height="50"/>
</svg>
```

###### 3.圆和椭圆
```
<svg>
<circle cx="30" cy="30" r="20" style="stroke:black;fill:none"/>
</svg>
```

###### 4.多边形
```
<svg>
<polygon
points="35,27.7   37.9,46.1   46.9,46.1   39.7,51.5  42.3,60.1  style="fill:#ccffcc;stroke:black;stroke-width:2"/>
</svg>
```

###### 5.折线:最好fill:none否则svg会尝试填充形状
```
<svg>
<polyline points=“5 20,20 20，25 10,35 30，45 10,55 30 ，65 10， 75 30 80 20,95 20”
style="stroke:black;stroke-width:3;fill:none;"/>
</svg>
```

###### 6.线帽和线连接
```
<svg>
<line x1="10" y1="15" x2="50" y2="15"
style="stroke:black;stroke-linecap:butt;stroke-width:15;"/>
<line x1="10" y1="45" x2="50" y2="45"
style="stroke:black;stroke-linecap:round;stroke-width:15"/>
<line x1="10" y1="75" x2="50" y2="75"
style="stroke:black;stroke-linecap:square;stroke-width:15;"/>

<!--灰色线-->
<line x1="10" y1="0" x2="10" y2="100" style="stroke:#999;"/>
<line x1="50" y1="0" x2="50" y2="100" style="stroke:#999;"/>
</svg>
```


##### 二、SVG分组和引用对象

###### 1.<g>元素可以将图片进行分组组合在一张svg上面
```
<svg>
<g id="man" style="fill:none;stroke:black">
<desc>Male human</desc>
<circle cx="85" cy="56" r="10"/>
<line x1="85" y1="66" x2="85" y2="80"/>
</g>
</svg>
```

###### 2.<use>元素就可以复制粘贴元素
```
<svg>
<g id="man" style="fill:none;stroke:black">
<desc>Male human</desc>
<circle cx="85" cy="56" r="10"/>
<line x1="85" y1="66" x2="85" y2="80"/>
</g>
<use xlink:href="#man" x="-30"y="100"/>
</svg>
```

###### 3.<defs>元素可以隐藏模型元素，然后让<use>进行复制
```
<svg>
<defs>
<g id="man" style="fill:none;stroke:black">
<desc>Male human</desc>
<circle cx="85" cy="56" r="10"/>
<line x1="85" y1="66" x2="85" y2="80"/>
</g>
<use xlink:href="#man" x="-30"y="100"/>
</svg>
```