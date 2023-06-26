const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'innerjoin',
});

// Test the MySQL connection
connection.connect((error) => {
  if (error) {
    console.log('Error connecting to MySQL database:', error);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Define a route to retrieve customersdetails data and their teacher's name
app.get('/customer/:id', (req, res) => {
    const customersdetailsId = req.params.id ;

    // all data show in normal form not a nested form looking simale in one object                 // working


//   const query = `
//     SELECT customers.cid, customers.cname, customers.cemail, orders.orderdate,orders.oid,orderdetails.item,orderdetails.amount,payment.paytype 
//     FROM customers 
//     INNER JOIN orders ON customers.cid = orders.cid
//     INNER JOIN payment ON customers.cid = payment.cid
//     INNER JOIN orderdetails ON orders.oid = orderdetails.oid
//   `;
//   connection.query(query, (error, results) => {
//     if (error) {
//       console.log('Error retrieving data from MySQL:', error);
//       res.status(500).send('Error retrieving data from MySQL');
//     } else {
//       res.send(results);
//     }
//   });
// testing 

// working              // its show nested data formate
const query = `
    SELECT customers.cid, customers.cname, customers.cemail, orders.orderdate,orders.orderdate,orders.oid,orderdetails.item,orderdetails.amount,payment.paytype,payment.pid
    FROM customers 
    INNER JOIN orders ON customers.cid = orders.cid
    INNER JOIN payment ON customers.cid = payment.cid
    INNER JOIN orderdetails ON orders.oid = orderdetails.oid
  `;
connection.query(query, customersdetailsId, (error, results ,) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    } else if (results.length === 0) {
      res.status(404).json({ message: 'customersdetails not found',results });
    } else {
      const customersdetails = {
        id: results[0].cid,
        name: results[0].cname,
        email: results[0].cemail,
        orderdetails: [],
        payment:[]
      };
      // order and orderdetails
      const orderdetails = results.reduce((acc, curr) => {
        if (!acc[curr.id]) {
          acc[curr.id] = {
            oid: curr.oid,
            orderdate:curr.orderdate,
            item:curr.item,
            amount: curr.amount
          };
        }
        return acc;
      }, {});
      console.log('orderdetails:', orderdetails);
    
      for (let courseId in orderdetails) {
        customersdetails.orderdetails.push(orderdetails[courseId]);
      }
      // payment working 
      const payment = results.reduce((acc, curr) => {
        if (!acc[curr.id]) {
          acc[curr.id] = {
            payid: curr.pid,
            pay:curr.paytype
          };
        }
        return acc;
      }, {});
      console.log('payment:', payment);
    
      for (let paymentId in payment) {
        customersdetails.payment.push(payment[paymentId]);
      }

      res.json({ customersdetails });
    }
  });
});

// Start the server
const port = 2000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
