const { Router } = require('express')
const router = Router()
const sqlite3 = require('sqlite3')

router.get('/blog/read/:id', (req, res) => {
    const db = new sqlite3.Database('db.sqlite3')
    db.serialize(() => {
        db.get('SELECT * FROM blogs WHERE id = ?', req.params.id, (err, data) => {
            if (err) {
                console.error(err);
            }
            console.log(req.session);
            res.render('blog/read', { data, user: req.session.isConnected ? { username: req.session.user } : null })

        })

        db.close()
    })

})

module.exports = { router }