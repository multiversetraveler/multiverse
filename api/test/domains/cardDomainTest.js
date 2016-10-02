/***
 * @author Eduardo Hattori
 * @date 02/10/16.
 */
describe("Testa o dominio de cartas",function(){

    var app;
    var should;
    var cardDomain;
    var cardModel;

    before(function(done){

        process.env.NODE_ENV = 'test';
        app         = require('../../app');
        should      = require('should');
        cardDomain  = app.modules.domains.cardDomain;
        cardModel   = app.modules.models.cardModel;

        //clean env
        cardModel.destroy({truncate : true}).then(function(){
            done();
        }).catch(function(err){
            done(err);
        });
    });

    it("Deveria existir um dominio cardDomain", function(done){
        (cardDomain !== undefined).should.be.true();
        done();
    });

    it("Deveria retornar  um parametro inválido quando passar um objeto inválido", function(done){

        var cardInvalid = {
            teste : "nada a ver"
        };

        (cardDomain.isValid(cardInvalid)._error == true).should.be.true();
        done();
    });

    it("Deveria ser uma carta válida", function(done){

        var cardValid = {
            name        : "teste",
            imageUrl    : "http://images.bucketexplorer.com/buynowheaderbtn.png",
            description : "teste",
            quality     : { quality_id : 1 , description :  "quality" },
            type        : { type_id : 1 , description :  "type" },
            tag         : { tag_id : 1 , description :  "tag" },
            rarity      : 1,
            user        : "teste"
        };

        (cardDomain.isValid(cardValid)._error == undefined).should.be.true();
        done();
    });

    it("Deveria criar uma carta válida", function(done){

        var cardValid = {
            name        : "teste",
            imageUrl    : "http://images.bucketexplorer.com/buynowheaderbtn.png",
            description : "teste",
            quality     : { quality_id : 1 , description :  "Common" },
            type        : { type_id : 1 , description :  "Hero" },
            tag         : { tag_id : 1 , description :  "Class" },
            rarity      : 1,
            user        : "teste"
        };

        cardDomain.save(cardValid, function(err, card){
            if(err) done(err);
            (card.card_id !== undefined).should.be.true();
            done();
        });
    });

    it("Deveria atualizar uma carta válida", function(done){

        var cardValid = {
            name        : "teste1",
            imageUrl    : "http://images.bucketexplorer.com/buynowheaderbtn.png",
            description : "teste",
            quality     : { quality_id : 1 , description :  "Common" },
            type        : { type_id : 1 , description :  "Hero" },
            tag         : { tag_id : 1 , description :  "Class" },
            rarity      : 1,
            user        : "teste"
        };

        cardDomain.save(cardValid, function(err, card){

            console.log(err,card);

            if(err) done(err);
            (card.card_id !== undefined).should.be.true();
            done();
        });
    });

});
