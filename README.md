# 写在前面
> 作为豆瓣的一个深度用户，这里凝结着这些年来看过的书，做过的思考，每每闲来无事，会希望能反复翻阅曾经的只言片语。近来由于担心自己的数据突然消失，故认为还是有一份本地保存的好，如果你也有类似的想法，那么这个小工具大概适合你。
**这份工具暂只支持几种数据类型，也没有获取对应的图片。** （因为我没有服务器。。。:smirk: ）

# Support List
## 书
- 想读
- 在读
- 读过
- 笔记
***

## 影视
- 想看
- 在看
- 看过
***

## 音乐
- 想听
- 在听
- 听过
***

## 评论
- 影评
- 书评
***

## 个人动态、相册 （暂不支持）
***

# 安装方式
## 预安装基本开发环境
- Install **[Git](https://git-scm.com/download/mac)**
- Install the lastest **[Nodejs](https://nodejs.org/en/)**
- Install **[npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)**

```bash
# 下载
git clone https://github.com/VeraWei/douban-data-storage.git

# 安装依赖
npm install

# 获取 HTML 数据 (eg. PERSONAL_KEY=nothinganymore sh ./script/dev.sh)
PERSONAL_KEY=[your-douban-id] sh ./script/dev.sh

# 你可以在你本地的 personal 文件夹下看到所有的数据内容，应该是一些 html 和 几份json数据
# html 只做了简单的处理，可直接打开。
## output directory
/personal
  /book
    /annotation
    /collect
    /do
    /wish
  /music
    /collect
    /do
    /wish
  /movie
    /collect
    /do
    /wish
  /json
    annotation.json
    book.json
    movie.json
    music.json
    reviews.json
```

# Next
## 我用我自己的这些数据来做了什么，仅供你参考。[TODO]
- 重新布局渲染页面
- 发布到**[个人主页](https://verawei.github.io/mymind)**
- 设置github actions 去自动执行更新数据任务