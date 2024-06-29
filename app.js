const mysql = require('mysql');
const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const dotenv = require('dotenv');


app.use(bodyparser.urlencoded({ extended: false }))
dotenv.config({ path: './.env' });


const con = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB
});


con.connect(function (err, res) {
    if (err) throw err;
    console.log("DB Cnnnected");
})


app.post(process.env.ADDUSER, (req, res) => {

    user = req.body.name;
    console.log(user == "" || user == undefined)
    if (user == "" || user == undefined) {
        res.status(200).json({
            status: false,
            massage: 'Plz Enter valie name'
        })
        return;
    }
    const query = "insert into users (name) values ('" + user + "')";
    con.query(query, (err, success) => {
        if (err) throw err;
        res.status(200).json({
            massage: 'User has added'
        })
    });
});

app.post(process.env.ADDTASK, (req, res) => {

    userid = req.body.userid;
    task = req.body.taskName;

    const CheckValidUser = `select count(id) as count from users where id=?`;
    con.query(CheckValidUser, userid, function (err, success) {
        if (err) throw err
       
        if (success[0]['count'] == 0) {
            res.status(500).json({
                status: false,
                massage: 'Plz Register user and then add task'
            })
        }
        else if (task == "" || task == undefined) {
            res.status(500).json({
                status: false,
                massage: 'Enter valid Task'
            })
        }
        else {
            const Check = 'SELECT * FROM tasks where task_name =? and user_id=' + userid;
            con.query(Check, [task], (err, ok) => {
                if (err) {
                    res.status(500).json({ success: false, message: 'Failed to add task', error: err });
                    return;
                }
                if (ok.length > 0) {
                    res.status(200).json({ success: true, message: 'Task is Already exits' });
                }
                else {
                    //const query = `insert into  tasks (user_id,task_name) values ('" + userid + "','" + task + "')`;
                    const query = `insert into  tasks (user_id,task_name) values (?,?)`;

                    con.query(query,[userid,task], (err, ok) => {
                        if (err) {
                            res.status(500).json({ success: false, message: 'Failed to add task', error: err });
                            return;
                        }
                        console.log(ok);
                        res.status(200).json({ success: true, message: 'Task added successfully' });
                    });
                }
            });
        }
    })
});

app.delete(process.env.DELET_TASK, function (req, res) {
    const id = req.body.id;

    const CheckValidUser = `select count(id) as count from users where id=?`;
    con.query(CheckValidUser, id, function (err, success) {
        if (err) throw err
        if (success[0]['count'] == 0) {
            res.status(500).json({
                status: false,
                massage: 'Enter Valid id'
            })
        }
    })
    const query = 'delete from tasks where task_id=' + id;
    con.query(query, (err, success) => {
        if (err) {
            res.status(500).json({
                massge: err
            });
        }
        res.status(200).json({
            status: true,
            massage: 'Delete Succesfully'
        })

    })
})

app.post(process.env.SHOW_TASK, function (req, res) {

    const id = req.body.id;
    const CheckValidUser = `select count(id) as count from users where id=?`;
    con.query(CheckValidUser, id, function (err, success) {
        if (err) throw err
        if (success[0]['count'] == 0) {
            res.status(500).json({
                status: false,
                massage: 'Enter Valid id'
            })
           
        }
        else
        {
            const query = 'select task_name from tasks where user_id=' + id;

            con.query(query, function (err, success) {
                if (err) throw err;
        
                res.status(200).json({
                    massage: 'Data fetch Successfully',
                    data: success
                })
            })
        }
    })
   
});

app.post(process.env.SHOW_USER, function (req, res) {
    const query = `select name from users`;
    con.query(query, function (err, success) {
        if (err) throw err;

        res.status(200).json({
            massage: 'Data fetch Successfully',
            data: success
        })
    })
})
app.delete(process.env.DELET_USER, function (req, res) {
    const id = req.body.id;

    const CheckValidUser = `select count(id) as count from users where id=?`;
    con.query(CheckValidUser, id, function (err, success) {
        if (err) throw err
        if (success[0]['count'] == 0) {
            res.status(500).json({
                status: false,
                massage: 'Enter Valid id'
            })
            
        }else
        {
            const query = `delete  from users where id=`+id;
            con.query(query, function (err, success) {
                if (err) throw err;
        
                res.status(200).json({
                    status:true,
                    massage: 'Delete user Successfully', 
                })
            })
        }
    })
    
})

app.listen(5000);