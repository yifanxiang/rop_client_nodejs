/**
 * Created by yfx on 2016-11-18.
 */
const {RopUtils,UploadFile} =require("../../lib/index");
const PingRequest = require("../mode/pingrequest");
const clientInfo =require("../cfg/clientinfo");

let ropUtils=new RopUtils(clientInfo.services_url,clientInfo.app_key,clientInfo.app_secret);

let pingRequest=new PingRequest();
let duAsync = async() => {
    let pingRequest=new PingRequest();
    let response=await ropUtils.doPostByObj(pingRequest);
    console.log(response);
};
duAsync();

let duAsync_01 = async() => {
    let uploadFile=new UploadFile();
    await uploadFile.init("/tmp/test.pdf");
    console.log(uploadFile.toString());
};
duAsync_01();