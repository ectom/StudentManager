const mysql = require( 'mysql' );

const mydb = mysql.createPool( {
  host: "localhost",
  user: "root",
  password: "password",
  database: "mydb"
} );

module.exports = {
  getStudent: function ( event, req, path ) {
    mydb.getConnection( ( err, connection ) => {
      if ( err ) throw err;
      const sql = 'SELECT * FROM students WHERE student_id=' + mysql.escape( req ) + ';';
      connection.query( sql, ( err, result ) => {
        connection.release();
        if ( err ) throw err;
        event.reply( `/return${path}`, result );
      } );
    } );
  },
  getStudents: function ( event, req, path ) {
    mydb.getConnection( ( err, connection ) => {
      if ( err ) throw err;
      connection.query( 'SELECT * FROM students;', ( err, result ) => {
        connection.release();
        if ( err ) throw err;
        event.reply( `/return${path}`, result )
      } );
    } );
  },
  addStudent: function ( event, req, path ) {
    const student = req.data;
    const keys = Object.keys( student );
    const vals = Object.values( student );
    let columns = '(';
    let values = '(';
    for ( let i = 0; i < keys.length; i++ ) {
      if ( vals[i] === '' ) {
        continue;
      }
      columns += `${mysql.escape(keys[i])},`;
      values += `${mysql.escape(vals[i])},`;
    }
    columns += 'created)';
    values += 'NOW())';
    const sql = 'INSERT INTO students ' + mysql.escape( columns ) + ' VALUES ' + mysql.escape( values ) + ';';
    mydb.getConnection( ( err, connection ) => {
      if ( err ) throw err;
      connection.query( sql, ( err ) => {
        connection.release();
        if ( err ) throw err;
        event.reply( `/return${path}`, 'Student added!' )
      } );
    } );
  },
  editStudent: function ( event, req, path ) {
    const student_id = req.student_id;
    delete req.student_id;
    req = {
      first_name: 'john',
      last_name: 'serh',
      math: 'true'
    }
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
    const sql = 'UPDATE students SET ' + items + 'WHERE student_id = ' + mysql.escape(student_id) + ';'
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
  deleteStudent: function ( event, req, path ) {
    mydb.getConnection((err, connection) => {
      if (err) throw err;
      const sql = `DELETE FROM students WHERE student_id=${mysql.escape(req)};`;
      connection.query(sql, (err, result) => {
        connection.release();
        if (err) throw err;
        event.reply(`/return${path}`, result);
      });
    });
  },
  checkIn: function ( event, req, path ) {
    let sql = 'SELECT student_id FROM attendance WHERE DATE(time_in) = CURDATE() and student_id = ' + mysql.escape( req ) + ';';
    mydb.getConnection( ( err, connection ) => {
      if ( err ) throw err;
      connection.query( sql, ( err, results ) => {
        connection.release();
        if ( err ) throw err;
        if ( results[0] === undefined ) {
          sql = 'INSERT INTO attendance (student_id, time_in) VALUES (' + mysql.escape( req ) + ', NOW());';
          console.log( sql );
          mydb.getConnection( ( err, connection ) => {
            if ( err ) throw err;
            connection.query( sql, ( err, result ) => {
              connection.release();
              if ( err ) throw err;
              event.reply(`/return${path}`, { message: 'Checking In' } );
            } );
          } );
        } else {
          event.reply(`/return${path}`, { message: 'Already Checked In' } );
        }
      } );
    } );
  }
};
