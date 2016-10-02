"use strict";

/***
 * Mapeamento das rotas
 * @author Eduardo Hattori
 * @date 09/08/16.
 */
module.exports = function(app){

    var userController  = app.modules.controllers.userController;

    //USER ROUTES
    app.post("/api/user", userController.create);

    //AUTH ROUTES
    app.post("/api/auth/login", userController.login);
};
