const express = require('express')
const { Router } = require('express');
const session = require('express-session')
require('dotenv').config()
const router = Router()
const sqlite3 = require('sqlite3')
const bcrypt = require('bcrypt')
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

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', (req, res) => {

    const { username, password } = req.body
    const db = new sqlite3.Database('./db.sqlite3')

    db.serialize(() => {
        db.get(`SELECT * FROM users WHERE username = ?`, username, async (err, data) => {
            if (err) {
                console.log(err);
                return res.redirect('login')
            }

            if (!data) {
                return res.render('login', { error: 201, username: true })
            }

            if (data.username && data.password) {
                const compare = await bcrypt.compare(password, data.password)
                if (compare) {
                    req.session.isConnected = true
                    req.session.user = username
                    res.status(200).redirect('/')
                } else {
                    res.render('login', { error: 201, username: false })
                }
            }
        })
    })
})

router.get('/logout', (req, res) => {
    req.session.isConnected = false
    res.redirect('/')
})

module.exports = { router }