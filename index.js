const { error, log } = require('console');
let fs = require('fs')
const db = {
    dataJs:{},
    find(col, qry) {
        let result = []
        for (const obj of this.dataJs[col]) {
            if (obj[JSON.stringify(qry).slice(1,-1).split(":")[0].slice(1,-1)] == JSON.stringify(qry).slice(1,-1).split(":")[1].slice(1,-1) ) {
                result.push(obj)
            }
            else continue
        }
        return result
    },
    create(col, doc) {
        // ...
    },
    update(col, qry, upd) {
        // ...
    },
    remove(col, qry) {
        // ...
    },
}
fs.readFile("database.json" ,"utf8", (err, data)=>{
    if (err) {
        console.error(err);
        return
    }
    db.dataJs = JSON.parse(data); 
    console.log(db.find("users", {"age":"50"}));
})