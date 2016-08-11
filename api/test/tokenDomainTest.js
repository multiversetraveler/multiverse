"use strict";

/***
 * @author Eduardo Hattori
 * @date 10/08/16.
 */

describe("Testa o dominio do token",function(){


    var app;
    var should;
    var env;
    var tokenDomain;
    var user;
    var token;

    before(function(done){

        env    = process.env.NODE_ENV;
        app    = require('../app');
        should = require('should');
        token  = "123";

        tokenDomain = app.modules.domains.tokenDomain;
        user = {
            userid : 123
        };

        done();
    });

    it("Deveria setar um token", function(done){

        tokenDomain.setToken(user.userid, token, function(err,data){

            console.log(err,data);

            if(err) done(err);
            (data !== undefined).should.be.true();
            done();
        });
    });

    it("Deveria retornar um token a partir de um ID", function(done){

    });

    after(function(done){
       process.env.NODE_ENV = env;
        done();
    });

});
