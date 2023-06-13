const { Router } = require('express')
const router = Router()
const sqlite3 = require('sqlite3')

router.get('/profile/:user', (req, res) => {

    const db = new sqlite3.Database('db.sqlite3')

    db.serialize(() => {
        db.get('SELECT * FROM users WHERE username = ?', req.params.user, (err, data) => {

            if (err) console.error(err);

            if (data) {
                if (req.session.user === req.params.user) {
                    res.render('profile/profile', { data, session: req.session, profile: req.params.user, user: req.session.isConnected ? { username: req.session.user } : null })
                }
                else {
                    res.render('profile/profile', { data })
                }
            }
            else {
                res.redirect('/')
            }

        })

        db.close()
    })


})

module.exports = { router }