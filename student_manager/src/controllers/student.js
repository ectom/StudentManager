const Database = require('../models/mydb');

class StudentController {
  constructor(){
    this.mydb = new Database().mydb;
  }
  
  addStudent(student) {
    console.log(student)
    const keys = Object.keys(student);
    const values = Object.values(student);
    let cols = '(';
    let vals = '(';
    for(let i = 0; i < keys.length; i++){
      if(values[i] === '') {
        continue;
      }
      cols += keys[i] + ",";
      console.log(typeof(values[i]))
      if(typeof(values[i]) === 'string'){
        vals += "'" + values[i] + "',";
      } else {
        vals += values[i] + ',';
      }
    }
    cols += 'created)';
    vals += 'NOW())';
    const sql = 'INSERT INTO students ' + cols + ' VALUES ' + vals + ';';
    console.log(sql)
    this.mydb.query(sql, (err, result) => {
      if (err) throw err;
      console.log(result);
    })
  }
  
  editStudent() {
    return
  }
  
  deleteStudent() {
    return
  }
  
  getStudent() {
    return
  }
}

module.exports = StudentController;