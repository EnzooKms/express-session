const express = require('express')
const app = express()
const http = require('http').Server(app)
const port = 3030
const engine = require('express-edge');
const session = require('express-session')
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

    if (req.session.isConnected) {
        res.render('index', {
            user: {
                username: req.session.user
            }
        })
    }
    else {
        res.render('index')
    }
})

http.listen(port, () => {
    console.log(`Server running with port ${port}.`);
});