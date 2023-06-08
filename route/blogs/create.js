const { Router } = require('express')
const router = Router()
const multer = require('multer')
const sqlite3 = require('sqlite3')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const suffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
        cb(null, `${suffix}-${file.originalname}`)
    }
})

const upload = multer({ storage: storage })

router.get('/blog/create', (req, res) => {

    if (!req.session.isConnected) {
        res.render('index', { error: 401 })
    }
    else {
        res.render('blog/create')
    }
})

router.post('/blog/create', upload.single('image'), (req, res) => {

    const { title, description } = req.body
    const db = new sqlite3.Database('./db.sqlite3')

    db.serialize(() => {
        const CREATE = db.prepare('CREATE TABLE IF NOT EXISTS blogs (title VARCHAR(255), description VARCHAR(255),  file VARCHAR(255), author VARCHAR(255), FOREIGN KEY(author) REFERENCES users(username))')

        CREATE.run()
        CREATE.finalize()

        const upload = db.prepare('INSERT INTO blogs(title, description, file, author) VALUES ((?), (?), (?), (?))', [title, description, req.file.filename, req.session.user])
        upload.run()
        upload.finalize()

        db.close()

        res.redirect('/')
    })

})

module.exports = { router }