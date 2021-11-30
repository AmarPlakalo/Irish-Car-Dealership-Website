IRISH CAR DEALERSHIP

WEB DEVELOPMENT AND DEPLOYMENT

Date:					        	28/11/2021,
Project: 				       	Website,
Program code:				  	DT211-C,
Lecturer’s Name:				Giancarlo Salton, 
Team Members:					  3.


Amar Plakalo					C19387623,
Jade Corbally					C19352071,
Shahjhan Riaz					D17129735.


Instructions: (How it works) 
In order to make the website work, you must have mysql installed on your machine. Once you have it installed, create a user inside mysql and give the user a username and password. Do not forget the username and password because this will be used in the program. Another important thing to note is that you must give the user the permission to access the database. This is done by opening the mysql workbench and finding the connection that you are using.
When you find it, click on the connection. Mysql workbench will prompt you to enter the root password. When you enter the password of the root (not the user password that you created), on the left hand side of the screen, click on users and privileges. Find the user that you are using and make sure that the authentication type is set to standard and that you enter the correct username. Then, go into the tab called administrative roles and select DBA. Then, hit apply.

Go back into the mysql workbench and on the left side of the screen, click on schemas which is shown in the picture below:


Once you click on that, you will notice that there are some default databases there. You need to create the database for the Irish car dealership website. To do so, write inside the query part the command from the sql file that was sent. Then, run it. The picture of the query is below:


Once this is done, you must then create the tables inside the database. The commands for creating the tables are also inside the sql file but here is a sample picture of how it should look like:


Now, all three tables are created. After this, we need to populate the tables with some data. To do this, find the sql script sent in the zip file and paste it into the workbench. Then, execute the insert statements. This is how the statements should look like:


After creating and inserting data into all tables, the user should be able to access the website with the profile that was created.

Type “localhost:3000” into the search bar of the user's preferred browser. This takes the user to the homepage and they can then use the website as normal. They should now locate the profile section and enter the profile credentials of one of the users that was inserted. Once the credentials have been typed in, click on the login button. This will take you to your user profile. From here, you can have a look at the website and perform certain actions.


Purpose of the Web Development Project:
The website allows the user to purchase a car or sell a car. In order for the user to purchase or sell a car, they must register an account and then log into the account. If the user wants to sell a car, they must enter information about the car they wish to sell and then click on the button that says “Add car for sale”. In the background, this will insert a row into the table called cars. This cars table holds the cars which the user can view. Whenever a car is put up for sale, it goes into this table. The profiles table deals with the user details, which are the username and password. Also, when the user registers, a row is inserted inside the profiles table. Then, when the user wants to login, the program checks whether the username and password that were inputted already exist in the table. If so, the user cannot register because another person already has an account with the same username and password. The last table we have is the purchase table which will contain the car_id that the user wishes to purchase and the username of the person so we can easily identify which user wants to purchase the car.

Introduction:
This is the basic level of car dealership website with multiple pages, 
Starting with a login and registration form developed using the html and javascript. 
Some of the validations with Node js are provided in it and we can modify them as per requirements. We have used css for making the content look better and bootstrap for the navbar and the footer. We designed the logo for the website. This website allows the user to purchase a car or to sell one. Anyone who accesses the website can view cars even if they have no account. On the other hand, if someone wants to purchase or sell a car, they must be logged in. 



Body : (what we used)
Node js was used in this project to create routes which will direct the user to a certain page when they want to. Also, node js is used for the database part. In order to insert, read, update or delete something from a database, you need mysql. But in order to run mysql on a website, you must have a backend service such as node js. Node js was also used to authenticate whether a user is logged on or not. This is very important as we don’t want another user to have access to some other user’s details such as the cars that they want to buy. 

For the frontend, HTML and CSS were the primary languages that were used. Bootstrap was used to create the navbar and the footer on nearly all pages as well as the design on the homepage and restricted access page. Jquery was used to replace the content from the html because html is static. This allows us to change the contents of the html using jquery if we need to.

Starting with a login and registration form developed using the html,  javascript & event handler. 
Some of the validations are provided in it and we can modify them as per requirements.
We have used css for making the content look better and bootstrap for the navbar and the footer. We designed the logo for the website.

Showing content on screen after fetching from databases was one of our big challenges that we had. This was causing a big issue as it was important to have a list of cars presented on the screen for the user to view. One of our group members asked Giancarlo how we can take information from node js and print it in a html table. Giancarlo showed the group member the code from lecture 7 where he did it and the group sat together and another group member implemented the code in node js so that it can print out a html table to the screen. CSS was added so that the table could look more attractive. 



Security Level:  

We used 4th level (bcrypt) due to it being secure.

Used bcrypt to generate hashed passwords using bcrypt code from slide 13 week 9.
The reason we used it is because it stores hashed passwords into the database. This is important because if someone gains access to our database, they cannot steal information from us as the password is hashed. An important thing to note is that the users created in the sql file that was sent in the zip file will not have hashed passwords in the database because in order to hash them, they need to be created using the registration form on the website. If the user wants to hash them, they can just update the password of one of the three premade accounts and it will then be hashed.
Points:
Testing while loading passwords from databases we passed the compare function to match hash. 
Databases can be accessible from our source to prevent data leak. We used a key and encrypted password.
For the user database, the program will check if the username and password is correct. If the user is not logged in, they will not be able to access some pages on the website.


Conclusion:

This project taught us how to work in a group setting and take notes and logs. It is very important to know how to work with a group of people because this is needed in a workplace setting. Also, this project made us learn node js and how it interacts in a website. We found out how important it is for a website to have a backend service because every website needs a database to store important information. Finally, the project made us understand bootstrap and how it can be used in a clever way to make a well-designed website that attracts people to view it.
