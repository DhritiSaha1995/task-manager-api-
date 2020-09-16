const express = require('express')
const sharp = require('sharp')
const multer = require('multer')
const User = require('../model/user')
const auth = require('../middleware/auth');
const {sendWelcomeEmail, sendCancelationEmail} = require('../emails/account')
const router = new express.Router()

router.post('/users', async (req, res)=>{
    
    const user = new User(req.body);
   try{
    await user.save()
    sendWelcomeEmail(user.email, user.name)
    const token = await user.generateAuthToken()
    res.status(201).send({user,token})
   }
   catch(e){
       res.status(400).send(e)
   }
   //  user.save().then(()=>{
   //      res.send(user)
   //  }).catch((e)=>{
   //      res.status(400).send(e)
   //  })
    })

 router.post('/users/login', async (req, res)=>{
     try {
     
        console.log(req.body)
         const user = await User.findCredential(req.body.email, req.body.password)
         console.log(user)
        
         const token = await user.generateAuthToken()
      
         res.send({user, token})
         
     } catch (error) {
        res.status(400).send(error)
     }
 }

 )
   
    // router.get('/users' , auth, async  (req, res)=>{
    //   try{
    //   var user = await User.find({})
    //   res.send(user)
    //   }
    //   catch(e){
    //    res.status(400).send(e)
    //   }
    //    //  User.find({}).then((user)=>{
    //    //     res.send(user)
    //    // }).catch((e)=>{
    //    //     res.status(400).send(e)
    //    // })
    // })

    router.post('/users/logout', auth, async (req, res)=>{
        try {
            req.user.tokens = req.user.tokens.filter((token)=>{
                return token.token !== req.token
            })
            await req.user.save()
            res.send()
            
        } catch (error) {
            res.status(500).send()
        }
    })
   

    router.post('/users/logoutall', auth, async (req, res)=>{
        try {

           console.log(req.user) 
           req.user.tokens = []
           await req.user.save()
           res.send("Deleted all.")
        } catch (error) {
            res.status(500).send()
            
        }
    })



    router.get('/users/me' , auth, async  (req, res)=>{
        res.send(req.user)
      })
     
   
//     router.get('/users/:id' , async (req, res)=>{
//         const _id = req.params.id
//         try{
//            const user =  User.findfindById(_id)
//            res.status(201).send(user)
//         }
//         catch(e){
//            res.status(400).send(e)
//         }
//    //     User.findfindById(_id).then((user)=>{
//    //        res.send(user)
//    //    }).catch((e)=>{
//    //        res.status(400).send(e)
//    //    })
//    })

router.get('/users/me' , auth, async (req, res)=>{
   
    try{
    
       res.status(201).send(req.user)
    }
    catch(e){
       res.status(400).send(e)
    }
//     User.findfindById(_id).then((user)=>{
//        res.send(user)
//    }).catch((e)=>{
//        res.status(400).send(e)
//    })
})
   
//    router.patch('/users/:id', async (req, res)=>{
   
//        const updates = Object.keys(req.body)
//        const allowedUpdates = ['name', 'email', 'password', 'age']
//        const isValid =  updates.every((updates)=>
//            allowedUpdates.includes(updates)
//        )
//        if(!isValid){
//            res.status(404).send({
//                error: "Invalid operation"
//            })
//        }
//        try {
//            const user = await User.findById(req.params.id);
//            updates.forEach((update)=> 
//            user[update] = req.body[update])
//            await user.save()

           
       
//           // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new : true, runValidators: true})
//            if(!user){
//            return res.status(404).send()
//            }
//            console.log(User)
//            res.status(201).send(user)
           
//        } catch (error) {
//            res.status(400).send(error)
//        }
//    })

   router.patch('/users/me', auth, async (req, res)=>{
   
       const updates = Object.keys(req.body)
       const allowedUpdates = ['name', 'email', 'password', 'age']
       const isValid =  updates.every((updates)=>
           allowedUpdates.includes(updates)
       )
       if(!isValid){
           res.status(404).send({
               error: "Invalid operation"
           })
       }
       try {
           const user = req.user;
           updates.forEach((update)=> 
           user[update] = req.body[update])
           await user.save()
         
           res.status(201).send(user)
           
       } catch (error) {
           res.status(400).send(error)
       }
   })
   
   
//    router.delete('/users/:id', async (req, res)=>{
//        try {
//            const user = await User.findByIdAndDelete(req.params.id)
//            if(!user){
//                return res.status(404).send()
//            }
//            res.send(user)
//        } catch (error) {
//            res.status(404).send(error)
           
           
//        }
//    })

router.delete('/users/me', auth, async (req, res)=>{
    try {
        console.log("hi")
        await req.user.remove()
        sendCancelationEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (error) {
        res.status(404).send(error)
        
        
    }
})
const upload = multer({
   // dest: "avatars", 
    limits:{
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error("Please upload a jpg or jpeg or png file."))
        }
        cb(undefined, true)

 } 
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async(req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({width: 250, height:250}).png().toBuffer()
     req.user.avatar = buffer;
   await req.user.save()
   res.send()
}, (error, req, res, next)=>{
    res.status(400).send({error: error.message})
})
 router.delete('/users/me/avatar', auth, async(req,res)=>{

    req.user.avatar = undefined
    await req.user.save()
    res.send("Deleted")

 })

 router.get('/users/:id/avatar', async(req, res)=>{
    try{ const user = await User.findById(req.params.id)

     if(!user || !user.avatar){
         throw new Error()
     }
       res.set('content-type', 'image/png')
       res.send(user.avatar)
    }
    catch(e){
        res.status(404).send()
    }
 })

 module.exports = router
   