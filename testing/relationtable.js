const mysql = require('mysql');
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'database_name'
});

const express = require('express');
const app = express();

// Inner join endpoint
app.get('/inner_join', (req, res) => {
  pool.query(`
    SELECT *
    FROM table1
    INNER JOIN table2 ON table1.id = table2.table1_id
  `, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// // Left outer join endpoint
// app.get('/left_outer_join', (req, res) => {
//   pool.query(`
//     SELECT *
//     FROM table1
//     LEFT OUTER JOIN table2 ON table1.id = table2.table1_id
//   `, (err, results) => {
//     if (err) throw err;
//     res.json(results);
//   });
// });

// // Right outer join endpoint
// app.get('/right_outer_join', (req, res) => {
//   pool.query(`
//     SELECT *
//     FROM table1
//     RIGHT OUTER JOIN table2 ON table1.id = table2.table1_id
//   `, (err, results) => {
//     if (err) throw err;
//     res.json(results);
//   });
// });

// // Full outer join endpoint
// app.get('/full_outer_join', (req, res) => {
//   pool.query(`
//     SELECT *
//     FROM table1
//     LEFT OUTER JOIN table2 ON table1.id = table2.table1_id
//     UNION
//     SELECT *
//     FROM table1
//     RIGHT OUTER JOIN table2 ON table1.id = table2.table1_id
//   `, (err, results) => {
//     if (err) throw err;
//     res.json(results);
//   });
// });

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
