"use strict";

/***
 * @author Eduardo Hattori
 * @date 09/08/16.
 */
describe('Testa o controlador relacionado aos tokens',function(){


    var app,
        should,
        request,
        config,
        env;

    before(function(done){

        env    = process.env.NODE_ENV;
        process.env.NODE_ENV = "test";

        app    = require('../app');
        should = require('should');
        config = require('config');
        request= require('supertest')(app);

        done();

    });

    it('Deve retornar um 400 ao tentar acessar uma url sem token', function(done){

        request.get('/')
            .end(function(err,res){
               if(err) done(err);
                res.statusCode.should.be.exactly(400);
                done();
            });
    });

    after(function(done){
        process.env.NODE_ENV = env;
        done();
    });

});
