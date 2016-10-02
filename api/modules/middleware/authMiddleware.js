"use strict";

/***
 * @author Eduardo Hattori
 * @date 26/09/16.
 */
module.exports = function(app){

    var tokenDomain   = app.modules.domains.tokenDomain;
    var requestHelper = app.modules.helpers.requestHelper;
    var cryptoHelper  = app.modules.helpers.cryptoHelper;

    var auth =  {
        isLogged : function(req, res ,next){

            requestHelper.setResponse(res);

            var bearerHeader = req.headers['authorization'];

            if(bearerHeader !== undefined){
                var bearer      = bearerHeader.split(" ");
                var bearerToken = bearer[1];
                tokenDomain.isValid(bearerToken, function(err, tk){

                    if(err || (tk && tk.isValid == false))
                        requestHelper.error({
                            errors : [(err || tk.displayError)]
                        },403);
                    else {
                        if(tk.token){
                            res.data = {token : tk.token };
                            next();
                        } else {

                            var user = cryptoHelper.decrypt(tk.token);

                            requestHelper.error("Token is not valid", 403);
                        }
                    }
                });

            } else {
                requestHelper.error("Action not Authorizate", 403);
            }
        },
        isLoggedAdmin : function(req, res ,next){

            var bearerHeader = req.headers['authorization'];

            if(bearerHeader !== undefined){
                var bearer      = bearerHeader.split(" ");
                var bearerToken = bearer[1];
                tokenDomain.isValid(bearerToken, function(err, tk){

                    if(err || (tk && tk.isValid == false))
                        requestHelper.error({
                            errors : [(err || tk.displayError)]
                        },403);
                    else {
                        if(tk.token){
                            res.data = {token : tk.token };
                            var user = cryptoHelper.decrypt(tk.token);

                            if(user.type == "A")
                                next();
                            else
                                requestHelper.error("Not Authorized", 403);
                        } else {
                            requestHelper.error("Token is not valid", 403);
                        }
                    }
                });

            } else {
                requestHelper.error("Action not Authorizate", 403);
            }
        }
    };

    return auth;
};