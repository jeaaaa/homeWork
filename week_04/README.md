# qiankun-example

qiankun 实战 demo，父应用 vue，子应用用 react 和 vue

[微前端qiankun从搭建到部署的实践](https://juejin.im/post/6875462470593904653)

## 开始
一键安装所有主子应用的依赖
```
yarn
```

一键启动所有应用
```
yarn start
```

一键打包所有应用
```
yarn build
```

docker运行：
执行构建命令
```
docker build -t qiankun .
```
运行镜像
```
docker run -itd --name qiankunApp -p 8090:80 qiankun
```

通过 [http://localhost:8090/](http://localhost:8090/) 访问主应用。
