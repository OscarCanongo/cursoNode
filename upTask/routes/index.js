const express = require('express');
const router = express.Router();
    
router.get('/', (req, res) => {
    res.send("Index");
});
    
router.get('/nosotros', (req, res) => {
    res.send("Nosotros");
});

module.exports = router;