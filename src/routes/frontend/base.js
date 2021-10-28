const router = require('express').Router();

router.get('/base', (req, res) => {
    res.status(200).render('base')
});

module.exports = router;