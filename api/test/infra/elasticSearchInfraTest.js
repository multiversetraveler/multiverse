"use strict";

/***
 * @author Eduardo Hattori
 * @date 10/08/16.
 */

describe("Testas as conexões de Infra do ElasticSearch", function(){

    var app;
    var should;
    var env;
    var client;

    this.timeout(6000);

    before(function(done){

        env = process.env.NODE_ENV;
        process.env.NODE_ENV = "test";

        app    = require('../../app');
        should = require('should');
        client = app.modules.infra.elasticSearchInfra;

        done();
    });

    it("Deveria estar conectado ao elasticSearch", function(done){

        var conn = client.getConnection();

        conn.ping({
            requestTimeout : Infinity,
            hello : "elasticsearch!"
        },function(err){
            if(err)
                done(err);
            else
            done();
        });
    });

    after(function(done){
        process.env.NODE_ENV = env;
        done();
    });


});