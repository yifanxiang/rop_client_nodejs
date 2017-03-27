'use strict';
let {RichServiceRequest} =require("../../lib/index");
/**
 * Created by yfx on 2016-07-26.
 */
function PingRequest(){
    RichServiceRequest.call(this);
    this.v="1.0";
    this.method="ping";
}
PingRequest.prototype=new RichServiceRequest();
module.exports=PingRequest;