const glob = require('glob');
const path = require('path');
const { sep } = path;
const _ = require('lodash');

// project 继承 model 方法
const projectExtendModel = (model, project) => {
    return _.mergeWith({}, model, project, (modelValue, projectValue) => {
        if (Array.isArray(modelValue) && Array.isArray(projectValue)) {
            let result = [];

            // 因为project 继承 model, 所以需要处理修改和新增内容的情况
            // project有的键值，model也有 => 修改（重载）
            // project有的键值，model没有 => 新增
            // model有的键值，project没有 => 保留（继承）

            // 处理修改和保留
            for( let i = 0; i < modelValue.length; i++ ) {
                let modelItem = modelValue[i];
                const projItem = projectValue.find(item => item.key === modelItem.key);

                // project有的键值，model也有, 则递归调用 projectExtendModel 方法覆盖修改
                result.push(projItem ? projectExtendModel(modelItem, projItem) : modelItem);
            }

            // 处理新增
            for( let i = 0; i < projectValue.length; i++ ) {
                const projItem = projectValue[i];
                const modelItem = modelValue.find(item => item.key === projItem.key);
                if( !modelItem ) {
                    result.push(projItem);
                }
            }

            return result
        }
    })
}

/**
 * 解析 model 配置， 并返回组织且继承后的数据结构
 * [
 *  {
 *    modelKey: ${model},
 *    project: {
 *      projKey1: ${proj1},
 *      projKey2: ${proj2},
 *    },
 *  }
 * ]
 * @param {*} app 
 */
module.exports = (app) => {
    const modelList = [];

    // 遍历当前文件夹，构造模型数据结构，挂载到modelList中
    const modelPath = path.resolve( app.baseDir, `.${sep}model`)
    const fileList = glob.sync( path.resolve(modelPath, `.${sep}**${sep}**.js`));
    fileList.forEach( file => {
        if( file.indexOf('index.js') > -1) { return };

        // glob 在 Windows 上返回的是 "/" 分隔的路径（C:/xxx/model/business/...），
        // 而 path.sep 是 "\"，直接用 `${sep}project${sep}` 永远匹配不到，
        // 所以统一转成 "/" 再做类型判断和正则提取
        const normalizedFile = file.split(sep).join('/');

        // 区分配置类型( model / project )
        const type = normalizedFile.includes('/project/') ? 'project' : 'model';        

        if( type === 'project' ) {
            const modelKey = normalizedFile.match(/\/model\/(.*?)\/project/)?.[1];
            const projKey = normalizedFile.match(/\/project\/(.*?)\.js/)?.[1];
            let modelItem = modelList.find( item => item.model?.key === modelKey);
            if( !modelItem ) {
                // 初始化 model 数据结构
                modelItem = {}
                modelList.push( modelItem );
            }
            if( !modelItem.project ) {
                modelItem.project = {};
            }
            modelItem.project[projKey] = require(path.resolve(file));
            modelItem.project[projKey].key = projKey; // 注入 projectkey

        }

        if( type === 'model' ) {
            const modelKey = normalizedFile.match(/\/model\/(.*?)\/model\.js/)?.[1];
            // console.log("---modelKey-----", modelKey);
            let modelItem = modelList.find( item => item.model?.key === modelKey );
            if( !modelItem ) {
                modelItem = {};
                modelList.push(modelItem);
            }
            modelItem.model = require(path.resolve(file));
            modelItem.model.key = modelKey;
            
        }

    })

    // 整理数据: project => 继承 model
    modelList.forEach( item => {
        const { model, project } = item;
        for( const key in project ) {
            // 直接把继承后的结果写回 project[key]，
            // 这样 project.pdd.menu 本身就是「model + project」合并后的菜单，
            project[key] = projectExtendModel( model, project[key] );
        }
    })

    return modelList;
}