const student = require('../controllers/student');
const parent = require('../controllers/parent');
const test = require('../controllers/test');

module.exports = function(app) {
  app.on( '/student/getOne', student.getStudent );
  app.on( '/student/getAll', student.getStudents );
  app.on( '/student/add', student.addStudent );
  app.on( '/student/checkIn', student.checkIn );
  app.on( '/student/edit', student.editStudent );
  app.on( '/student/delete', student.deleteStudent );
  app.on( '/parent/getOne', parent.getOne );
  app.on( '/parent/getAll', parent.getAll );
  app.on( '/parent/add', parent.addParent );
  app.on( '/parent/edit', parent.editParent );
  app.on( '/parent/delete', parent.deleteParent );
  app.handle( '/test_backend', test.ipc );
};
