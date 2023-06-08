const express = require('express')
const app = express()
const http = require('http').Server(app)
const port = 3030
const engine = require('express-edge');
const session = require('express-session')
const sqlite3 = require('sqlite3')
const { router: login } = require('./route/auth/login')
const { router: register } = require('./route/auth/register')
const { router: blogCreate } = require('./route/blogs/create')

app.use(login)
app.use(register)
app.use(blogCreate)
// Automatically sets view engine and adds dot notation to app.render
app.use(engine);
app.set('views', `${__dirname}/views`);


const sass = require('node-sass-middleware');

app.use(
    sass({
        src: __dirname + '/sass',    // Input SASS files
        dest: __dirname + '/', // Output CSS
        debug: false
    })
);

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static(process.cwd()))

app.get('/', (req, res) => {
    let data;
    const db = new sqlite3.Database('./db.sqlite3')

    db.serialize(() => {

        db.all('SELECT * FROM blogs', (err, dat) => {

            if (err) console.error(err)

            else {
                data = dat

                if (req.session.isConnected) {
                    res.render('index', {
                        user: {
                            username: req.session.user
                        },
                        data: data
                    })
                }
                else {
                    res.render('index', { data: data })
                }
            }

        })

    })
})

http.listen(port, () => {
    console.log(`Server running with port ${port}.`);
});