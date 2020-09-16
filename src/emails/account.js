const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name)=>{ 
    const message = {
        to: email,
        from: 'dhritipuja50@gmail.com',
        subject: "Thanks for joining in!",
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`

    }
    sgMail.send(message)

}

const sendCancelationEmail = (email , name)=>{
    const message =  { 
    to: email,
    from: 'dhritipuja50@gmail.com',
    subject: "Your account is canceled successfully!",
    text: `Sorry for inconvinience caused to you, ${name}. Let me know how we can improve our service.`
    }


}
module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}