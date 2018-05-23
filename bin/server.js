process.env.NODE_ENV = 'development';//先将该变量给显设置为“production”否则config里的目结构不会变，打包出来的还是开发模式
const config = require('../config')
const server = require('../server/main')
const debug = require('debug')('app:bin:server')
const port = config.server_port

server.listen(port)
debug(`server is now running at http://localhost:${port}`)