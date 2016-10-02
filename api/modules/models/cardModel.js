"use strict";

/***
 * @author Eduardo Hattori
 * @date 02/10/16.
 */
module.exports = function(app){

    var sequelize   = (app.modules.infra.mysqlInfra).getConnection();
    var DataType    = require('sequelize');

    var card = sequelize.define('card',{

            card_id : {
                type          : DataType.INTEGER,
                autoIncrement : true,
                primaryKey    : true
            },
            name        : DataType.STRING,
            imageUrl    : DataType.STRING,
            description : DataType.STRING,
            quality_id     : {
                type          : DataType.INTEGER,
                references    : { model : 'quality', key : 'quality_id'}
            },
            type_id     : {
                type          : DataType.INTEGER,
                references    : { model : 'type', key : 'type_id'}
            },
            tag_id     : {
                type          : DataType.INTEGER,
                references    : { model : 'tag', key : 'tag_id'}
            },
            rarity  : DataType.INTEGER,
            user    : DataType.STRING,
            data    : DataType.DATE,
            update_date : DataType.DATE
        }
    );

    return card;
};
