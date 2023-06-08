const { Router } = require('express')
const router = Router()

router.get('/blog/read', (req, res) => {
    res.send('ok')
})

module.exports = { router }