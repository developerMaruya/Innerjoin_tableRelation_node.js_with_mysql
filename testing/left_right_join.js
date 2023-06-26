var mysql=require('mysql')
const express=require('express')
const app=express()
var con=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:"",
    database:'innerjoin'
})

app.get('/',(req,res)=>{
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
)
app.listen(2000,()=>{
    console.log("server runing on 2000")
})