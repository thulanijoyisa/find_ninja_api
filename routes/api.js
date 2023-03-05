const express = require('express');
const Ninja = require('../models/ninjas');
const router = express.Router();

//get a list of ninjas from the db
router.get('/ninjas', function(req,res,next){
    /*Ninja.find({}).then(function(ninja){
        res.send(ninja);
    });*/

    Ninja.aggregate().near({
        near:{
            type: 'Point', 
            coordinates:[parseFloat(req.query.lng),parseFloat( req.query.lat)],
        },
            maxDistance:100000,
            spherical: true,
            distanceField: "distance"
    }).then(function(ninja){
            res.send(ninja)
        })
});

//add a new  ninja to the db
router.post('/ninjas', function(req,res,next){
    //another way
 /*   var ninja = new Ninja(req.body);
    ninja.save();*/

    // shorter way
    Ninja.create(req.body).then(function(ninja){
        res.send(ninja);
    }).catch(next); 
});

//update a ninjas in the db
router.put('/ninjas/:id', function(req,res,next){
    Ninja.findByIdAndUpdate({_id: req.params.id}, req.body).then(function(ninja){
        Ninja.findOne({_id:req.params.id}).then(function(ninja){
            res.send(ninja)
        });    
    })
  //  res.send({ type: 'PUT'});
});

//delete a ninjas from the db
router.delete('/ninjas/:id', function(req,res,next){
    Ninja.findByIdAndRemove({_id: req.params.id}).then(function(ninja){
        res.send(ninja)
    });
   // res.send({ type: 'DELETE'});
});

module.exports = router;