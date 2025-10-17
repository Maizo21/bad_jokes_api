const express = require('express');
const fs = require('fs')
const router = express.Router()
const chistesController = require('../controllers/chistesController');


router.use(express.urlencoded({ extended: true }));

router.get('/', chistesController.getAllData);

router.get('/chistes', chistesController.getAllData);

router.post('/chisteNuevo', chistesController.postJoke);

router.delete('/chistes/:id', chistesController.deleteJoke);

router.use((req, res)=>{
    res.status(404).json({error: 'Ruta no encontrada'})
});

module.exports = router;