const sgMail = require('@sendgrid/mail')
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY

sgMail.setApiKey(SENDGRID_API_KEY);

//user welcome email
const sendWelcomeMail = (email, name) => {
  const welcomeMsg = {
  to: email,
  from: 'test@weatherapp.com',
  subject: 'Thanks for using weather app!',
  text: `Happy for ${name} to join this app!!`,
  };
  sgMail.send(welcomeMsg)
}

//user cancellation email

const sendCancellationMail = (email, name) => {
  const cancelMsg = {
  to: email,
  from: 'test@weatherapp.com',
  subject: 'Service Cancellation info',
  text: `Sad for ${name} to leave this app :(`,
  };
  sgMail.send(cancelMsg)
}

module.exports = {
  sendWelcomeMail,
  sendCancellationMail
}