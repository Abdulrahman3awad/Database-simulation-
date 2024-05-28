const { error } = require('console');
const { uid } = require('uid/single');
let fs = require('fs')
const db = {
    find(col, qry) {
        try {
            let data = fs.readFileSync("database.json", "utf8");
            let result = [];
            for (const obj of JSON.parse(data)[col]) {
                if (obj[JSON.stringify(qry).slice(1, -1).split(":")[0].slice(1, -1)] == JSON.stringify(qry).slice(1, -1).split(":")[1].slice(1, -1)) {
                    result.push(obj);
                }
            }
            return result;
        } catch (err) {
            console.error(err);
            return null;
        }
    },
    create(col, doc) {
        fs.readFile("database.json" ,"utf8", (err, data)=>{
        if (err) {
            console.error(err);
            return
        }
        const dataJs = JSON.parse(data);
        dataJs[col].push(...doc);
        fs.writeFile("database.json", JSON.stringify(dataJs), (err)=>{
            if (err) {
                console.error(err);
                return
            }
            else console.log("The file has been saved!");
        })
    })
    },
    update(col, qry, upd) {
        fs.readFile("database.json", "utf8", (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            const dataJs = JSON.parse(data);
            for (const obj of dataJs[col]) {
                if (obj[JSON.stringify(qry).slice(1, -1).split(":")[0].slice(1, -1)] == JSON.stringify(qry).slice(1, -1).split(":")[1].slice(1, -1)) {
                    obj[JSON.stringify(upd).slice(1, -1).split(":")[0].slice(1, -1)] = JSON.stringify(upd).slice(1, -1).split(":")[1];
                }
            }
            fs.writeFile("database.json", JSON.stringify(dataJs), (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log("The file has been saved!");
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
            const newData = dataJs[col].filter(obj => {
                for (const key in qry) {
                    if (obj[key] !== qry[key]) {
                        return true; // Keep the object
                    }
                }
                return false; // Remove the object
            });
            dataJs[col] = newData;
            fs.writeFile("database.json", JSON.stringify(dataJs), (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log("The file has been saved!");
            });
        });

    },
}
// console.log(db.find("users", {"age":"50"}));

// db.create("books", [
// 	{"id":uid(),"title":"Learn NodeJS","pages":422,"language":"English","author":"Ahmed Zanaty","category":"Technology"},
// 	{"id":uid(),"title":"Learn NodeJS","pages":422,"language":"English","author":"Ahmed Zanaty","category":"Technology"}
// ])

// db.update("books", {
// 	title: "Learn NodeJS"
// }, {
// 	pages: 444
// })

// db.remove("users", {
// 	country: "Indonesia"
// })
