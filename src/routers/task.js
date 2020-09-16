const express = require('express')
const Task = require('../model/task')
const auth = require('../middleware/auth')
const { request } = require('express')
const router = new express.Router()


router.post('/tasks', auth, async (req, res)=>{
 
    //var tasks = new Task(req.body);
    var tasks = new Task({
        ...req.body,
        owner: req.user._id

    })
    try {
        await tasks.save()
        res.status(201).send(tasks)
    } catch (error) {
        res.status(400).send(error)
    }
    
    // tasks.save().then(()=>{
    //     res.send(tasks)
    // }).catch((e)=>{
    //     res.status(400).send(e)
    // })
   })

router.get('/tasks' , auth, async (req, res)=>{
    const match = {}
    if(req.query.completed)
    {
        match.completed = req.query.completed==="true"
    }
    const sort = {}
    if(req.query.sortBy)
    {
        const parts = req.query.sortBy.split(':')
         sort[parts[0]] = parts[1] === "desc" ? -1 : 1
    }


    try {

    //  var tasks = await Task.find({
    //     owner: req.user._id
    //  })
   // var tasks = await Task.find({})

    // await req.user.populate('tasks').execPopulate()
     await req.user.populate({
         path: 'tasks',
         match,
         options: {
             limit: parseInt(req.query.limit),
             skip: parseInt(req.query.skip),
             sort
         }
     }).execPopulate()
     res.status(201).send(req.user.tasks)
    } catch (error) {
        res.status(400).send(error)
        
    }
//     Task.find({}).then((tasks)=>{
//         console.log("the tasks are : " +tasks)
//        res.send(tasks)
//    }).catch((e)=>{
//        res.status(500).send(e)
//    })
})

router.get('/tasks/:id' ,auth, async (req, res)=>{
    const _id = req.params.id

    try {
      //  var tasks =  await Task.findById(_id)
      var tasks = await Task.findOne({ _id, owner : req.user._id})
        if(!tasks){
                      return res.status(404).send({error: "Invalid"})
                   }
                  res.status(201).send(tasks)

    } catch (error) {
        res.status(500).send(error)
    }
//    Task.findById(_id).then((tasks)=>{
//        if(!tasks){
//           return res.status(404).send()
//        }
//       res.send(tasks)
//   }).catch((e)=>{
//       res.status(500).send(e)
//   })
})

router.patch('/tasks/:id',auth, async (req, res)=>{

    const updates = Object.keys(req.body)
    const allowedUpdates = ["description", "completed"]
    const isValid =  updates.every((updates)=>
        allowedUpdates.includes(updates)
    )
    if(!isValid){
       return res.status(404).send({
            error: "Invalid operation performed"
        })
    }
    try {
       // const task = await Task.findById(req.params.id);
       const task = await Task.findOne({_id: req.params.id, owner: req.user._id});
       console.log(task)
       

       // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new : true, runValidators: true})
        if(!task){
            return res.status(404).send()
        }
        updates.forEach((update)=> 
        task[update] = req.body[update])
        await task.save()
       
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})



router.delete('/tasks/:id', auth, async (req, res)=>{
    try {
        const task = await Task.findOneAndDelete({
            _id:req.params.id,
            owner: req.user._id
        })
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
        
        
    }
})


module.exports = router