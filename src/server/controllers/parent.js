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
      const keys = Object.keys( req.data );
      const vals = Object.values( req.data );
      let columns = '(';
      let values = '(';
      for ( let i = 0; i < keys.length; i++ ) {
        if ( vals[i] === '' ) {
          continue;
        }
        columns += `${keys[i]},`;
        values += `${mysql.escape(vals[i])},`;
      }
      columns = columns.substring(0, columns.length - 1) + ')';
      values = values.substring(0, values.length - 1) + ')';
      const sql = `INSERT INTO parents ${columns} VALUES ${values};`;
      console.log(sql)
      connection.query(sql, (err, result) => {
        connection.release();
        if (err) throw err;
        event.reply( `/return${path}`, result );
      })
    })
  },
  editParent: function (event, req, path) {
    const parent_id = req.parent_id;
    delete req.parent_id;
    const keys = Object.keys(req);
    const vals = Object.values(req);
    let items = '(';
    for ( let i = 0; i < keys.length; i++ ) {
      if ( vals[i] === '' ) {
        continue;
      }
      items += `${mysql.escape(keys[i])}=${mysql.escape(vals[i])},`;
    }
    items = items.substring(0, items.length - 1);
    items += ')';
    const sql = 'UPDATE parents SET ' + items + 'WHERE id = ' + mysql.escape(parent_id) + ';'
    console.log(sql);
    mydb.getConnection((err, connection) => {
      if (err) throw err;
      connection.query(sql, (err, result) => {
        connection.release();
        if (err) throw err;
        event.reply(`/return${path}`, result);
      });
    });
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