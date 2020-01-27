const student = require('../controllers/student');
const test = require('../controllers/test');

module.exports = function(app) {
  app.on( '/student/getAll', student.getStudents );
  app.on( '/student/add', student.addStudent );
  app.on( '/student/checkIn', student.checkIn );
  app.on( '/express_backend', test.test );
  app.on( '/12345', test.ipc);
};