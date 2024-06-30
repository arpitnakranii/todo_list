const mysql = require('mysql');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dotEnv = require('dotenv');


app.use(bodyParser.urlencoded({ extended: false }))
dotEnv.config({ path: './.env' });


const con = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB
});


con.connect(function (err, res) {
    if (err) throw err;
})


app.post('/add-user', (req, res) => {

    const user = req.body.name;

    if (!user) {
        res.status(200).json({
            status: false,
            massage: 'Plz Enter valie name'
        });
        return;
    }

    const checkValidUser = `select count(name) as count from users where name=?`;
    con.query(checkValidUser, [user], (err, success) => {
        if (err) throw err;


        if (success[0]['count'] != 0) {
            res.status(200).json({
                massage: 'User is Already Exits'
            });
        }
        else {
            const query = `insert into users (name) values (?)`;
            con.query(query, [user], (err, success) => {
                if (err) throw err;
                res.status(200).json({
                    massage: 'User has added'
                });
            });
        }
    });
});

app.post('/add-task', (req, res) => {

   const userId = req.body.userid;
    const task = req.body.taskName;

    const checkValidUser = `select count(id) as count from users where id=?`;
    con.query(checkValidUser, [userId], function (err, success) {
        if (err) throw err

        if (success[0]['count'] === 0) {
            res.status(500).json({
                status: false,
                massage: 'Plz Register user and then add task'
            });
        }
        else if (!task) {
            res.status(500).json({
                status: false,
                massage: 'Enter valid Task'
            });
        }
        else {
            const check = `SELECT * FROM tasks where task_name =? and user_id=?`;
            con.query(check, [task, userId], (err, success) => {
                if (err) {
                    res.status(500).json({
                        status: false,
                        message: 'Failed to add task',
                        error: err
                    });
                    return;
                }
                if (success.length > 0) {
                    res.status(200).json({
                        status: true, message: 'Task is Already exits'
                    });
                }
                else {
                    const query = `insert into  tasks (user_id,task_name) values (?,?)`;

                    con.query(query, [userId, task], (err, success) => {
                        if (err) {
                            res.status(500).json({
                                status: false,
                                message: 'Failed to add task',
                                error: err
                            });
                            return;
                        }
                        res.status(200).json({
                            status: true,
                            message: 'Task added successfully'
                        });
                    });
                }
            });
        }
    });
});

app.delete('/delete-task', function (req, res) {
    const id = req.body.id;

    const checkValidUser = `select count(id) as count from users where id=?`;
    con.query(checkValidUser, [id], function (err, success) {
        if (err) throw err

        if (success[0]['count'] === 0) {
            res.status(500).json({
                status: false,
                massage: 'Enter Valid id'
            });
        }
    });
    const query = 'delete from tasks where task_id=?';
    con.query(query, [id], (err, success) => {
        if (err) {
            res.status(500).json({
                massge: err
            });
        }
        res.status(200).json({
            status: true,
            massage: 'Delete Succesfully'
        });
    });
});

app.post('/get-task', function (req, res) {

    const id = req.body.id;
    const checkValidUser = `select count(id) as count from users where id=?`;
    con.query(checkValidUser, [id], function (err, success) {
        if (err) throw err
        if (success[0]['count'] === 0) {
            res.status(500).json({
                status: false,
                massage: 'Enter Valid id'
            });

        }
        else {
            const query = 'select task_name from tasks where user_id=?';

            con.query(query, [id], function (err, success) {
                if (err) throw err;

                res.status(200).json({
                    massage: 'Data fetch Successfully',
                    data: success
                });
            });
        }
    });

});

app.get('/get-user', function (req, res) {
    const query = `select name from users`;
    con.query(query, function (err, success) {
        if (err) throw err;

        res.status(200).json({
            massage: 'Data fetch Successfully',
            data: success
        });
    });
});
app.delete('/delete-user', function (req, res) {
    const id = req.body.id;

    const checkValidUser = `select count(id) as count from users where id=?`;
    con.query(checkValidUser, [id], function (err, success) {
        if (err) throw err
        if (success[0]['count'] === 0) {
            res.status(500).json({
                status: false,
                massage: 'Enter Valid id'
            });

        } else {
            const query = `delete  from users where id=?`;
            con.query(query, [id], function (err, success) {
                if (err) throw err;

                res.status(200).json({
                    status: true,
                    massage: 'Delete user Successfully',
                });
            });
        }
    });

});

app.listen(5000);