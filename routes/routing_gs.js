var express = require('express');
var router = express.Router();
var Routing_gModel = require('../models/routing_g');

var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
};

router.get('/*',isAuthenticated, function (req, res, next){
    return next();
});

/* Mostramos el formulario para crear usuarios nuevos */
router.get('/routing-g', function (req, res)
{
    res.render('new_routing_g', {title: 'Crear nuevo routing_g'});
});

/* Obtenemos y mostramos todos los routing_gs por firewall*/
router.get('/:idfirewall', function (req, res)
{
    var idfirewall = req.params.idfirewall;
    Routing_gModel.getRouting_gs(idfirewall,function (error, data)
    {
        //si existe el routing_g mostramos el formulario
        if (typeof data !== 'undefined')
        {
            res.json(200, data);
        }
        //en otro caso mostramos un error
        else
        {
            res.json(404, {"msg": "notExist"});
        }
    });
});

/* Obtenemos y mostramos todos los routing_gs por firewall*/
router.get('/:idfirewall/group/:idgroup', function (req, res)
{
    var idfirewall = req.params.idfirewall;
    var idgroup = req.params.idgroup;
    Routing_gModel.getRouting_gs_group(idfirewall, idgroup,function (error, data)
    {
        //si existe el routing_g mostramos el formulario
        if (typeof data !== 'undefined')
        {
            res.json(200, data);
        }
        //en otro caso mostramos un error
        else
        {
            res.json(404, {"msg": "notExist"});
        }
    });
});

/* Obtenemos y mostramos  routing_g por id y  por firewall*/
router.get('/:idfirewall/:id', function (req, res)
{
    var idfirewall = req.params.idfirewall;
    var id = req.params.id;
    Routing_gModel.getRouting_g(idfirewall,id,function (error, data)
    {
        //si existe el routing_g mostramos el formulario
        if (typeof data !== 'undefined')
        {
            res.json(200, data);
        }
        //en otro caso mostramos un error
        else
        {
            res.json(404, {"msg": "notExist"});
        }
    });
});

/* Obtenemos y mostramos todos los routing_gs por nombre y por firewall*/
router.get('/:idfirewall/name/:name', function (req, res)
{
    var idfirewall = req.params.idfirewall;
    var name = req.params.name;
    Routing_gModel.getRouting_gName(idfirewall,name,function (error, data)
    {
        //si existe el routing_g mostramos el formulario
        if (typeof data !== 'undefined')
        {
            res.json(200, data);
        }
        //en otro caso mostramos un error
        else
        {
            res.json(404, {"msg": "notExist"});
        }
    });
});





/* Creamos un nuevo routing_g */
router.post("/routing-g", function (req, res)
{
    //creamos un objeto con los datos a insertar del routing_g
    var routing_gData = {
        id: null,
        firewall: req.body.firewall,
        name: req.body.name,
        comment: req.body.comment
    };
    
    Routing_gModel.insertRouting_g(routing_gData, function (error, data)
    {
        //si el routing_g se ha insertado correctamente mostramos su info
        if (data && data.insertId)
        {
            //res.redirect("/routing-gs/routing-g/" + data.insertId);
            res.json(200, {"insertId": data.insertId});
        } else
        {
            res.json(500, {"msg": error});
        }
    });
});

/* Actualizamos un routing_g existente */
router.put('/routing-g/', function (req, res)
{
    //almacenamos los datos del formulario en un objeto
    var routing_gData = {id: req.param('id'), name: req.param('name'), firewall: req.param('firewall'), comment: req.param('comment')};
    Routing_gModel.updateRouting_g(routing_gData, function (error, data)
    {
        //si el routing_g se ha actualizado correctamente mostramos un mensaje
        if (data && data.msg)
        {
            //res.redirect("/routing-gs/routing-g/" + req.param('id'));
            res.json(200, data.msg);
        } else
        {
            res.json(500, {"msg": error});
        }
    });
});



/* ELiminamos un routing_g */
router.delete("/routing-g/", function (req, res)
{
    //id del routing_g a eliminar
    var idfirewall = req.param('idfirewall');
    var id = req.param('id');
    Routing_gModel.deleteRouting_gidfirewall(idfirewall,id, function (error, data)
    {
        if (data && data.msg === "deleted" || data.msg === "notExist")
        {
            //res.redirect("/routing-gs/");
            res.json(200, data.msg);
        } else
        {
            res.json(500, {"msg": error});
        }
    });
});

module.exports = router;