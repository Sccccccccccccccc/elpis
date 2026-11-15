loader对应BFF层的业务逻辑，其中：

- 接入层 ： router 接口路由分发 ，router-schema 路由规则， router-middleware 路由中间件

    ↓
- 业务层 ： controller 控制器，env 环境分发，config 提取，extend 服务拓展，schedule 定时任务

    ↓
- 输出层 ： service 处理器

