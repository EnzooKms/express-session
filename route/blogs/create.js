const { Router } = require('express')
const router = Router()

router.get('/blog/create', (req, res) => {
    res.render('blog/create')
})

module.exports = { router }