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
    var config;
    var client;
    var moment;
    var cryptoHelper;
    var md5;

    before(function(done){

        env                  = process.env.NODE_ENV;
        process.env.NODE_ENV = "test";

        app    = require('../../app');
        should = require('should');
        config = require('config');
        moment = require('moment');
        md5    = require('md5');
        cryptoHelper = app.modules.helpers.cryptoHelper;
        client = (app.modules.infra.elasticSearchInfra).getConnection();

        tokenDomain = app.modules.domains.tokenDomain;
        user = {
            user_id : 123,
            token  : "123"
        };

        client.indices.delete({
            index: config.elasticsearch.index
        }, function(err, res) {
            done();
        });
    });

    it("Deveria setar um token", function(done){

        tokenDomain.setToken(user.user_id, user.token, function(err,data){
            if(err) done(err);
            (data !== undefined).should.be.true();
            done();
        });
    });

    it("Deveria retornar um token a partir de um ID", function(done){

        tokenDomain.getInfoToken(user.token, function(err, data){
            if(err) done(err);
            (data.token == user.token).should.be.true();
            done();
        });
    });

    it("Deveria gerar um token válido para o user ID", function(done){

        tokenDomain.createToken(user, function(err, data){
            if(err) done(err);
            (data !== undefined).should.be.true();
            done();
        });
    });

    it("Deveria deletar um token", function(done){
        tokenDomain.deleteToken(user.token, function(err, data){
            if(err) done(err);
            try {
                data.found.should.be.true();
                done();
            } catch(e){
                done(e);
            }
        });
    });


    it("Deveria validar retornar token para token válido", function(done){

        var token_valido = "TOKENVALIDO";

        //Cria token valido
        client.create({
            index : config.elasticsearch.index,
            type  : config.elasticsearch.type,
            id : token_valido,
            body : {
                token : token_valido,
                user_id : user.user_id,
                data : moment().format("YYYY-MM-DD HH:mm:ss")
            }
        }, function(err, response){

            if(err) done(err);
            tokenDomain.isValid(token_valido, function(err, data){
                if(err) done(err);
                data.isValid.should.be.true();
                done();
            });
        });
    });

    it("Deveria não validar um token inválido", function(done){

        tokenDomain.isValid("TOKENINVALIDO", function(err, data){
            err.status.should.be.exactly(404);
            done();
        });
    });

    it("Deveria validar um token expirado e gerar um novo token", function(done){

        var user = {
            username : "Tiburso5",
            password : md5('TibursoDoidao'),
            email    : 'tibursodoidao5@gmail.com',
            user     : '345',
            type     : 'A'
        };

        var token_valido = cryptoHelper.encrypt(user);

        //Cria token valido
        client.create({
            index : config.elasticsearch.index,
            type  : config.elasticsearch.type,
            id : token_valido,
            body : {
                token : token_valido,
                user_id : user.user_id,
                data : moment().subtract(16,'m').format("YYYY-MM-DD HH:mm:ss")
            }
        }, function(err, response){

            if(err) done(err);
            tokenDomain.isValid(token_valido, function(err, data){
                if(err) done(err);

                (data.token !== token_valido).should.be.true();
                data.isValid.should.be.true();
                done();
            });
        });

    });

    after(function(done){

        client.indices.delete({
            index: config.elasticsearch.index
        }, function(err, res) {
            if (err) {
                done(err);
            } else {
                process.env.NODE_ENV = env;
                done();
            }
        });
    });
});
