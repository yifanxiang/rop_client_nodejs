'use strict';
let fs = require("fs");
let request  = require("request");
let qs  = require("querystring");
/**
 * 工具类用于生成rop请求和一些常用于处理功能
 */
function RopUtils(services_url,app_key,app_secret){
    this.services_url=services_url;
    this.app_key=app_key;
    this.app_secret=app_secret;
    this.boundary="---------------------------7df27332f1714";//文件上传时,http的参数默认分隔符
    this.cv='1.0.0';
}

//初始化文件记录
RopUtils.prototype.getFileContent=async function(filePath,encodeing='utf8'){
    var p=()=>{
        return new Promise((resolve, reject) =>{
            fs.readFile(filePath,encodeing,function(err,byteData){
                if (err){
                    reject(err);
                }else{
                    resolve(byteData);
                }
            });
        });
    };
    let t = await p();
    return t;
}

/**
 * 得到文件名称
 * @param filePath路径
 */
RopUtils.prototype.getfileName=function(filePath=null){
    if(filePath==null||filePath.trim()==''){return "";}
    if(filePath.indexOf("/")>-1){
        return filePath.substr(filePath.lastIndexOf("/")+1);
    }else if(filePath.indexOf("\\")>-1){
        return filePath.substr(filePath.lastIndexOf("\\")+1);
    }else{
        return filePath.trim();
    }
}
/**
 * @v 请求方法当前版本,默认为1.0
 * @method 请求方法
 * 得到一个简单的请求头
 **/
RopUtils.prototype.getHeader=function(v='1.0',method=''){
    if(method==''||method==null){
        throw new Error("请求method不能为空");
    }
    let ts=new Date().getTime();
    return {
        "ts":ts,
        "locale":"zh_CN",
        "v":v,
        "method":method,
        "appKey":this.app_key
    };
};
/**
 * @deprecated 得到一个简单的扩展信息
 **/
RopUtils.prototype.getExtInfoJson=function(){
    let $this=this;
    return {
        "cv":$this.cv
    };
};

/**数组内部数据联接
 * @values 关联数组,待拼接数组
 * @ignoreParamNames 数字数组,过滤数组,应过滤掉
 * 返回拼接的字符串
 * */
RopUtils.prototype.contactValues=function(values,ignoreParamNames=null,isMultipart=false){
    let UploadFile = require("../mode/uploadfile");
    let contactStr='';
    if(values!=null){
        let keys=Object.keys(values).sort();
        for (let i in keys) {
            let key=keys[i];
            if(ignoreParamNames!=null&&ignoreParamNames.find((d)=>{return key==d;})){
                continue;
            }
            let val=values[key];
            if(val!=undefined&&val!=null){
                if(val instanceof UploadFile){
                    contactStr+=key+""+val.uploadStr;
                }else{
                    contactStr+=key+""+val;
                }
            }else{
                contactStr+=val;
            }
        }
    }
    return contactStr;
};

/**
 * 对ropClient请求签名
 **/
RopUtils.prototype.sign=function(requestJson,ignoreSign,headerJson,extInfoJson,isMultipart){
    let shaUtils=require("./shautils");
    if(headerJson==null||!this.app_secret){
        throw new Error("请求头或客户端secret为空");
    }
    //初始化字符串
    let contactStr=this.app_secret;
    //加入请求参数
    contactStr+=this.contactValues(requestJson,ignoreSign,isMultipart);
    //加入请坟头参数
    contactStr+=this.contactValues(headerJson,null);
    //加入ext信息
    contactStr+=this.contactValues(extInfoJson,null);
    //必须将sha1生成数据转为大写,rop服务端支持大写
    return shaUtils.getSha1(contactStr).toUpperCase();
};

/**
 * @$extInfoMap扩展信息转为string
 * */
RopUtils.prototype.encryptExtInfo=(extInfoJson)=>{
    if(extInfoJson == null ){
        return "";
    }
    let contactStr="";
    for(let key in extInfoJson){
        let val=extInfoJson[key];
        contactStr+=encodeURIComponent(key)+"%01"+encodeURIComponent(val)+"&02";//'use strict';
    }
    contactStr=contactStr.substr(0,contactStr.length-3);
    return  contactStr;
};

/**
 * 取得请求头str，注意\r\n \001这种有转意的需用""符，''符号php部份函数不支持
 * */
RopUtils.prototype.createHeaderJson=function(headerJson,extInfoJson,sign,isMultipart){
    let contentType="application/x-www-form-urlencoded; charset=UTF-8";
    if(isMultipart){
        contentType="multipart/form-data; boundary="+this.boundary;
    }
    let contactJson={};
    for(let key in headerJson){
        let val=headerJson[key];
        contactJson[key]=val;
    }
    //ext
    contactJson['ext']=this.encryptExtInfo(extInfoJson);
    //sign
    contactJson['sign']=sign;
    //其它信息
    contactJson['user-agent']="nodejs";
    contactJson['Content-type']=contentType;
    contactJson['accept']='text/html, image/gif, image/jpeg, *; q=.2, */*; q=.2';
    contactJson['connection']='keep-alive';
    return contactJson;
};


/**
 * 创建用于上传文件的请求body体（html文件上传的正确格式）
 * rop框架其实没有使用到正确的构建文件的格式体
 * rop上传提交文件，其实是对文件内容做了编码改为键值在传递
 * @param 请求参数  $paramArr
 * @param form文件上传分隔线  $boundary
 * @return string
 */
RopUtils.prototype.buildFormData=function(paramJson){
    let UploadFile = require("../mode/uploadfile");
    let contactStr='';
    if(paramJson!=null){
        for(let key in paramJson){
            let val=paramJson[key];
            let fileFlag=(val instanceof UploadFile);
            contactStr+="--"+this.boundary+"\r\n";
            contactStr+="Content-Disposition: form-data; name=\""+key+"\"\r\n";
            contactStr+="\r\n";
            //参数处理
            if(fileFlag){
                //是文件体
                contactStr+=val.uploadStr+"\r\n";
            }else{
                contactStr+=val+"\r\n";
            }
        }
        if($contactStr!=""){
            contactStr+="--"+this.boundary+"\r\n";
        }
    }
    return contactStr;
};


/**
 * 请求rop服务端
 * */
RopUtils.prototype.doPost=async function(requestJson,ignoreSign,headerJson,isMultipart=false){

    let extInfoJson=this.getExtInfoJson();
    let sign=this.sign(requestJson, ignoreSign, headerJson, extInfoJson,isMultipart);
    let createHeaderJson=this.createHeaderJson(headerJson, extInfoJson, sign,isMultipart);
    let content="";
    if(isMultipart){
        content=this.buildFormData(requestJson);
        createHeaderJson["Content-Length"]=content.length;
    }else{
        content=qs.stringify(requestJson);
    }
    var p=async ()=>{
        return new Promise((resolve, reject) =>{
            request({
                    method: 'POST',
                    preambleCRLF: true,
                    postambleCRLF: true,
                    uri: this.services_url,
                    headers:createHeaderJson,
                    body:content
                },function(error,response,body){
                    if (!error && response.statusCode == 200) {
                        resolve(body);
                    }else{
                        reject(error);
                    }
                }
            );
        });
    };
    let t =await p();
    return t;
};

/**
 * 请求rop服务端
 * @param  requestObj 请求对象
 * @throws Error
 * @return string 返回请求结果
 */
RopUtils.prototype.doPostByObj=async function(requestObj){
    let RichServiceRequest=require("../mode/richservicerequest.js");
    //查看继承关系
    //if(typeof(requestObj)=='object'&&requestObj instanceof RichServiceRequest){
        if(requestObj.validate()){
            let headerJson=this.getHeader(requestObj.getVersion(),requestObj.getMethod());
            let requestJson=requestObj.getObject2Json();
            return await this.doPost(requestJson, requestObj.getIgnoreSign(),headerJson,requestObj.isMultipart);
        }
    //}else{
    //    throw new Error("requestObj is not a RichServiceRequest obj");
    //}
};

module.exports = RopUtils;