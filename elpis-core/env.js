module.exports = (app) => {
    return {
        // 判断是否为本地环境
        isLocal() {
            return process.env.NODE_ENV === 'local'
        },
        // 判断是否为测试环境
        isBeta() {
            return process.env.NODE_ENV === 'beta'
        },
        // 判断是否为生产环境
        isProd() {
            return process.env.NODE_ENV === 'production'
        },

        get() {
            return process.env.NODE_ENV ?? 'local'
        }
    }
}