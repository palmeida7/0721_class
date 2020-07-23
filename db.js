const pgp = require("pg-promise")();

const db = pgp('postgres://tbcrxjga:5O5__bCDq_Y9ixjBdTJrQqCfMkNAq5Cj@ruby.db.elephantsql.com:5432/tbcrxjga')

//db.any("SELECT * FROM students").then(students=>console.log(students)); //returns all

//db.one

// let person = {
//     name:"Karen",
//     points:"0",
//     username:"nobody"
// }
//db.none(`INSERT INTO students (name, points, username) VALUES ('${person.name}', '${person.points}', '${person.username}')`).then(res=>console.log(res))

// let person = {
//     name:"Joe",
//     points:"0",
//     username:"somebody"
// }
// db.none(`INSERT INTO students (name, points, username) VALUES ($1, $2, $3)`, [person.name, person.points, person.username])
// .then(()=>{
//     db.any("SELECT * FROM students").then(students=>console.log(students));
// })

module.exports = db;