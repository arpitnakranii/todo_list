const mysql = require('mysql');
const express = require('express');
const app = express();
const bodyparser = require('body-parser');


app.use(bodyparser.urlencoded({ extended: false }))


const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'todolist'
});


con.connect(function (err, res) {


    if (err) throw err;
})


app.post('/adduser', (req, res) => {

    user = req.body.name;
    const query = "insert into touser (name) values ('" + user + "')";

    con.query(query, (err, res) => {
        if (err) throw err;

        console.log(res);
    });
});

app.get('/addtask', (req, res) => {

    userid = req.body.userid;
    task = req.body.taskName;

    const Check = 'SELECT * FROM tasklist where taskname =? and userid='+userid;
    con.query(Check, [task], (err, ok) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Failed to add task', error: err });
            return;
        }
        if (ok.length > 0) {
           // console.log(ok)
            res.status(200).json({ success: true, message: 'Task is Already exits' });
            return;
        }
    });

    const query = "insert into  tasklist (userid,taskname) values ('"+userid+"','"+task+"')";

    con.query(query,(err,ok)=>{
        if (err) {
            res.status(500).json({ success: false, message: 'Failed to add task', error: err });
            return;
        }
        console.log(ok);
        res.status(200).json({ success: true, message: 'Task added successfully' });
    });
});


app.listen(5000);