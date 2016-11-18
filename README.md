#rop_client
rop框架的nodejs客户端，可以快速联接rop相关的服务端

##intall
```
npm install rop_client
```

建议使用 npm.taobao.org 源来安装，详见 [npm.taobao.org](http://npm.taobao.org/)

## 使用rop_client
首先引用rop_client:
```
let {RichServiceRequest,UploadFile,RopUtils,ShaUtils} =require("rop_client");
```
###RichServiceRequest
1.RichServiceRequest构建一个请求类(例子)：
```
let {RichServiceRequest} = require("rop_client");
export default class extends RichServiceRequest{
    constructor() { //构造函数
        super();
        this.v="1.0";
        this.method="ping";
    }
}
```
2.生成ropUtils(需有services_url地址，app_key，app_secret)
```
let ropUtils=new RopUtils(clientInfo.services_url,clientInfo.app_key,clientInfo.app_secret);
```
3.然后请求服务：
```
const duAsync = async() => {
    let pingRequest=new PingRequest();
    let response=await ropUtils.doPostByObj(pingRequest);
    console.log(response);//返回{sucess:true}...
};
duAsync();
```
4.有参数上传参考：
```
export default class extends RichserviceRequest{
    constructor(applyNo) { //构造函数
        super(applyNo);
        this.v="1.0";
        this.method="sign.link.file";
        //以下为其它属性
        this.applyNo=applyNo;
    }
    /**验证方法，如果类中写入此方法则会先运行validate()有错执出Error*/
    validate(){
        this.applyNo=this.trim(this.applyNo);
        if(this.applyNo==''){
            throw new Error("applyNo is null");
        }
        return super.validate();
    }
}
```
5.对于有文件上传的情况，继承RichServiceRequest,并设置属行file,file后面传入值
```
let uploadFile=new UploadFile();
request.file=await uploadFile.init("/tmp/test.pdf");
let response=await ropUtils.doPostByObj(pingRequest);
```
6.RichserviceRequest特殊方法：
```
//validate 方法，验证方法，请求服务前会校验此方法
//getIgnoreSign 返回字符串数组,上传时运行此方法，这个方法返回的字段不会加入签名（一般文件字段不做签名）
//trim 处理字段为空的处理，转null空为http请求接收能为空的''
```


