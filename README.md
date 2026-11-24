# 此项目用于全栈知识的学习与巩固

git提交规范：
- feat: 新功能（feature）
- fix: 修补bug
- docs: 文档（documentation）
- style: 格式（不影响代码运行的变动）
- refactor: 重构（即不是新增功能，也不是修改bug的代码变动）
- test: 增加测试
- chore: 构建过程或辅助工具的变动

# 随笔记

- 关于路由模式：
    hash模式路由也许不利于该框架的ssr渲染， 因为#/之后带来的参数，服务器对它无感知。
    在需要ssr场景注入变量的情况下，hash模式并不友好