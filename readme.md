**IRISH CAR DEALERSHIP**

**WEB DEVELOPMENT AND DEPLOYMENT**

Date:					        	28/11/2021
Project: 				       	Website
Program code:				  	DT211-C
Lecturer’s Name:				Giancarlo Salton 
Team Members:					  3


**Amar Plakalo**					C19387623,
**Jade Corbally**					C19352071,
**Shahjhan Riaz**					D17129735

**Demo:**
https://youtu.be/yBoRHpYrHmo

**Purpose of the Web Development Project:**
The website allows the user to purchase a car or sell a car. In order for the user to purchase or sell a car, they must register an account and then log into the account. If the user wants to sell a car, they must enter information about the car they wish to sell and then click on the button that says “Add car for sale”. In the background, this will insert a row into the table called cars. This cars table holds the cars which the user can view. Whenever a car is put up for sale, it goes into this table. The profiles table deals with the user details, which are the username and password. Also, when the user registers, a row is inserted inside the profiles table. Then, when the user wants to login, the program checks whether the username and password that were inputted already exist in the table. If so, the user cannot register because another person already has an account with the same username and password. The last table we have is the purchase table which will contain the car_id that the user wishes to purchase and the username of the person so we can easily identify which user wants to purchase the car.

**Introduction:**
This is the basic level of car dealership website with multiple pages, 
Starting with a login and registration form developed using the html and javascript. 
Some of the validations with Node js are provided in it and we can modify them as per requirements. We have used css for making the content look better and bootstrap for the navbar and the footer. We designed the logo for the website. This website allows the user to purchase a car or to sell one. Anyone who accesses the website can view cars even if they have no account. On the other hand, if someone wants to purchase or sell a car, they must be logged in. 


**Body:**
Node js was used in this project to create routes which will direct the user to a certain page when they want to. Also, node js is used for the database part. In order to insert, read, update or delete something from a database, you need mysql. But in order to run mysql on a website, you must have a backend service such as node js. Node js was also used to authenticate whether a user is logged on or not. This is very important as we don’t want another user to have access to some other user’s details such as the cars that they want to buy. 

For the frontend, HTML and CSS were the primary languages that were used. Bootstrap was used to create the navbar and the footer on nearly all pages as well as the design on the homepage and restricted access page. Jquery was used to replace the content from the html because html is static. This allows us to change the contents of the html using jquery if we need to.

Starting with a login and registration form developed using the html,  javascript & event handler. 
Some of the validations are provided in it and we can modify them as per requirements.
We have used css for making the content look better and bootstrap for the navbar and the footer. We designed the logo for the website.

Showing content on screen after fetching from databases was one of our big challenges that we had. This was causing a big issue as it was important to have a list of cars presented on the screen for the user to view. One of our group members asked Giancarlo how we can take information from node js and print it in a html table. Giancarlo showed the group member the code from lecture 7 where he did it and the group sat together and another group member implemented the code in node js so that it can print out a html table to the screen. CSS was added so that the table could look more attractive. 


**Security Level:**  

We used 4th level (bcrypt) as this would ensure a secure system, where attackers could not gain access to passwords

Used bcrypt to generate hashed passwords

The reason we used it is because it stores hashed passwords into the database. This is important because if someone gains access to our database, they cannot steal information from us as the password is hashed. An important thing to note is that the users created in the sql file that was sent in the zip file will not have hashed passwords in the database because in order to hash them, they need to be created using the registration form on the website. If the user wants to hash them, they can just update the password of one of the three premade accounts and it will then be hashed.


**Conclusion:**

This project taught us how to work in a group setting and take notes and logs. It is very important to know how to work with a group of people because this is needed in a workplace setting. Also, this project made us learn node.js and how it interacts in a website. We found out how important it is for a website to have a backend service because every website needs a database to store important information. Finally, the project made us understand bootstrap and how it can be used in a clever way to make a well-designed website that attracts viewers.
