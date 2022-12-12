

const express=require('express');
const cors = require("cors");
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');

const { connection } = require("./Config/db");
const { authenticate } = require('./middleware/authenticate');
const { TodoModel } = require('./Models/Todo.model');
const { UserModel } = require('./Models/User.model');
const { todosRouter } = require('./Routes/todos.route');

const app=express()
require('dotenv').config()


app.use(express.json())
app.use(cors({
    origin : "*"
}))

app.get("/",(req,res)=>{
    res.send("WELCOME to TODO APP");
})

app.get("/todos",async(req,res)=>{
    try {
        const todos= await TodoModel.find()
        res.send(todos)
    } catch (error) {
        console.log(error)
    }
})

app.post("/signup", async(req,res)=>{
//    console.log(res.body);
//    const {email,password}=req.body;
// const user= new UserModel({email,password})
// user.save()
// res.send("Sign Up Successful")
   const {email,password}=req.body;
   const checkUser=await UserModel.findOne({email})
   if(checkUser?.email){
    res.send("User Already Exist, Try to Login")
   }else{
    try {
        // const user= new UserModel({email,password})
        bcrypt.hash(password,3,async function (err,hash){
            const user=new UserModel({email,password:hash})
            await user.save()
            res.send("Sign Up Successful")
        })
    } catch (error) {
        console.log(error)
        console.log("Something Went Wrong, Try Again Later");
    }
   }
})

app.post("/login",async (req,res)=>{
     const {email,password}=req.body
     try {
        const usersArr=await UserModel.find({email})
        if(usersArr.length>0){
            const hidden_password=usersArr[0].password;
            bcrypt.compare(password,hidden_password,function(err,result){
                if(result){
                    const token=jwt.sign({"userID":usersArr[0]._id},'hush');
                    res.send({"Status":"Login SuccessFull","token":token})
                }else{
                    console.log("Login Failed");
                }
            })
        }
     } catch (error) {
        res.send("Something Went Wrong, Try Again Later")
     }
})

app.use(authenticate)
app.use("/todos", todosRouter)

app.listen(7894,async()=>{
    try {
        await connection;
        console.log("connected to DB")
    } catch (error) {
        console.log("Connection to DB Failed");
        console.log(error);
    }
    console.log("Listening on port 7894");
})
