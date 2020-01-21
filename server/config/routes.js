const student = require('../controllers/student');
const test = require('../controllers/test');

module.exports = function(app) {
  app.post('/student/add', student.addStudent);
  app.get('/express_backend', test.test);
};