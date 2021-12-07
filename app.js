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
    user:'user123',
    password:'amar12345',
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
        console.log('Database successfully connected!');
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


irish_car_dealership_website.get('/createPurchaseTable',(req,res) => {
    let sql_create_3 = 'CREATE TABLE IF NOT EXISTS purchase(id_car_to_purchase int,username VARCHAR(70))';
    irish_car_dealership_database.query(sql_create_3, err => {
        if(err)
        {
            throw err;
        }
        else
        {
            res.send('Created the purchase table successfully!!');
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
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
            <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.0/css/all.css" integrity="sha384-lZN37f5QGtY3VHgisS14W3ExzMWZxybE1SJSEsQp9S+oqd12jhcu+A56Ebc1zFSJ" crossorigin="anonymous">
            <style>
            th
            {
                color:blue;
                background-color:#d3d3d3;
                padding:14px;
            }

            td
            {
                padding:14px;
            }

            table, th, td
            {
                border:2px solid black;
                border-collapse:collapse;
            }

            .logo_in_nav
            {
                height:50px;
            }

            .logo_in_footer
            {
                height:150px;
            }
            .footer-top
            {
                padding-bottom:90px;
                padding:90px;
            }

            #footer_fixed
            {
                position:absolute;
                bottom:0;
                width:100%;
                height:60px;
            }

            #footer_fixed_for_sell
            {
                position:absolute;
                bottom:0;
                width:100%;
                height:3px;
            }
            .hero
            {
                background-image:url("https://live.dealer-asset.co/ie1182/siteassets/Honda-Civic-Sedan-Gallery-Exterior-1.jpg");
                background-position:center;
                background-size:cover;
                background-attachment:fixed;
            }

            </style>
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container">
            <img class="logo_in_nav" src = "logo final.png"></img>
            <a class="navbar-brand" href="/">Irish Car Dealership</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                <li class="nav-item active">
                    <a class="nav-link" href="/">Home <span class="sr-only">(current)</span></a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/buyingcars">Cars</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/sell">Sell Car</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/userlogin">Profile</a>
                </li>
                </ul>
                </div>
            </div>
            </nav>
            <table id="resultsTable" class="table">
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
            <tbody>
            <a href="/purchasecar" style=text-decoration:none;color:blue;>Purchase Car</a>`
            ;
  

            for(let i = 0; i < rows.length; i++) {
                resultsTable +=  `<tr><td>${rows[i].car_id}</td>`;
                resultsTable +=  `<td>${rows[i].make}</td>`;
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
                else if(req.body.Password === results[0].password)
                {
                    req.session.loggedin = true;
                    req.session.Uname = req.body.Uname;
                    check_logged_in = 1;
                    res.redirect('/userprofile');
                }
                else
                {
                    req.session.loggedin = false;
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
    irish_car_dealership_database.query('SELECT * from profiles where username = (?)',[req.body.username], function(error, results, fields) {
        if(results.length == 1)
        {
            res.redirect('/userregistration');
        }
        else
        {
            let sql_insert_profile = ('INSERT INTO profiles(username,password) VALUES(?,?)');
            let values_from_profile_form = [req.body.username,hashPassword];
            irish_car_dealership_database.query(sql_insert_profile,values_from_profile_form);
            res.redirect('/userlogin')
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
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
            <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.0/css/all.css" integrity="sha384-lZN37f5QGtY3VHgisS14W3ExzMWZxybE1SJSEsQp9S+oqd12jhcu+A56Ebc1zFSJ" crossorigin="anonymous">
            <style>
            th
            {
                color:blue;
                background-color:#d3d3d3;
                padding:14px;
            }

            td
            {
                padding:14px;
            }

            table, th, td
            {
                border:2px solid black;
                border-collapse:collapse;
            }

            .logo_in_nav
            {
                height:50px;
            }

            .logo_in_footer
            {
                height:150px;
            }
            .footer-top
            {
                padding-bottom:90px;
                padding:90px;
            }

            #footer_fixed
            {
                position:absolute;
                bottom:0;
                width:100%;
                height:60px;
            }

            #footer_fixed_for_sell
            {
                position:absolute;
                bottom:0;
                width:100%;
                height:3px;
            }
            .hero
            {
                background-image:url("https://live.dealer-asset.co/ie1182/siteassets/Honda-Civic-Sedan-Gallery-Exterior-1.jpg");
                background-position:center;
                background-size:cover;
                background-attachment:fixed;
            }

            </style>
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container">
            <img class="logo_in_nav" src = "logo final.png"></img>
            <a class="navbar-brand" href="/">Irish Car Dealership</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                <li class="nav-item active">
                    <a class="nav-link" href="/">Home <span class="sr-only">(current)</span></a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/buyingcars">Cars</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/sell">Sell Car</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/userlogin">Profile</a>
                </li>
                </ul>
                </div>
            </div>
            </nav>
            
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
    res.redirect("/cardashboard");
    

});

irish_car_dealership_website.post('/updatemycar',urlencodedParser,(req,res) => {

    let sql_to_update_car_from_records = ('UPDATE cars SET mileage = (?), price = (?), colour = (?)  WHERE username_of_owner = (?) AND car_id = (?)');
    let update_info = [req.body.mileage,req.body.price,req.body.colour,req.session.Uname,req.body.id_of_car];
    irish_car_dealership_database.query(sql_to_update_car_from_records,update_info);
    res.redirect('/buyingcars');

});
irish_car_dealership_website.post('/searchforcar',urlencodedParser,(req,res) => {
    irish_car_dealership_database.query('SELECT * from cars where make = (?) AND model = (?) AND year = (?)',[req.body.make_of_cars_to_search,req.body.model_of_cars_to_search,req.body.year_of_car_to_search], function(err, rows, fields) {

        if(err)
        {
            throw err;
        }
        else
        {
            let searchcar = `
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
            <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.0/css/all.css" integrity="sha384-lZN37f5QGtY3VHgisS14W3ExzMWZxybE1SJSEsQp9S+oqd12jhcu+A56Ebc1zFSJ" crossorigin="anonymous">
            <style>
            th
            {
                color:blue;
                background-color:#d3d3d3;
                padding:14px;
            }

            td
            {
                padding:14px;
            }

            table, th, td
            {
                border:2px solid black;
                border-collapse:collapse;
            }

            .logo_in_nav
            {
                height:50px;
            }

            .logo_in_footer
            {
                height:150px;
            }
            .footer-top
            {
                padding-bottom:90px;
                padding:90px;
            }

            #footer_fixed
            {
                position:absolute;
                bottom:0;
                width:100%;
                height:60px;
            }

            #footer_fixed_for_sell
            {
                position:absolute;
                bottom:0;
                width:100%;
                height:3px;
            }
            .hero
            {
                background-image:url("https://live.dealer-asset.co/ie1182/siteassets/Honda-Civic-Sedan-Gallery-Exterior-1.jpg");
                background-position:center;
                background-size:cover;
                background-attachment:fixed;
            }

            </style>
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container">
            <img class="logo_in_nav" src = "logo final.png"></img>
            <a class="navbar-brand" href="/">Irish Car Dealership</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                <li class="nav-item active">
                    <a class="nav-link" href="/">Home <span class="sr-only">(current)</span></a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/buyingcars">Cars</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/sell">Sell Car</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/userlogin">Profile</a>
                </li>
                </ul>
                </div>
            </div>
            </nav>
            <style>
            th
            {
                color:blue;
                background-color:#d3d3d3;
                padding:14px;
            }

            td
            {
                padding:15px;
            }

            table, th, td
            {
                border:2px solid black;
                border-collapse:collapse;
            }
            </style>
            <table id="searchcar" class="table">
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
                searchcar +=  `<tr><td>${rows[i].car_id}</td>`;
                searchcar +=  `<td>${rows[i].make}</td>`;
                searchcar +=  `<td>${rows[i].model}</td>`;
                searchcar +=  `<td>${rows[i].year}</td>`;
                searchcar +=  `<td>${rows[i].transmission}</td>`;
                searchcar +=  `<td>${rows[i].mileage}</td>`;
                searchcar +=  `<td>${rows[i].price}</td>`;
                searchcar +=  `<td>${rows[i].engine_size}</td>`;
                searchcar +=  `<td>${rows[i].colour}</td>`;
                searchcar +=  `<td>${rows[i].number_of_doors}</td></tr>`;
             }
            
            res.send(searchcar);
        }
    });


});

irish_car_dealership_website.get('/cardashboard',(req,res) => {
    if(check_logged_in == 0)
    {
        res.sendFile(path.join(__dirname,'./public/restrictedaccess.html'));
    }
    else if(check_logged_in == 1)
    {
        res.sendFile(path.join(__dirname,'./public/cardashboard.html'));
    }

});



irish_car_dealership_website.get('/purchasecar',(req,res) => {
    if(check_logged_in == 0)
    {
        res.sendFile(path.join(__dirname,'./public/restrictedaccess.html'));
    }
    else if(check_logged_in == 1)
    {
        res.sendFile(path.join(__dirname,'./public/purchasecar.html'));
    }

});


irish_car_dealership_website.post('/purchasecar',urlencodedParser,(req,res) => {
    irish_car_dealership_database.query('SELECT * from cars where username_of_owner = (?) and car_id = (?)',[req.session.Uname,req.body.id_of_car], function(error, results, fields) {
        if(results.length == 1)
        {
            res.redirect('/');
        }
        else
        {
            irish_car_dealership_database.query('SELECT * from purchase where id_car_to_purchase = (?) and username = (?)',[req.body.id_of_car,req.session.Uname], function(error, results, fields) {
                if(results.length == 1)
                {
                    res.redirect('/');
                }
                else
                {
                    let sql_insert_into_purchase_table = ('INSERT INTO purchase(id_car_to_purchase,username) VALUES(?,?)');
                    let values_from_form_in_purchase_car = [req.body.id_of_car,req.session.Uname];
                    irish_car_dealership_database.query(sql_insert_into_purchase_table,values_from_form_in_purchase_car);
                    res.redirect('/cardashboard');
                }
            });
        }
    });
});


irish_car_dealership_website.get('/viewpurchasecar',(req,res) => {
    irish_car_dealership_database.query('SELECT * from purchase where username = (?)',[req.session.Uname], function(err, rows, fields) {

        if(err)
        {
            throw err;
        }
        else
        {
            let viewpurchasecar = `
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
            <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.0/css/all.css" integrity="sha384-lZN37f5QGtY3VHgisS14W3ExzMWZxybE1SJSEsQp9S+oqd12jhcu+A56Ebc1zFSJ" crossorigin="anonymous">
            <style>
            th
            {
                color:blue;
                background-color:#d3d3d3;
                padding:14px;
            }

            td
            {
                padding:14px;
            }

            table, th, td
            {
                border:2px solid black;
                border-collapse:collapse;
            }

            .logo_in_nav
            {
                height:50px;
            }

            .logo_in_footer
            {
                height:150px;
            }
            .footer-top
            {
                padding-bottom:90px;
                padding:90px;
            }

            #footer_fixed
            {
                position:absolute;
                bottom:0;
                width:100%;
                height:60px;
            }

            #footer_fixed_for_sell
            {
                position:absolute;
                bottom:0;
                width:100%;
                height:3px;
            }
            .hero
            {
                background-image:url("https://live.dealer-asset.co/ie1182/siteassets/Honda-Civic-Sedan-Gallery-Exterior-1.jpg");
                background-position:center;
                background-size:cover;
                background-attachment:fixed;
            }

            </style>
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container">
            <img class="logo_in_nav" src = "logo final.png"></img>
            <a class="navbar-brand" href="/">Irish Car Dealership</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                <li class="nav-item active">
                    <a class="nav-link" href="/">Home <span class="sr-only">(current)</span></a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/buyingcars">Cars</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/sell">Sell Car</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/userlogin">Profile</a>
                </li>
                </ul>
                </div>
            </div>
            </nav>
            <style>
            th
            {
                color:blue;
                background-color:#d3d3d3;
                padding:14px;
            }

            td
            {
                padding:15px;
            }

            table, th, td
            {
                border:2px solid black;
                border-collapse:collapse;
            }
            </style>
            <table id="viewpurchasecar" class="table">
            <thead>
                <tr>
                    <th scope="col">ID of car you wish to buy</th>
                    <th scope="col">Your username</th>
                </tr>
            </thead>
            <tbody>`;
  

            for(let i = 0; i < rows.length; i++) {
                viewpurchasecar +=  `<tr><td>${rows[i].id_car_to_purchase}</td>`;
                viewpurchasecar +=  `<td>${rows[i].username}</td></tr>`;
             }
            
            res.send(viewpurchasecar);
        }
    });
});


irish_car_dealership_website.post('/updatepurchasecar',urlencodedParser,(req,res) => {

    irish_car_dealership_database.query('SELECT * from cars where username_of_owner = (?) and car_id = (?)',[req.session.Uname,req.body.id_of_car], function(error, results, fields) {
        if(results.length == 1)
        {
            res.redirect('/');
        }
        else
        {
            let sql_to_update_cart = ('UPDATE purchase SET id_car_to_purchase = (?) WHERE username = (?)');
            let update_info_cart = [req.body.id_of_car,req.session.Uname];
            irish_car_dealership_database.query(sql_to_update_cart,update_info_cart);
            res.redirect('/cardashboard');
        }
    });

});



irish_car_dealership_website.post('/deletepurchasecar',urlencodedParser,(req,res) => {

    let sql_to_delete_purchase_car = ('DELETE FROM purchase WHERE username = (?)');
    let username_of_user_who_wants_to_purchase_car = [req.session.Uname];
    irish_car_dealership_database.query(sql_to_delete_purchase_car,username_of_user_who_wants_to_purchase_car);
    res.redirect('/cardashboard');

});