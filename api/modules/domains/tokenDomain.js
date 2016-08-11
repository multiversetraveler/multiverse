"use strict";

/***
 * @author Eduardo Hattori
 * @date 10/08/16.
 */

module.exports = function(app){

    var client = (app.modules.infra.elasticSearchInfra).getConnection();
    var moment = require("moment");


    var tokenDomain = {

        /***
         * Seta um token no cache
         *
         * @param userid
         * @param token
         * @param callback
         */
        setToken : function(userid, token, callback){

            client.create({
                index : "usertokens",
                type : "usertype",
                id : token,
                body : {
                    token : token,
                    userid : userid,
                    data : moment().format("YYYY-MM_DD HH:mm:ss")
                }
            }, function(err, response){
                if(err)
                    callback(err, null);
                else
                    callback(null,response);
            });
        }

    };


    return tokenDomain;
};
