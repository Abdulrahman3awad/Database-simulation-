const express = require('express');
const bodyParser = require('body-parser');
const { uid } = require('uid/single');
const fs = require("fs");

// Create Express app
const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Database simulation
const db = {
    find(col, qry) {
        try {
            let data = fs.readFileSync("database.json", "utf8");
            let items = JSON.parse(data)[col];
            console.log(qry);
            if (qry && Object.keys(qry).length > 0) {
                items = items.filter(item => {
                    return Object.keys(qry).every(key => item[key] == qry[key]);
                });
            }
            return items;
        } catch (err) {
            console.error(err);
            return null;
        }
    },
    create(col, doc) {
        fs.readFile("database.json", "utf8", (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            const dataJs = JSON.parse(data);
            dataJs[col].push(...doc);
            fs.writeFile("database.json", JSON.stringify(dataJs), (err) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log("The file has been saved!");
                }
            });
        });
    },
    update(col, qry, upd) {
        fs.readFile("database.json", "utf8", (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            const dataJs = JSON.parse(data);
            for (const obj of dataJs[col]) {
                if (Object.keys(qry).every(key => obj[key] == qry[key])) {
                    Object.assign(obj, upd);
                }
            }
            fs.writeFile("database.json", JSON.stringify(dataJs), (err) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log("The file has been saved!");
                }
            });
        });
    },
    remove(col, qry) {
        fs.readFile("database.json", "utf8", (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            const dataJs = JSON.parse(data);
            dataJs[col] = dataJs[col].filter(obj => !Object.keys(qry).every(key => obj[key] == qry[key]));
            fs.writeFile("database.json", JSON.stringify(dataJs), (err) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log("The file has been saved!");
                }
            });
        });
    },
};

app.route('/books')
    .get((req, res) => {
        const books = db.find("books", req.query);
        res.json(books);
    })
    .post((req, res) => {
        const newBook = req.body;
        newBook.id = uid();
        db.create('books', [newBook]);
        res.json({ message: 'Book added successfully' });
    })
    .put((req, res) => {
        const bookId = req.query.id;
        const updatedBook = req.body;
        db.update('books', { id: bookId }, updatedBook);
        res.json({ message: 'Book updated successfully' });
    })
    .delete((req, res) => {
        const bookId = req.query.id;
        db.remove('books', { id: bookId });
        res.json({ message: 'Book deleted successfully' });
    });

app.route('/users')
    .get((req, res) => {
        const users = db.find('users', req.query);
        res.json(users);
    })
    .post((req, res) => {
        const newUser = req.body;
        newUser.id = uid();
        db.create('users', [newUser]);
        res.json({ message: 'User added successfully' });
    })
    .put((req, res) => {
        const userId = req.query.id;
        const updatedUser = req.body;
        db.update('users', { id: userId }, updatedUser);
        res.json({ message: 'User updated successfully' });
    })
    .delete((req, res) => {
        const userId = req.query.id;
        db.remove('users', { id: userId });
        res.json({ message: 'User deleted successfully' });
    })

// Handle invalid routes
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
