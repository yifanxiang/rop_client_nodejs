/**
 * Created by yfx on 2016-11-18.
 */
let {RopUtils,UploadFile} =require("../../src/index");
let clientInfo = require("../cfg/clientinfo");
let PingRequest = require("../mode/pingrequest");

let ropUtils=new RopUtils(clientInfo.services_url,clientInfo.app_key,clientInfo.app_secret);
/*
const duAsync = async() => {
    let pingRequest=new PingRequest();
    let response=await ropUtils.doPostByObj(pingRequest);
    console.log(response);
};
duAsync();
*/
const duAsync = async() => {
    let uploadFile=new UploadFile();
    await uploadFile.init("/tmp/test.pdf");
    console.log(uploadFile.toString());
};
duAsync();