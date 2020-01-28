const student = require('../controllers/student');
const test = require('../controllers/test');

module.exports = function(app) {
  app.on( '/student/getOne', student.getStudent );
  app.on( '/student/getAll', student.getStudents );
  app.on( '/student/add', student.addStudent );
  app.on( '/student/checkIn', student.checkIn );
  app.on( '/student/edit', student.editStudent );
  app.on( '/student/delete', student.deleteStudent())
  app.on( '/express_backend', test.test );
  app.handle( '/test_backend', test.ipc);
};