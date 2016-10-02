"use strict";

/***
 * @author Eduardo Hattori
 * @date 02/10/16.
 */
module.exports = function(app){

    var Validator    = require('schema-validator');
    var log          = app.modules.infra.logInfra;
    var Promise      = require("promise");
    var cardModel    = app.modules.models.cardModel;
    var qualityModel = app.modules.models.qualityModel;
    var tagModel     = app.modules.models.tagModel;
    var typeModel    = app.modules.models.typeModel;
    var moment       = require('moment');

    var cardDomain = {

        /**
         * Valida se uma carta é válida
         * @param cardObject
         */
        isValid : function(cardObject){

            var schema = {
                name : {
                    type: String,
                    required: true,
                    length: {
                        min: 3,
                        max: 100
                    }
                },
                imageUrl : {
                    type: String,
                    required : true,
                    length : {
                        min : 4,
                        max : 2000
                    },
                    test : /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
                },
                description : {
                    type : String,
                    required : true,
                    length : {
                        min : 5,
                        max : 2000
                    }
                },
                quality : {
                    type : Object,
                    required : true,
                    quality_id : {
                        type: Number,
                        required : true
                    },
                    description : {
                        type : String,
                        required : true
                    }

                },

                type : {
                    type : Object,
                    required : true,
                    type_id : {
                        type: Number,
                        required : true
                    },
                    description : {
                        type : String,
                        required : true
                    }
                },

                tag : {
                    type : Object,
                    required : true,
                    tag_id : {
                        type: Number,
                        required : true
                    },
                    description : {
                        type : String,
                        required : true
                    }
                },

                rarity : {
                    type : Number,
                    required : true,
                    length : {
                        min : 1,
                        max : 10
                    }
                },
                user : {
                    type: String,
                    required: true,
                    length: {
                        min: 3,
                        max: 16
                    }
                }
            };

            var validator = new Validator(schema);
            return validator.check(cardObject);
        },

        /**
         * Método q cria ou atualiza uma carta
         * @param cardObject
         * @param callback
         */
        save : function(cardObject, callback){

            try {
                var objValidation = this.isValid(cardObject);

                if(!objValidation._error){

                    log.info("USUARIO :" + cardObject.user + " CRIANDO / ALTERANDO A CARTA: " + cardObject.name);

                    var promise = null;

                    if(cardObject.card_id){
                        promise = this._update(cardObject);
                    } else {
                        promise = this._create(cardObject);
                    }

                    promise.then(function(data){
                        callback(null, data);
                    }).catch(function(err){
                        throw err;
                    });

                } else {
                    throw "Invalid Parameter";
                }

            } catch(e){
                log.error(e);
                callback(e);
            }
        },

        /**
         *Cria um novo modelo de carta
         * @param cardObject
         * @private
         */
        _create : function(cardObject) {
            var _self = this;

            return new Promise(function(resolve, reject){

                _self.getByName(cardObject.name, function(err, data){

                    if(err) reject(err);
                    if(data.card_id) reject("Card name already in use");
                    else {
                        cardModel.create(_self._buildCardModel(cardObject)).then(function(card){

                            _self.getById(card.dataValues.card_id, function(err, card){
                                if(err) reject(err);
                                resolve(card);
                            });

                        }).catch(function(err){
                            reject(err);
                        });
                    }
                });
            });
        },

        /***
         * Busca um Card por nome
         * @param name
         * @param callback
         */
        getByName : function(name, callback){

            var _self = this;

            cardModel.findAll({ where : { name : name}}).then(function(data){

                if(data && Array.isArray(data) && data.length > 0){
                    callback(null, _self._convertCardModelForResultCardModel(data[0].dataValues));
                } else {
                  callback(null, {});
                }
            }).catch(function(err){
                callback(err);
            });
        },

        /**
         * Busca cartas por ID
         * @param card_id
         * @param callback
         */
        getById : function(card_id, callback){

            if(isNaN(card_id)){
                callback("Invalid Id");
                return ;
            }

            var _self = this;

            cardModel.hasOne(qualityModel, {foreignKey: 'quality_id'});
            cardModel.hasOne(typeModel, {foreignKey: 'type_id'});
            cardModel.hasOne(tagModel, {foreignKey: 'tag_id'});

            cardModel.findAll({ where : { card_id : card_id},
                include: [{ model: qualityModel }, { model: typeModel },{ model: tagModel }]
            }).then(function(data){

                if(data && Array.isArray(data) && data.length > 0){
                    callback(null, _self._convertCardModelForResultCardModel(data[0].dataValues));
                } else {
                    callback(null, {});
                }
            }).catch(function(err){
                callback(err);
            });
        },

        /**
         * Atualiza um model de carta
         * @param cardobject
         * @returns {*}
         * @private
         */
        _update : function(cardobject){
            return cardModel._update(cardobject, { where : { card_id : cardobject.card_id}});
        },

        /**
         * Método que constroi o modelo de carta
         * de acordo com o card_id
         * @param cardObject
         * @returns {{name: *, imageUrl: (schema.imageUrl|{type, required, length, test}|*|string), description: (schema.description|{type, required, length}|schema.quality.description|{type, required}|schema.type.description|schema.tag.description|*), quality_id: (schema.quality.quality_id|{type, required}|number), type_id: (schema.type.type_id|{type, required}|*|type.type_id|{type, autoIncrement, primaryKey}|card.type_id), tag_id: (schema.tag.tag_id|{type, required}|number), rarity: (schema.rarity|{type, required, length}|*|number), user: *}}
         * @private
         */
        _buildCardModel : function(cardObject){

            var retorno = {
                name : cardObject.name,
                imageUrl : cardObject.imageUrl,
                description : cardObject.description,
                quality_id : cardObject.quality.quality_id,
                type_id : cardObject.type.type_id,
                tag_id : cardObject.tag.tag_id,
                rarity : cardObject.rarity,
                user : cardObject.user
            };

            if(cardObject.card_id){
                retorno.card_id     = cardObject.card_id;
                retorno.update_date =  moment().format('YYYY-MM-DD');
            } else {
                retorno.data =  moment().format('YYYY-MM-DD');
            }

            return retorno;
        },

        /***
         * Converte um objetocardModel
         * para um resultCardModel
         *
         * @param cardModelObject
         * @returns {*}
         * @private
         */
        _convertCardModelForResultCardModel : function(cardModelObject){

            var retorno = {
                card_id     : cardModelObject.card_id,
                name        : cardModelObject.name,
                imageUrl    : cardModelObject.imageUrl,
                description : cardModelObject.description,
                quality     : cardModelObject.quality.dataValues,
                type        : cardModelObject.type.dataValues,
                tag         : cardModelObject.tag.dataValues,
                rarity      : cardModelObject.rarity,
                user        : cardModelObject.user,
                data        : cardModelObject.data,
                update_date : cardModelObject.update_date
            };

            return retorno;
        }

    };

    return cardDomain;
};
