const student = require('../controllers/student');
const test = require('../controllers/test');

module.exports = function(app) {
  app.get( '/student/getAll', student.getStudents );
  app.post( '/student/add', student.addStudent );
  app.post('/student/checkIn', student.checkIn);
  app.get('/express_backend', test.test);
};