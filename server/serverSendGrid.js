require('dotenv').config()
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const msg = {
  to: 'leandro.dipalma@gmail.com', 
  from: 'ivan@teampulse.ai', 
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
       // Log friendly error
       console.error(error);

       if (error.response) {
         // Extract error msg
         const {message, code, response} = error;
   
         // Extract response msg
         const {headers, body} = response;
         console.log('-----------------')
         console.error(body);
       }
  })