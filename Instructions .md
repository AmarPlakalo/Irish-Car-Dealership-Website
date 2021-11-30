IRISH CAR DEALERSHIP

WEB DEVELOPMENT AND DEPLOYMENT

Lecturer’s Name:				Giancarlo Salton, 

Instructions: (How it works) 
In order to make the website work, you must have mysql installed on your machine.
Once you have it installed, create a user inside mysql and give the user a username and password.
Do not forget the username and password because this will be used in the program.
Another important thing to note is that you must give the user the permission to access the database.
This is done by opening the mysql workbench and finding the connection that you are using.
When you find it, click on the connection. Mysql workbench will prompt you to enter the root password.
When you enter the password of the root (not the user password that you created), on the left hand side of the screen, click on users and privileges.
Find the user that you are using and make sure that the authentication type is set to standard and that you enter the correct username.
Then, go into the tab called administrative roles and select DBA. Then, hit apply.

Note Pictures cant be shown in git. recommended open instructions.pdf files to follow instructions.

Go back into the mysql workbench and on the left side of the screen, click on schemas:

Once you click on that, you will notice that there are some default databases there. 
You need to create the database for the Irish car dealership website. To do so, write inside the query part the command from the sql file that was sent. 
Then, run it.:

Once this is done, you must then create the tables inside the database. 
The commands for creating the tables are also inside the sql file but here is a sample picture of how it should look like:


Now, all three tables are created. After this, we need to populate the tables with some data. To do this, find the sql script sent in the zip file and paste it into the workbench. Then, execute the insert statements. This is how the statements should look like:


After creating and inserting data into all tables, the user should be able to access the website with the profile that was created.

Type “localhost:3000” into the search bar of the user's preferred browser. This takes the user to the homepage and they can then use the website as normal.
They should now locate the profile section and enter the profile credentials of one of the users that was inserted.
Once the credentials have been typed in, click on the login button. This will take you to your user profile. 
From here, you can have a look at the website and perform certain actions.


Purpose of the Web Development Project:
Please go to Read_Intro.md file thank you.
