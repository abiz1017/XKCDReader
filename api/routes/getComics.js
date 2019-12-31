var express = require('express');
var router = express.Router();

router.get('/comic/:comicId', function(req, res, next) {
    console.log(req.params.comicId);
    fetch(`http://xkcd.com/${req.params.comicId}/info.0.json`).then(response => {
        console.log(response.json());
    });
    res.send('Hello');  
    
});

module.exports = router;
