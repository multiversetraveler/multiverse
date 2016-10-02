"use strict";

/***
 * @author Eduardo Hattori
 * @date 26/09/16.
 */
describe("Testa as funcões do controlado de usuario", function(){

    var app;
    var should;
    var request;
    var md5;
    var userModel;
    var userDomain;

    before(function(done){

        process.env.NODE_ENV = "test";

        app     = require('../../app');
        should  = require('should');
        request = require("supertest")(app);
        md5     = require('md5');
        userModel   = app.modules.models.userModel;
        userDomain  = app.modules.domains.userDomain;

        //clean env
        userModel.destroy({truncate : true}).then(function(){
            done();
        }).catch(function(err){
            done(err);
        });
    });

    it("Deveria retonar que o usuario nao é válido", function(done){

        var user = {
            user : "xaaa"
        };

        request.post('/api/user')
            .send(user)
            .expect(400)
            .end(function(err, res){
                res.statusCode.should.be.exactly(400);
                res.body.errors[0]._error.should.be.true();
                (res.body.errors[0].username !== undefined).should.be.true();
                (res.body.errors[0].password !== undefined).should.be.true();
                (res.body.errors[0].email !== undefined).should.be.true();
                (res.body.errors[0].type !== undefined).should.be.true();
                done();
            });
    });

    it("Deveria criar um usuário válido", function(done){

        var user = {
            username : "Tiburso1",
            password : md5('TibursoDoidao'),
            email    : 'tibursodoidao@gmail.com',
            type     : 'A'
        };

        request.post('/api/user')
            .send(user)
            .expect(201)
            .end(function(err, res){
                res.statusCode.should.be.exactly(201);
                res.body.record.user_id.should.be.ok();
                done();
            });
    });

    it("Deveria retornar erro ao tentar logar com usuário inválido", function(done){

        var user = {
            user : "xaaa"
        };

        request.post('/api/auth/login')
            .send(user)
            .expect(400)
            .end(function(err, res){
                res.statusCode.should.be.exactly(400);
                done();
            });

    });

    it("Deveria retornar erro ao tentar logar com usuário valido porem inexitente", function(done){

        var user = {
            email    : "tiburso@tibursocorpo.com",
            password : md5("tibursoDoidao")
        };

        request.post('/api/auth/login')
            .send(user)
            .expect(404)
            .end(function(err, res){
                res.statusCode.should.be.exactly(404);
                done();
            });

    });

    it("Deveria logar e retornar um token autenticado", function(done){

        var user = {
            username : "Tiburso2",
            password : md5('TibursoDoidao'),
            email    : 'tibursodoidao2@gmail.com',
            type     : 'A'
        };

        userDomain.save(user , function(err, data){
           if(err) done(err);

            request.post('/api/auth/login')
                .send({
                    email    : user.email,
                    password : user.password
                })
                .expect(200)
                .end(function(err, res){
                    res.statusCode.should.be.exactly(200);
                    (res.body.record.token !== undefined).should.be.true();
                    done();
                });

        });

    });

    after(function(done){

        //clean env
        userModel.destroy({truncate : true}).then(function(){
            done();
        }).catch(function(err){
            done(err);
        });
    });
});
