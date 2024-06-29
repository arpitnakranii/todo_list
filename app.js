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

    con.query(query, (err, success) => {
        if (err) throw err;

        res.status(200).json({
            massage:'User has added'
        })
    });
});

app.post('/addtask', (req, res) => {

    userid = req.body.userid;
    task = req.body.taskName;

    const Check = 'SELECT * FROM tasklist where taskname =? and userid=' + userid;
    con.query(Check, [task], (err, ok) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Failed to add task', error: err });
            return;
        }
        if (ok.length > 0) {
            // console.log(ok)
            res.status(200).json({ success: true, message: 'Task is Already exits' });
           // return;
        }
        else
        {
            const query = "insert into  tasklist (userid,taskname) values ('" + userid + "','" + task + "')";

            con.query(query, (err, ok) => {
                if (err) {
                    res.status(500).json({ success: false, message: 'Failed to add task', error: err });
                    return;
                }
                console.log(ok);
                res.status(200).json({ success: true, message: 'Task added successfully' });
            });
        }
    });

    
});

app.post('/deleteTask', function (req, res) {
    const id = req.body.id;
    const query = 'delete from tasklist where t_id=' + id;
    con.query(query, (err, success) => {
        if (err) {
            res.status(500).json({
                massge: err
            });
        }

        res.status(200).json({
            status:true,
            massage:'Delete Succesfully'    
        })

    })
})

app.post('/showtask',function(req,res){

    const id = req.body.id;
    const query = 'select taskname from tasklist where userid='+id;

    con.query(query,function(err,success){
        if(err) throw err;

        res.status(200).json({
            massage :'Data fetch Successfully',
            data:success
        })
    })
});

app.listen(5000);