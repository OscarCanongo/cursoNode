const express = require('express');
const router = express.Router(); 
const proyectosController = require ('../controllers/proyectosController');
    
router.get('/', proyectosController.proyectosHome);
    
module.exports = router;