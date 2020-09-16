const express = require('express');
require('./db/mongoose')
const userRoute = require('./routers/user')
const taskRoute = require('./routers/task')


const app = express();
const port = process.env.PORT;

// setting up of middleware
// app.use((req, res, next)=>{
//     res.status(503).send('Server under maintenance.')
// })


app.use(express.json())
app.use(userRoute)
app.use(taskRoute)


// const jwt =require('jsonwebtoken')
// const myfunc = async ()=>{
//     const token = jwt.sign({ _id: "abc123"}, "thisismypocket",{expiresIn: '7 days'})
//     console.log(token)
//    const data = jwt.verify(token, "thisismypocket")
//    console.log(data)
// }

// myfunc()


// const pet = {
//     name: "tomy"
// }

// console.log(JSON.stringify(pet))

app.listen(port, ()=>{
    console.log("Server is up on port " +port)
})

// const Task = require('./model/task')
// const User = require('./model/user')
// // const main = async function (){
// // //    const task = await Task.findById('5f5e8c62a551c02b80346d07')
// // //    await task.populate('owner').execPopulate()
// // //    console.log(task.owner)
// // const user = await User.findById('5f5e8b78e6d8ef12a42d5436')
// // await user.populate('tasks').execPopulate()

// console.log(user.tasks)
// }
// main()