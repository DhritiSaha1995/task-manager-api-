const mongoose = require('mongoose');
 mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true , useCreateIndex : true })



 
//  const User = mongoose.model('User', { 
//      name: {
//         type : String,
//         required: true,
//         trim: true

    
//      },
//      age:{
//          type : Number,
//          default: 0,
//          Validate(value){
//              if(value<0){
//                  throw new Error ("Age must be positive.")
//              }
//          }
//      },
//      email :{
//          type: String,
//          required: true,
//          trim:true,
//          lowercase:true
//      },
//      password: {
//          type: String,
//          trim:true,
//          Validate(value){
//              if(!value.length>6 || value.tolowercase().includes("password")){
//                 throw new Error ("Length must be greater than six.")
//              }
//          }

//      }
//  })
 
//  const getUser = new User({
//      name: "Rita",
//      email: "RitaSaha@gmail.com",
//      password: "passy"
//  })

//  getUser.save().then(()=>{
//      console.log(getUser)
//  }).catch((err)=>{
//      console.log("Error! " +err)
//  })


 // creating a model for tasks

//  const Tasks = mongoose.model('Tasks', {
//     description: {
//        type : String, 
//        required:true,
//        trim:true

//     },
//     completed:{
//         type : Boolean,
//         default:false

//     }
// })

// const getTasks = new Tasks({
//     description: "  Cleaning the room"
// })

// getTasks.save().then(()=>{
//     console.log("Added")
// }).catch((err)=>{
//     console.log(err)
// })