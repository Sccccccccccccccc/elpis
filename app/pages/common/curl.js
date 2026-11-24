/**
 * 前端封装的 curl 请求
 * @param {object} options 请求参数
 * 
 */
import { ElMessage } from 'element-plus';

const curl = ({
    url, // 请求地址
    method = 'POST', // 请求方法
    headers = {}, // 请求头
    query = {}, // url query
    data = {}, // post body
    responseType = 'json', // 响应类型
    timeout = 60000, // 超时时间
    errorMessage = '网络异常，请稍后重试', // 错误信息
}) => {

    // 页面模板里通过 CDN 引入了 js-md5，暴露为全局 window.md5
    // 这里不能 require('md5')：那个包依赖 Node 的 crypto，webpack 5 浏览器端没有 polyfill
    const md5 = typeof window !== 'undefined' ? window.md5 : null;

    if (typeof md5 !== 'function') {
        ElMessage.error('md5 未加载，无法生成接口签名');
        return Promise.resolve({
            success: false,
            code: 1001,
            message: 'md5 未加载',
        });
    }

    // 接口签名处理 
    // TODO: signKey 从配置文件中读取
    const signKey = 'djasiodajdalsjifpasdjoas'
    const st = Date.now()

    const dtoHeaders = {
        ...headers,
        s_t: st,
        s_sign: md5(`${signKey}_${st}`),
    }

    if( url.indexOf('/api/project') > -1 && window.project_key ) {
        dtoHeaders.project_key = window.project_key;
    }

    // 构造请求参数（转换为axios参数）
    const ajaxSettings = {
        url,
        method,
        params: query,
        data,
        responseType,
        timeout,
        headers: dtoHeaders,
    }

    return axios.request(ajaxSettings).then( (res) => {
        const resData = res.data || {}

        // 后端API返回格式
        const { success } = resData;

        // 请求失败
        if( !success ) {
            const { message, code } = resData;
            if( code === 442 ) {
                ElMessage.error('请求参数异常');
            }else if( code === 445 ) {
                ElMessage.error('请求不合法');
            }else if( code === 446 ) {
                ElMessage.error('缺少项目必要参数');
            }else if( code === 50000 ) {
                ElMessage.error(message);
            }else {
                ElMessage.error(errorMessage);
            }

            console.error(message);
            
            return Promise.resolve({
                success,
                code,
                message
            })
        }

        // 请求成功
        const { data, metadata } = resData;

        return Promise.resolve({
            success,
            data,
            metadata
        });

    }).catch( (err) => {
        const { message } = err

        if( message.match(/timeout/i) ) {
            return Promise.resolve({
                code: 1000,
                message: '请求超时'
            })
        } 

        return Promise.resolve(err)

    })
}

export default curl;