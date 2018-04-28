'use strict';
const fs = require("fs");
const RopUtil =  require("../util/roputils.js");
/**
 * Created by yfx on 2016-07-26.
 * 上传的文件对象
 */
function UploadFile(){
}
//初始化文件记录
UploadFile.prototype.init=async function(filePath){
    //组建请求参数
    let ropUtil=new RopUtil();
    //如果读取是图片,则编码不设置
    this.content=await ropUtil.getFileContent(filePath);
    this.fileName=ropUtil.getfileName(filePath);
};
//重写toString方法
UploadFile.prototype.toString=function(){
    return "fileType："+this.fileType+" fileName："+this.fileName+" content.length"+(this.content.length||0);
};

module.exports = UploadFile;