const sqlite3 = require('sqlite3')

const db = new sqlite3.Database('./db.sqlite3')

db.serialize(() => {

    const CreateUsers = db.prepare('CREATE TABLE IF NOT EXISTS users (username VARCHAR(255), password VARCHAR(255), uuid VARCHAR(255))')

    CreateUsers.run()
    CreateUsers.finalize()

    const CreateBlogs = db.prepare('CREATE TABLE IF NOT EXISTS blogs (id INTEGER PRIMARY KEY AUTOINCREMENT, title VARCHAR(255), description VARCHAR(255),  file VARCHAR(255), author VARCHAR(255), FOREIGN KEY(author) REFERENCES users(username))')

    CreateBlogs.run()
    CreateBlogs.finalize()

    db.close()
})