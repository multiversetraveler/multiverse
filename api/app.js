"use strict";

/***
 * @author Eduardo Hattori
 * @date 06/08/16.
 */

var express     = require('express'),
    consign     = require('consign'),
    config      = require('config'),
    bodyParser  = require('body-parser'),
    compression = require('compression'),
    cors        = require('cors'),
    app         = new express();

app.use(compression);
app.use(cors({credentials : true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.listen(config.port, function(){
    console.log("API working in port " + config.port);
});

consign()
    .then('modulos/infra')
    .then('modulos/models')
    .then('modulos/domains')
    .then('modulos/helpers')
    .then('modulos/controllers')
    .then('routes')
    .into(app);

module.exports = app;


