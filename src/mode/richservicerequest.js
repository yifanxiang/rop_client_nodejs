'use strict';
const shaUtils = require("../util/shautils");
const UploadFile = require("./uploadfile");
/**
 * Created by yfx
 * 使用function这种最原始的方法输出,其它的如()=>{}这种和exports default这种都不能支持将多个class最终放入到一个js中使用，
 * 插件开发用原生的写法
 */
function RichServiceRequest(){
    //是否有文件上传，默认不上传文件
    this.isMultipart=false;
};
//请求的版本号
RichServiceRequest.prototype.getVersion=function(){
    return this.v;
};
//请求的方法
RichServiceRequest.prototype.getMethod=function(){
    return this.method;
};

RichServiceRequest.prototype.getObject2Json=function(){
    let resultJson={};
    for(let k in this){
        let v=this[k];
        if(v instanceof UploadFile){
            this.isMultipart=true;
            if(v.content==null){
                continue;
            }
            v.uploadStr=shaUtils.getBase64Encode(v.fileName)+"@"+shaUtils.getBase64Encode(v.content);
            v.uploadStr=v.uploadStr.replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'');
            v.content=null;
        }else{
            if(typeof(v)=='function'){continue;}
        }
        if(k!='isMultipart'&&k!="v"&&k!="method"){
            resultJson[k]=v;
        }
    }
    return resultJson;
};
/**默认的验证方法*/
RichServiceRequest.prototype.validate=function(){
    return true;
};
/**不签名的字段*/
RichServiceRequest.prototype.getIgnoreSign=function(){
    return null;
};

RichServiceRequest.prototype.trim=function(str){
    if(str==undefined||str==null){return '';}
    return str+"".trim();
};

module.exports = RichServiceRequest;