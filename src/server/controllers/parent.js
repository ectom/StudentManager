const mysql = require( 'mysql' );

const mydb = mysql.createPool( {
  host: "localhost",
  user: "root",
  password: "password",
  database: "mydb"
} );

module.exports = {
  getOne: function (event, req, path) {
    mydb.getConnection((err, connection) => {
      if (err) throw err;
      const sql = `SELECT * FROM parents WHERE id = ${mysql.escape(req)}`
      connection.query(sql, (err, result) => {
        connection.release();
        if (err) throw err;
        event.reply( `/return${path}`, result );
      });
    });
  },
  getAll: function (event, req, path) {
    mydb.getConnection((err, connection) => {
      if (err) throw err;
      connection.query(`SELECT * FROM parents`, (err, result) => {
        connection.release();
        if (err) throw err;
        event.reply( `/return${path}`, result );
      });
    });
  },
  addParent: function (event, req, path) {
    mydb.getConnection((err, connection) => {
      if (err) throw err;
      const parent = req.data;
      const keys = Object.keys( parent );
      const vals = Object.values( parent );
      let columns = '(';
      let values = '(';
      for ( let i = 0; i < keys.length; i++ ) {
        if ( vals[i] === '' ) {
          continue;
        }
        columns += `${mysql.escape(keys[i])},`;
        values += `${mysql.escape(vals[i])},`;
      }
      columns = columns.substring(0, columns.length - 1) + ')';
      values = values.substring(0, values.length - 1) + ')';
      const sql = `INSERT INTO parents ${mysql.escape(columns)} VALUES ${mysql.escape(values)};`;
      connection.query(sql, (err, result) => {
        connection.release();
        if (err) throw err;
        event.reply( `/return${path}`, result );
      })
    })
//  id int PRIMARY KEY auto_increment,
//  first_name VARCHAR(255),
//  middle_name VARCHAR(255),
//  last_name VARCHAR(255),
//  carrier VARCHAR(255),
//  phone_number VARCHAR(255),
//  email VARCHAR(255),
//  messaging boolean NOT NULL,
//  emailing boolean NOT NULL,
//  guardian VARCHAR(255),
//  notes TEXT

  },
  editParent: function (event, req, path) {

  },
  deleteParent: function (event, req, path) {
    mydb.getConnection((err, connection) => {
      if (err) throw err;
      const sql = `DELETE * FROM parents WHERE id = ${req}`
      connection.query(sql, (err, result) => {
        connection.release();
        if (err) throw err;
        event.reply( `/return${path}`, result );
      });
    });
  }
}