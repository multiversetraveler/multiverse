"use strict";

/***
 * @author Eduardo Hattori
 * @date 02/10/16.
 */
module.exports = function(app){

    var sequelize   = (app.modules.infra.mysqlInfra).getConnection();
    var DataType    = require('sequelize');

    var tag = sequelize.define('tag',{
        tag_id : {
            type          : DataType.INTEGER,
            autoIncrement : true,
            primaryKey    : true
        },
        description : DataType.STRING
    });

    return tag;
};
