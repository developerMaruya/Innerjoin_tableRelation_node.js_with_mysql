const express = require('express');
const mysql = require('mysql');
const app = express();

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'studentdetails'
});

const project_routes=require('./routes/project')
app.use('/api',project_routes)



app.get('/students/:id', (req, res) => {
  const studentId = req.params.id ;
  const query =`SELECT students.id, students.sname, students.email,courses.id,courses.coname,teachers.tname
               FROM students 
               INNER JOIN students_courses ON students.id = students_courses.student_id 
               INNER JOIN courses ON students_courses.course_id = courses.id 
               INNER JOIN teachers ON courses.teacher_id = teachers.id 
               WHERE students.id = ?`;

  connection.query(query, studentId, (error, results ,) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    } else if (results.length === 0) {
      res.status(404).json({ message: 'Student not found',results });
    } else {
      const student = {
        id: results[0].id,
        name: results[0].sname,
        email: results[0].email,
        courses: []
      };
      const courses = results.reduce((acc, curr) => {
        if (!acc[curr.id]) {
          acc[curr.id] = {
            id: curr.id,
            course_name:curr.coname,
            teacher: curr.tname
          };
        }
        return acc;
      }, {});
      console.log('Courses:', courses);
    
      for (let courseId in courses) {
        student.courses.push(courses[courseId]);
      }

      res.json({ student });
    }
  });
});


app.listen(3000, () => {
  console.log('Server started on port 3000');
});