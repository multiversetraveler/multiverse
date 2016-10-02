"use strict";

/***
 * @author Eduardo Hattori
 * @date 04/09/16.
 */

describe("Teste o dominio do usuário",function(){

    var app;
    var should;
    var env;
    var config;
    var userDomain;
    var userModel;
    var mysqlInfra;
    var md5;

    before(function(done){

        //Set variables
        env = process.env.NODE_ENV;
        process.env.NODE_ENV = "test";

        app         = require("../../app");
        should      = require('should');
        config      = require('config');
        md5         = require('md5');
        userDomain  = app.modules.domains.userDomain;
        userModel   = app.modules.models.userModel;
        mysqlInfra  = app.modules.infra.mysqInfra;

        //clean env
        userModel.destroy({truncate : true}).then(function(){
            done();
        }).catch(function(err){
            done(err);
        });
    });

    it("Deveria retornar erro de usuário inválido", function(done){

        var user = {
            user     : "Tiburso1",
            asas     : md5('TibursoDoidao'),
            tes      : 'tibursodoidao1@gmail.com',
            type     : 'A'
        };

        userDomain.isValid(user)._error.should.be.true();
        done();
    });

    it("deveria passar no test do usuario valido",function(done){

        var user = {
            username : "Tiburso2",
            password : md5('TibursoDoidao'),
            email    : 'tibursodoidao2@gmail.com',
            type     : 'A'
        };

        (userDomain.isValid(user)._error == undefined).should.be.true();
        done();

    });

    it("Deveria inserir um usuario de acordo com o modelo de dados", function(done){

        var user = {
            username : "Tiburso3",
            password : md5('TibursoDoidao'),
            email    : 'tibursodoidao3@gmail.com',
            type     : 'A'
        };

        userDomain.save(user, function(err, nUser){
            if(err) done(err);
            nUser.user_id.should.be.ok();
            done();
        });
    });

    it("Deveria retornar um usuario", function(done){

        var user = {
            username : "Tiburso4",
            password : md5('TibursoDoidao'),
            email    : 'tibursodoidao4@gmail.com',
            type     : 'A'
        };

        userDomain.save(user, function(err, nUser){
            if(err) done(err);
            userDomain.getById(nUser.user_id, function(err, data){
                (data != undefined).should.be.true();
                done();
            });
        });

    });

    it("Deveria atualizar um usuario",function(done){

        var user = {
            username : "Tiburso5",
            password : md5('TibursoDoidao'),
            email    : 'tibursodoidao5@gmail.com',
            type     : 'A'
        };

        userDomain.save(user, function(err, nUser1){
            if(err) {
                done(err);
            }
            nUser1.username = "TibursoALTERADO";
            userDomain.save(nUser1, function(err, nUser2){
                if(err) done(err);
                (nUser2.username == "TibursoALTERADO").should.be.true();
                done();
            });
        });

    });

    it("Deveria retornar q os dados de login do usuario são válidos", function(done){

        var user = {
            username : "Tiburso6",
            password : md5('TibursoDoidao'),
            email    : 'tibursodoidao6@gmail.com',
            type     : 'A'
        };

        userDomain.login(user.email, user.password, function(err){
            (err.error == 'User Not Found').should.be.true();
            done();
        });
    });

    it("Deveria retornar erro ao tentar logar com dados de password invalido", function(done){

        var user = {
            username : "Tiburso8",
            password : 123,
            email    : 'tibursodoidao6@gmail.com',
            type     : 'A'
        };

        userDomain.login(user.email, user.password, function(err){
            (err._error == true && err.password !== undefined).should.be.true();
            done();
        });
    });

    it("Deveria retornar erro ao tentar logar com dados invalidos", function(done){

        var user = {
            username : "Tiburso9",
            password : 123,
            email    : 'tibursodoidao9',
            type     : 'A'
        };

        userDomain.login(user.email, user.password, function(err){
            (err._error == true && err.password !== undefined && err.email !== undefined).should.be.true();
            done();
        });
    });

    it("Deveria retornar o usuario logado ", function(done){

        var user = {
            username : "Tiburso7",
            password : md5('TibursoDoidao'),
            email    : 'tibursodoidao7@gmail.com',
            type     : 'A'
        };

        userDomain.save(user, function(err, nUser1){
            if(err) {
                done(err);
            }

            userDomain.login(user.email, user.password, function(err, nUser2){
                if(err) done(err);
                (nUser2.username == "Tiburso7").should.be.true();
                done();
            });
        });

    });

    it("Deveria retornar um erro ao inserir um usuário com o mesmo username", function(done){


        var user1 = {
            username : "Tiburso8",
            password : md5('TibursoDoidao'),
            email    : 'tibursodoidao8@gmail.com',
            type     : 'A'
        };

        var user2 = {
            username : "Tiburso8",
            password : md5('TibursoDoidaoaaa'),
            email    : 'tibursodoidao9@gmail.com',
            type     : 'A'
        };

        userDomain.save(user1, function(err, result){
            userDomain.save(user2, function(err, result){
                (err.error == "Username already registered").should.be.true();
                done();
            });
        });

    });

    after(function(done){
        userModel.destroy({truncate : true}).then(function(){
            process.env.NODE_ENV = env;
            done();
        }).catch(function(err){
            done(err);
        });
    });
});
