"use strict";

/***
 * @author Eduardo Hattori
 * @date 26/09/16.
 */
describe("Testa o middlewar de autenticação",function(){

    var app;
    var should;
    var middleware;
    var request;
    var MockExpressRequest;
    var MockExpressResponse;

    before(function(done){

        process.env.NODE_ENV = "test";

        app        = require('../../app');
        should     = require('should');
        middleware = app.modules.middleware.authMiddleware;
        MockExpressRequest  = require('mock-express-request');
        MockExpressResponse = require('mock-express-response');
        done();
    });

    it("Deveria existir o middleware", function(done){

        (middleware !== undefined).should.be.true();
        done();
    });
});
