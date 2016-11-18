/**
 * Created by yfx on 2016-11-18.
 */
let RichServiceRequest = require("./mode/richservicerequest");
let UploadFile = require("./mode/uploadfile");
let RopUtils = require("./util/roputils");
let ShaUtils =require("./util/shautils");
let RopClient={
    RichServiceRequest:RichServiceRequest,
    UploadFile:UploadFile,
    RopUtils:RopUtils,
    ShaUtils:ShaUtils
}
module.exports=RopClient;
