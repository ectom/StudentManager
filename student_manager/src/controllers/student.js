const Database = require('../models/mydb');
const mysql = require('mysql');

const mydb = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "mydb"
});

// TODO turn into module exports instead of class.


module.exports = {
  addStudent: function(student) {
    const keys = Object.keys(student);
    const values = Object.values(student);
    let cols = '(';
    let vals = '(';
    for(let i = 0; i < keys.length; i++){
      if(values[i] === '') {
        continue;
      }
      cols += keys[i] + ",";
      if(typeof(values[i]) === 'string'){
        vals += "'" + values[i] + "',";
      } else {
        vals += values[i] + ',';
      }
    }
    cols += 'created)';
    vals += 'NOW())';
    const sql = 'INSERT INTO students ' + cols + ' VALUES ' + vals + ';';
    mydb.connect((err) => {
      if (err) throw err;
      mydb.query(sql, (err, result) => {
        if (err) throw err;
        console.log("Result: " + result);
      });
    });
    // mydb.query(sql);
    mydb.end();
  },
  editStudent: function(req, res) {
    return
  },
  deleteStudent: function(req, res) {
    return
  },
  getStudent: function(req, res) {
    return
  }
  
}
