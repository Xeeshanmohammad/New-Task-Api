const express = require("express");
const router = new express.Router();
const Task = require("../Models/task");
const auth = require("../middleware/full-auth");

router.post('/createTask', async(req,res)=>{
    // const task = new Task(req.body)
    const task = new Task({...req.body,
        owner:req.params._id})
    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(401).send(error)
    }
})

router.get('/getTasks', async(req,res)=>{
    await req.user.populate('task').execPopulate()
       res.status(200).send(req.users.task) 
})

router.get('/task/:id', async(req,res)=>{
    const _id = req.params._id
    try {
        const task = await Task.findOne({_id, owner:req.user._id})
        if(!task){
            return res.status(404).send('No id with this task')
        }
        res.send(task)
    } catch (error) {
        res.status(404).send('Error! Something went wrong')
    }
})

router.patch("/taskUpdate/:id", async (req, res) => {
    const update = Object.keys(req.body);
    const updateAllowed = ["description", "completed"];
    const isValidOperations = update.every((updates) =>
      updateAllowed.includes(updates)
    );
    if (!isValidOperations) {
      return res.status(401).send("error: Invalid Update");
    }
    try {
      const task = await Task.findone({_id:req.params.id, owner:req.user._id})
     
      if (!task) {
        res.status(401).send("No task");
      }
      update.forEach((updates) => (task[updates] = req.body[updates]));
      await task.save();
    } catch (error) {
      console.log("error" + error);
    }
  });

  
router.delete("/deleteTask/me", auth, async (req, res) => {
    try {
    //   const task = await Task.findOneAndDelete({_id:req.params.id, owner:req.user._id})
    //   if (!task) {
    //     res.sendStatus(404).send("Not match to any taskId");
    //   }
    await req.user.remove()
      res.status(200).send("Deleted Successfully");
    } catch (error) {
      res.status(400).send('error'+error);
    }
  });

module.exports = router