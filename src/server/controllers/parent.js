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
        event.reply( `/return${path}`, result);
      });
    });
  },
  getAll: function (event, req, path) {
    mydb.getConnection((err, connection) => {
      if (err) throw err;
      connection.query(`SELECT * FROM parents`, (err, result) => {
        connection.release();
        if (err) throw err;
        event.reply( `/return${path}`, result);
      });
    });
  },
  addParent: function (event, req, path) {

  },
  editParent: function (event, req, path) {

  },
  deleteParent: function (event, req, path) {

  }
}