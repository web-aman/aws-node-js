const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

module.exports.twilio = (user) => {
    return new Promise(async function (resolve, reject) {
      try {
        client.messages
        .create({
           body: `Your Verify OTP is ${user.OTP} `,
           from: '+12404502050',
           to: user.phone
         })
        .then(message => console.log(message.sid));
        // Resolve the process
        return resolve({
          type: 'success',
          message: 'OTP Successfully sent'
        });
      } catch (error) {
        // Reject the process
        return reject(error);
      };
    });
  };