'use strict';
const crypto = require("crypto");
const fs = require("fs");
const RopUtils = require("./roputils.js");
/**
 * Created by yfx on 2016-07-26.
 * 工具类用于生成sha和md5值
 */
const ShaUtils ={

    getSha1:function(str){
        return this.getSha("sha1",str);
    },

    getSha256:function(str){
        return this.getSha("sha256",str);
    },

    getSha512:function(str){
        return this.getSha("sha512",str);
    },

    getMd5:function(str){
        return this.getSha("md5",str);
    },

    getBase64Encode:function(str){
        if(str==null||str.trim()==''){return "";}
        return new Buffer(str).toString('base64');
    },

    getBase64Decode:function(str){
        if(str==null||str.trim()==''){return "";}
        return new Buffer(str, 'base64').toString();
    },

    getSha1File: async function(filePath){
        let str=await this.getFileContent(filePath);
        return this.getSha1(str);
    },

    getSha256File:async function(filePath){
        let str=await this.getFileContent(filePath);
        return this.getSha256(str);
    },

    getSha512File:async function(filePath){
        let str=await this.getFileContent(filePath);
        return this.getSha512(str);
    },

    getMd5File:async function(filePath){
        let str=await this.getFileContent(filePath);
        return this.getMd5(str);
    },

    getSha:function(algorithm,str){
        if(str==null||str.trim()==''){return "";}
        let s= crypto.createHash(algorithm);
        s.update(str.trim(),"utf-8");//这个必须加utf-8，否则处理中文出错
        str=s.digest('hex');
        return str;
    },
    /**
     * 得到文件内容
     * @param filePath路径
     */
    getFileContent:async function(filePath,encodeing='utf8'){
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
};

module.exports = ShaUtils;