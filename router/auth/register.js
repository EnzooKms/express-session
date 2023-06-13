const express = require('express')
const { Router } = require('express');
const session = require('express-session')
require('dotenv').config()
const router = Router()
const sqlite3 = require('sqlite3')
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid');
router.use(express.json())
router.use(express.urlencoded({ extended: true }))

router.use(session({
    name: process.env.SESSION_NAME,
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        secure: false,
    },
}))

router.get('/register', (req, res) => {
    res.render('auth/register')
})

router.post('/register', async (req, res) => {
    const db = new sqlite3.Database('./db.sqlite3');
    const { username, password } = req.body
    const gen = await bcrypt.genSalt()
    const hash = await bcrypt.hash(password, gen)

    db.serialize(() => {

        db.get(`SELECT * FROM users WHERE username = "${username}"`, (err, data) => {
            if (err) {
                throw new Error(err)
            }
            if (!data) {
                const INSERT = db.prepare('INSERT INTO users(username, password, uuid) VALUES ((?), (?), (?))', [username, hash, uuidv4()])

                INSERT.run()
                INSERT.finalize()

                db.close()
                res.status(201).redirect('/login')
            }
            else {
                res.render('auth/register', { error: 201 })
                db.close()
            }

        })
    })
})

module.exports = { router }