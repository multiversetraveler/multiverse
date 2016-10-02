"use strict";

/***
 * @author Eduardo Hattori
 * @date 26/09/16.
 */
"use strict";

/***
 * @author Eduardo Hattori
 * @date 14/09/16.
 */
module.exports = function(app){

    var requestHelper = {
        _res  : null,
        _send : {},
        _sent : false,
        setResponse : function(res){
            this._res  = res;
            this._send = res.send;
            this._sent = false;
            var self   = this;

            this._res.send = function(data){
                if(self._sent) return;
                self._send.bind(self._res)(data);
                self._sent = true;
            };
        },
        success : function(data, status){
            var ret = {};

            if(Array.isArray(data)){
                ret.records     = data;
                ret.total_items = arguments[2] ? arguments[2] : data.length;
            } else {
                ret.record = data;
            }
            this._res.status((status ? status : 200)).send(ret);
        },
        error : function(err, status){
            var ret = { errors : [err], developerMessage : arguments[2] ? arguments[2] : "" };
            this._res.status((status ? status : 500)).send(ret);
        }
    };

    return requestHelper;

};


