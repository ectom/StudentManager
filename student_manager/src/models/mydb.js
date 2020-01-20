const mysql = require('mysql');

module.exports = {
  createDB: function() {
    const parentTable = `CREATE TABLE IF NOT EXISTS parents (
      id int PRIMARY KEY auto_increment,
      first_name VARCHAR(255),
      middle_name VARCHAR(255),
      last_name VARCHAR(255),
      carrier VARCHAR(255),
      phone_number VARCHAR(255),
      email VARCHAR(255),
      messaging boolean NOT NULL,
      emailing boolean NOT NULL,
      guardian VARCHAR(255),
      notes TEXT
    );`;
  
    const studentTable = `CREATE TABLE IF NOT EXISTS students (
      id INT NOT NULL AUTO_INCREMENT,
      student_id INT NOT NULL,
      first_name VARCHAR(50) NOT NULL,
      middle_name VARCHAR(50) NULL,
      last_name VARCHAR(50) NOT NULL,
      math TINYINT NULL,
      reading TINYINT NULL,
      notes TEXT NULL,
      parent1_id INT NULL,
      parent2_id INT NULL,
      created DATETIME NOT NULL,
      PRIMARY KEY (student_id),
      UNIQUE INDEX student_id_UNIQUE (student_id ASC) VISIBLE,
      UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE,
      INDEX parent1_id_idx (parent1_id ASC) VISIBLE,
      INDEX parent2_id_idx (parent2_id ASC) VISIBLE,
      CONSTRAINT parent1_id
        FOREIGN KEY (parent1_id)
        REFERENCES parents (id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
      CONSTRAINT parent2_id
        FOREIGN KEY (parent2_id)
        REFERENCES parents (id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
    );`;
  
    const attendanceTable = `CREATE TABLE IF NOT EXISTS attendance (
      id INT NOT NULL AUTO_INCREMENT,
      student_id INT NULL,
      time_in DATETIME NULL,
      time_out DATETIME NULL,
      PRIMARY KEY (id),
      UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE,
      INDEX student_id_idx (student_id ASC) VISIBLE,
      CONSTRAINT student_id
        FOREIGN KEY (student_id)
        REFERENCES students (student_id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
    );`;
    
    const languageTable = `CREATE TABLE IF NOT EXISTS language (
      id INT NOT NULL AUTO_INCREMENT,
      parent_id INT DEFAULT NULL,
      language VARCHAR(255) NULL,
      PRIMARY KEY (id),
      INDEX parent_id_idx (parent_id ASC) VISIBLE,
      CONSTRAINT parent_id
        FOREIGN KEY (parent_id)
        REFERENCES parents (id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
    );`;
    const con = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "password"
    });
    
    con.connect((err) => {
      if (err) throw err;
      console.log('Connected');
    });
    
    con.query("CREATE DATABASE IF NOT EXISTS mydb", (err, result) => {
      if (err) throw err;
      console.log("Database created: " + result);
    });
    
    con.query("USE mydb");
    
    con.query(parentTable, (err, result) => {
      if (err) throw err;
      console.log('Parent table created: ' + result);
    });
    
    con.query(studentTable, (err, result) => {
      if (err) throw err;
      console.log('Student table created: ' + result);
    });
    
    con.query(attendanceTable, (err, result) => {
      if (err) throw err;
      console.log('Attendance table created: ' + result);
    });
    
    con.query(languageTable, (err, result) => {
      if (err) throw err;
      console.log('Language table created: ' + result);
    });
    
    con.end()
  }
};