"use strict";

/***
 * @author Eduardo Hattori
 * @date 26/09/16.
 */
module.exports = function(app){

    var requestHelper = app.modules.helpers.requestHelper;
    var userDomain    = app.modules.domains.userDomain;
    var tokenDomain   = app.modules.domains.tokenDomain;

    var userController = {

        /**
         * Cria um usuario
         * @param req
         * @param res
         */
        create : function(req, res){

            requestHelper.setResponse(res);

            var objectRequest = req.body;
            var userObject    = userDomain.isValid(objectRequest);

            if(userObject._error){
                requestHelper.error(userObject, 400, "Invalid Parameter ");
            } else {
                userDomain.save(userObject, function(err, data){
                    if(err) requestHelper.error(err, 400);
                    requestHelper.success(data, 201);
                });
            }
        },

        login : function(req, res){

            requestHelper.setResponse(res);

            var objectRequest = req.body;

            userDomain.login(objectRequest.email, objectRequest.password, function(err, userLogged){
                if(err){
                    if(err.error == "User Not Found")
                        requestHelper.error(err.error, 404);
                    else
                        requestHelper.error(err, 400);
                } else {
                    tokenDomain.createToken(userLogged, function(err, userWithToken){
                        if(err) requestHelper.error(err, 400);

                        userLogged.token = userWithToken.token;
                        requestHelper.success(userLogged, 200);
                    });
                }
            });
        }
    };

    return userController;
};
