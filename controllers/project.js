
const mysql = require('mysql');
const con=require('../db/db')

const getLeftRightJoin=async(req,res)=>{
    console.log(">>>>>>>>>>>>")
        con.connect((err)=>{
            if(err){
                throw err
            }
            let sql=`SELECT students.id,students.name,students.email,students.phone,department.dname
            FROM students 
            LEFT JOIN department ON students.dep_id=department.id
            `;
        
            con.query(sql,(err,result)=>{
                if(err){
                    throw err
                }
                res.json(result)
            })
    
    })
}

// customer details
const customerdetils=async(req,res)=>{
    const customersdetailsId = req.params.id ;

    const query = `
    SELECT customers.cid, customers.cname, customers.cemail, orders.orderdate,orders.orderdate,orders.oid,orderdetails.item,orderdetails.amount,payment.paytype,payment.pid
    FROM customers 
    INNER JOIN orders ON customers.cid = orders.cid
    INNER JOIN payment ON customers.cid = payment.cid
    INNER JOIN orderdetails ON orders.oid = orderdetails.oid
    WHERE customers.cid = ?
  `;
  con.query(query, customersdetailsId, (error, results ,) => {
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
};


// ef eak sai jada ho aur unhai export karna ho to{ }kai ander liktai hai
module.exports={getLeftRightJoin,customerdetils}