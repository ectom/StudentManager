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
    const sql = 'INSERT INTO students ' + mysql.escape(cols) + ' VALUES ' + mysql.escape(vals) + ';';
    mydb.getConnection((err, connection) => {
      if (err) throw err;
      connection.query(sql, (err) => {
        connection.release();
        if (err) throw err;
      });
    });
  },
  editStudent: function(req, res) {
  
  },
  deleteStudent: function(req, res) {
  
  },
  getStudent: function(req, res) {
  
  },
  checkIn: function(req, res) {
    console.log( req.body.data );
    let sql = 'SELECT student_id FROM attendance WHERE DATE(time_in) = CURDATE() and student_id = ' + mysql.escape( req.body.data ) + ';';
    mydb.getConnection( ( err, connection ) => {
      if ( err ) throw err;
      connection.query( sql, ( err, results ) => {
        connection.release();
        if ( err ) throw err;
        if ( results ) {
          res.json( { message: 'Already Checked In' } );
        
        } else {
          sql = 'INSERT INTO attendance (student_id, time_in) VALUES (' + mysql.escape( req.body.data ) + ', NOW());';
          mydb.getConnection( ( err, connection ) => {
            if ( err ) throw err;
            connection.query( sql, ( err ) => {
              connection.release();
              if ( err ) throw err;
            } );
          } );
        }
      } );
    } );
  }
};
