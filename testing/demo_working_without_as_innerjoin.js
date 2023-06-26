const express = require('express');
const mysql = require('mysql');
const app = express();

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'studentdetails'
});


app.get('/students/:id', (req, res) => {
  const studentId = req.params.id ;

  
  // const query =`SELECT students.id, students.name, students.email, courses.id AS courses_id, courses.name AS courses_name, teachers.name AS teachers_name 
  //              FROM students 
  //              INNER JOIN students_courses ON students.id = students_courses.student_id 
  //              INNER JOIN courses ON students_courses.course_id = courses.id 
  //              INNER JOIN teachers ON courses.teacher_id = teachers.id 
  //              WHERE students.id = ?`;

  const query =`SELECT students.id, students.name, students.email,courses.id,courses.name,teachers.name
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
        name: results[0].name,
        email: results[0].email,
        courses: []
      };
      const courses = results.reduce((acc, curr) => {
        if (!acc[curr.id]) {
          acc[curr.id] = {
            id: curr.id,
            name: curr['courses.name'],
            teacher: curr.name
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

// all 

app.get('/studentsall', (req, res) => {
    const query =`SELECT * 
                 FROM students_courses
                 INNER JOIN courses ON students_courses.course_id = courses.id  `;
  
    connection.query(query, (error, results ,) => {
        // console.log(`results....${results}`)
        for(var i in results){
            console.log(i)
            console.log(results[i])
      
        res.json({ results });
    }
});
  });

app.listen(3000, () => {
  console.log('Server started on port 3000');
});