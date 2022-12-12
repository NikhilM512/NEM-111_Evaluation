

const express = require("express");
const { TodoModel } = require("../Models/Todo.model");

const todosRouter = express.Router();


todosRouter.get("/", async (req, res) => {
    const todos = await TodoModel.find()
    res.send(todos)
})

todosRouter.post("/create", async (req, res) => {
    const payload = req.body
    try{
        const new_Todo = new TodoModel(payload)
        await new_Todo.save()
        res.send("Todo created successfully")
    }
    catch(err){
        console.log(err)
        res.send("Something went wrong")
    }
})

todosRouter.patch("/update/:todoID", async (req, res) => {
        const todoID = req.params.todoID
        const userID = req.body.userID
        const todo = await TodoModel.findOne({_id:todoID})
        if(userID !== todo.userID){
            res.send("Not Authorised")
        }
        else{
            await TodoModel.findByIdAndUpdate({_id : noteID},payload)
            res.send("Todo updated successfully")
        }
})

todosRouter.delete("/delete/:todoID", async (req, res) => {
    const noteID = req.params.todoID
    const userID = req.body.userID
    const todo = await TodoModel.findOne({_id:noteID})
    if(userID !== todo.userID){
        res.send("Not Authorised")
    }
    else{
        await TodoModel.findByIdAndDelete({_id : noteID})
        res.send({"msg" : "Note deleted successfully"})
    }
})


module.exports = {todosRouter}


