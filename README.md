clone this repository using command -- git clone "https://github.com/sharadvamsi/expense-tracker.git"


Important NOTE:        

1.while running locally replace this url "https://expense-tracker-beta-swart.vercel.app/" with "http:localhost:5000/" so that you can run application locally in your system.     

2. in backend also in app.use(cors({})object replace origin value "https://expense-tracker-beta-swart.vercel.app" with "*".
                                                                                                                                                                                         
3.There is no separate api to make a user admin. we have to edit in db manually by default every user role is created as "employee".

4. rename sample.env file to .env and provide values for keep to connect with db

now open the repository in your code editor and open terminal                                                                                                                                                                                                         

start backend       

-- type command cd server in your terminal                                                                                                                                                                                                                    

-- type command npm install to install dependencies                                                                                                               

-- type command to npm start to run server

start frontend

-- type command cd client in your terminal

-- type command npm install to install dependencies

-- type command to npm run dev to run client

project functionalities:

User:-

1. you can register any number of user in register form and login using that credentials.
2. every user dashboard has two sections view expenses and add expenses.
3. in view expenses you can see expenses created by you and their details and status.
4. in add expenses you can add the expenses details like amount,category, the day it was happened and why it happened like reason and submit it.
5. by default every expense you add is marked as pending. its status will be changed to either approved or rejected based on admin action.

Admin:
1. you can simply login to admin account by providing credentials given in note.
2. admin has three tabs view all expenses, audit logs, charts.
3. in view all expenses he can see the expenses filter them by either userId or status or both. remember to press filter button after selecting any filter.
4. he can approve or reject the expenses in view all tab only.
5. in audit log section basic logs are created.when a user added a expense it is created and when admin changes status of any expense it will be recorded and logged.
6. in charts section we have two categories one is expense calculation based on category and months basis.



Technologies used:Mongodb Atlas,react.js,node and express.js
Deployment: vercel(frontend), render(backend)

deployment Link: https://expense-tracker-beta-swart.vercel.app/

for reference have a look at demo video file provided to know how to interact with application or how it works :)
