import Database from '../models/mydb';

class StudentController {
  constructor(){
    this.mydb = new Database().mydb;
  }
  
  addStudent(student) {
    const keys = student.keys();
    const values = student.values();
    let cols = '(';
    let vals = '(';
    for(let i = 0; i < keys.length; i++){
      if(values[i] === '') {
        continue;
      }
      cols += keys[i] + ',';
      vals += values[i] + ',';
    }
    cols = cols.substring(0, cols.length - 1);
    vals = vals.substring(0, vals.length - 1);
    cols += ')';
    vals += ')';
    console.log(cols, vals);
    
    const sql = 'INSERT INTO students ' +
      '(student_id, first_name, middle_name, last_name, math, reading, notes, parent1_id, parent2_id, creation_date) ' +
      'VALUES (value1, value2, value3, ...)'
    // this.mydb.query()
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

export default StudentController