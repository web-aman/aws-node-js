const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');
module.exports.sendMail = (data) => {
    return new Promise(async function (resolve, reject) {
      try {
        // When mail template found
          const transporter = nodemailer.createTransport(smtpTransport({
            pool: true,
            host: "smtp.gmail.com",
            port: 465,
            auth: {
              user: 'amanneemasdbc@gmail.com',
              pass: 'plcu ujdh ijke qenc',
            },
            secure: true 
            // tls: {
            //   rejectUnauthorized: false,
            // },
          }));
         
          // Prepare the options 
          const options = {
                from: 'amanneemasdbc@gmail.com', // sender address
                to: data.email, // list of receivers
                subject: "IJArtBank Verification OTP", // Subject line
                text: "OTP Verification", // plain text body
                html: `Your verification otp is ${data.otp}`, // html body
          };

          // Send mail to the particular receiver
          transporter.sendMail(options, function (error) {
            // Error while sending the mail
            if (error) {
              // Resolve the process
              return reject(error);
            }
          
            // Resolve the process
            return resolve({
              type: 'success',
              message: 'Mail successfully sent'
            });
          });

      } catch (error) {
        // Reject the process
        return reject(error);
      };
    });
  };