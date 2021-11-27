const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
var session = require('express-session');
const { request } = require('http');
const { equal } = require('assert');
const { resolveSoa } = require('dns');
const bcrypt = require('bcrypt');
const { getSystemErrorMap } = require('util');

var urlencodedParser = bodyParser.urlencoded({ extended: false })

let check_logged_in = 0;

const irish_car_dealership_database = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'irish_car_dealership_database'
})

// Connecting to the mysql

irish_car_dealership_database.connect(err => {
    if(err)
    {
        throw err;
    }
    else
    {
        console.log('Database connected');
    }
});

const irish_car_dealership_website = express();
irish_car_dealership_website.use(express.static("public"));

irish_car_dealership_website.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}));

irish_car_dealership_website.get('/createdb',(req,res) => {
    let sql_command = 'CREATE DATABASE irish_car_dealership_database';
    irish_car_dealership_database.query(sql_command,err => {
        if(err)
        {
            throw err;
        }

        else
        {
            res.send('Irish car dealership database successfully created!');
        }
    });
});


irish_car_dealership_website.listen('3000', () => {
    console.log('Server listening at port 3000');
});

irish_car_dealership_website.get('/createCarsTable',(req,res) => {
    let sql_create = 'CREATE TABLE IF NOT EXISTS cars(car_id int AUTO_INCREMENT PRIMARY KEY,username_of_owner VARCHAR(70),make VARCHAR(70),model VARCHAR(70),year int, transmission VARCHAR(20),mileage int,price int, engine_size float,colour VARCHAR(40),number_of_doors int)';
    irish_car_dealership_database.query(sql_create,err => {
        if(err)
        {
            throw err;
        }
        else
        {
            res.send('Created the cars table successfully!');
        }
    })
});


irish_car_dealership_website.get('/createProfilesTable',(req,res) => {
    let sql_create_2 = 'CREATE TABLE IF NOT EXISTS profiles(user_id int AUTO_INCREMENT PRIMARY KEY,username VARCHAR(100),password VARCHAR(100))';
    irish_car_dealership_database.query(sql_create_2, err => {
        if(err)
        {
            throw err;
        }
        else
        {
            res.send('Created the profile table successfully!!');
        }
    })

})

irish_car_dealership_website.get('/',(req,res) => {

    res.sendFile(path.join(__dirname,'./public/carDealershipHomepage.html'));
});

irish_car_dealership_website.get('/buyingcars',urlencodedParser,(req,res) => {

    irish_car_dealership_database.query('SELECT * from cars', function(err, rows, fields) {

        if(err)
        {
            throw err;
        }
        else
        {
            let resultsTable = `
            <table id="resultsTable" class="table">
            <thead>
                <tr>
                    <th scope="col">Make</th>
                    <th scope="col">Model</th>
                    <th scope="col">Year</th>
                    <th scope="col">Transmission</th>
                    <th scope="col">Mileage</th>
                    <th scope="col">Price</th>
                    <th scope="col">Engine Size</th>
                    <th scope="col">Colour</th>
                    <th scope="col">Number of Doors</th>
                </tr>
            </thead>
            <tbody>
            <a href="/" style=text-decoration:none;color:blue;>Go back to homepage</a>`;
  

            for(let i = 0; i < rows.length; i++) {
                resultsTable +=  `<tr><td>${rows[i].make}</td>`;
                resultsTable +=  `<td>${rows[i].model}</td>`;
                resultsTable +=  `<td>${rows[i].year}</td>`;
                resultsTable +=  `<td>${rows[i].transmission}</td>`;
                resultsTable +=  `<td>${rows[i].mileage}</td>`;
                resultsTable +=  `<td>${rows[i].price}</td>`;
                resultsTable +=  `<td>${rows[i].engine_size}</td>`;
                resultsTable +=  `<td>${rows[i].colour}</td>`;
                resultsTable +=  `<td>${rows[i].number_of_doors}</td></tr>`;
             }
            
            res.send(resultsTable);
        }
    });

});

irish_car_dealership_website.get('/sell',function(req,res){
    if(check_logged_in == 0)
    {
        res.sendFile(path.join(__dirname,'./public/restrictedaccess.html'));
    }
    else if(check_logged_in == 1)
    {
        res.sendFile(path.join(__dirname,'./public/sell.html'));
    }

});

irish_car_dealership_website.post('/sell',urlencodedParser,function(req,res){
    let sql_insert = ('INSERT INTO cars(username_of_owner,make,model,year, transmission,mileage,price, engine_size,colour,number_of_doors) VALUES(?,?,?,?,?,?,?,?,?,?)');
    let values_from_form = [req.session.Uname,req.body.make_of_cars_to_sell,req.body.model_of_cars_to_sell,req.body.year_of_car_to_sell,req.body.transmission_of_car_for_sell,req.body.mileage,req.body.price,req.body.engine_size,req.body.colour,req.body.number_of_doors];
    irish_car_dealership_database.query(sql_insert,values_from_form);
    res.redirect('/sell');
});

irish_car_dealership_website.get('/userlogin',(req,res) => {
    if(check_logged_in == 0)
    {
        res.sendFile(path.join(__dirname,'./public/profile.html'));
    }
    else if(check_logged_in == 1)
    {
        res.sendFile(path.join(__dirname,'./public/userprofile.html'));
    }

});

irish_car_dealership_website.post('/userlogin',urlencodedParser,async (req,res) => {
    if(check_logged_in == 0)
    {
        if(req.body.Uname && req.body.Password)
        {
            irish_car_dealership_database.query('SELECT * from profiles where username = ?',[req.body.Uname],async function(error, results, fields) {
            if(results.length == 1)
            {
                if(await bcrypt.compare(req.body.Password,results[0].password))
                {
                    req.session.loggedin = true;
                    req.session.Uname = req.body.Uname;
                    check_logged_in = 1;
                    res.redirect('/userprofile');
                }
                else
                {
                    req.session.loggedin = false;
                    req.session.Uname = req.body.Uname;
                    check_logged_in = 0;
                    res.redirect('/userlogin');
                }
            }
            else
            {
                req.session.loggedin = false;
                check_logged_in = 0;
                res.redirect('/userlogin');
            }
            res.end();
            });
        }

        else
        {
            res.send('Enter your username and password');
            req.session.loggedin = false;
            res.end();
        }
    }
    else if(check_logged_in == 1)
    {
        res.sendFile(path.join(__dirname,'./public/userprofile.html'));

    }

});



irish_car_dealership_website.get('/userregistration',(req,res) => {
    res.sendFile(path.join(__dirname,'./public/registerpage.html'));

});

irish_car_dealership_website.post('/userregistration',urlencodedParser,async (req,res) => {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(req.body.pwd,salt);
    irish_car_dealership_database.query('SELECT * from profiles where username = ?',[req.body.Uname], function(error, results, fields) {
        if(results.length == 1)
        {
            res.redirect('/userregistration');
        }
        else
        {
            let sql_insert_profile = ('INSERT INTO profiles(username,password) VALUES(?,?)');
            let values_from_profile_form = [req.body.username,hashPassword];
            irish_car_dealership_database.query(sql_insert_profile,values_from_profile_form);
            res.redirect('/');
        }
    });

});

irish_car_dealership_website.get('/userprofile',(req,res) => {
    if(check_logged_in == 0)
    {
        res.sendFile(path.join(__dirname,'./public/restrictedaccess.html'));
    }
    else if(check_logged_in == 1)
    {
        res.sendFile(path.join(__dirname,'./public/userprofile.html'));
    }

});

irish_car_dealership_website.post('/userprofile',urlencodedParser,(req,res) => {
    check_logged_in = 0;
    res.redirect("/userlogin");

});

irish_car_dealership_website.post('/updatepassword',urlencodedParser,async (req,res) => {

    const salt = await bcrypt.genSalt();
    const updateHashPassword = await bcrypt.hash(req.body.updatePassword,salt);

    let sql_update_profile_password = ('UPDATE profiles SET password = (?) WHERE username = (?)');
    let values_from_update_password = [updateHashPassword,req.session.Uname];
    irish_car_dealership_database.query(sql_update_profile_password,values_from_update_password);
    res.redirect('/userprofile');

});


irish_car_dealership_website.post('/deleteuserprofile',urlencodedParser,(req,res) => {

    let sql_to_delete_user_account = ('DELETE FROM profiles WHERE username = (?)');
    let username_to_delete = [req.session.Uname];
    irish_car_dealership_database.query(sql_to_delete_user_account,username_to_delete);
    check_logged_in = 0;
    req.session.loggedin = false;
    res.redirect('/');

});

irish_car_dealership_website.post('/viewMyCar',(req,res) => {

    irish_car_dealership_database.query('SELECT * from cars where username_of_owner = (?)',[req.session.Uname], function(err, rows, fields) {

        if(err)
        {
            throw err;
        }
        else
        {
            let myCar = `
            <table id="myCar" class="table">
            <thead>
                <tr>
                    <th scope="col">Car ID</th>
                    <th scope="col">Make</th>
                    <th scope="col">Model</th>
                    <th scope="col">Year</th>
                    <th scope="col">Transmission</th>
                    <th scope="col">Mileage</th>
                    <th scope="col">Price</th>
                    <th scope="col">Engine Size</th>
                    <th scope="col">Colour</th>
                    <th scope="col">Number of Doors</th>
                </tr>
            </thead>
            <tbody>`;
  

            for(let i = 0; i < rows.length; i++) {
                myCar +=  `<tr><td>${rows[i].car_id}</td>`;
                myCar +=  `<td>${rows[i].make}</td>`;
                myCar +=  `<td>${rows[i].model}</td>`;
                myCar +=  `<td>${rows[i].year}</td>`;
                myCar +=  `<td>${rows[i].transmission}</td>`;
                myCar +=  `<td>${rows[i].mileage}</td>`;
                myCar +=  `<td>${rows[i].price}</td>`;
                myCar +=  `<td>${rows[i].engine_size}</td>`;
                myCar +=  `<td>${rows[i].colour}</td>`;
                myCar +=  `<td>${rows[i].number_of_doors}</td></tr>`;
             }
            
            res.send(myCar);
        }
    });
});

irish_car_dealership_website.post('/deleteMyCar',urlencodedParser,(req,res) => {

    let sql_to_delete_car_from_records = ('DELETE FROM cars WHERE username_of_owner = (?) AND car_id = (?)');
    let usernames_car = [req.session.Uname,req.body.id_of_car];
    irish_car_dealership_database.query(sql_to_delete_car_from_records,usernames_car);
    res.redirect('/viewMyCar');

});

irish_car_dealership_website.post('/updatemycar',urlencodedParser,(req,res) => {

    let sql_to_update_car_from_records = ('UPDATE cars SET mileage = (?), price = (?), colour = (?)  WHERE username_of_owner = (?) AND car_id = (?)');
    let update_info = [req.body.mileage,req.body.price,req.body.colour,req.session.Uname,req.body.id_of_car];
    irish_car_dealership_database.query(sql_to_update_car_from_records,update_info);
    res.redirect('/buyingcars');

});
irish_car_dealership_website.post('/searchforcar',urlencodedParser,(req,res) => {
    irish_car_dealership_database.query('SELECT * from cars where make = (?) and model = (?)',[req.body.make_of_cars_for_buying_car,req.body.model_of_cars_for_buying_car], function(err, rows, fields) {

        if(err)
        {
            throw err;
        }
        else
        {
            let searchcar = `
            <table id="searchcar" class="table">
            <thead>
                <tr>
                    <th scope="col">Make</th>
                    <th scope="col">Model</th>
                    <th scope="col">Year</th>
                    <th scope="col">Transmission</th>
                    <th scope="col">Mileage</th>
                    <th scope="col">Price</th>
                    <th scope="col">Engine Size</th>
                    <th scope="col">Colour</th>
                    <th scope="col">Number of Doors</th>
                </tr>
            </thead>
            <tbody>`;
  

            for(let i = 0; i < rows.length; i++) {
                searchcar +=  `<tr><td>${rows[i].make}</td>`;
                searchcar +=  `<td>${rows[i].model}</td></tr>`;
             }
            
            res.send(searchcar);
        }
    });


});
