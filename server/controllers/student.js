const Database = require('../models/mydb');
const mysql = require('mysql');

const mydb = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "mydb"
});

// TODO turn into module exports instead of class.


module.exports = {
  addStudent: function(req, res) {
    const student = req.body.data;
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
    mydb.getConnection((err, connection) => {
      if (err) throw err;
      connection.query(sql, (err) => {
        connection.release();
        if (err) throw err;
      });
    });
  },
  editStudent: function(req, res) {
    return
  },
  deleteStudent: function(req, res) {
    return
  },
  getStudent: function(req, res) {
    return
  },
  checkIn: function(req, res) {
    console.log(req.body.data)
    const sql = 'INSERT INTO attendance (student_id, time_in) VALUES (' + req.body.data + ', NOW());';
    mydb.getConnection((err, connection) => {
      if (err) throw err;
      connection.query(sql, (err) => {
        connection.release();
        if (err) throw err;
      });
    });
  }
  
}
