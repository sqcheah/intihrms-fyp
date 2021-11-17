import mailer from 'nodemailer';

export const sendMail = async (content) => {
  let emailTemplate;
  switch (content.type) {
    case 'resetPassword': {
      emailTemplate = {
        subject: 'Reset Passsword!',
        html: `<h2> Your new password is ${content.password}</h2><br>`,
      };
      break;
    }

    case 'createUser': {
      emailTemplate = {
        subject: 'New user!',
        html: `<p> Email: ${content.email}</p><br><p> Password: ${content.password}</p>
        <br><a href="http://localhost:3000/auth">Click here to sign in</a>`,
      };
      break;
    }
    default: {
      emailTemplate = {
        subject: 'This is subject',
        html: '<h2>The html content</h2><br>',
      };
      break;
    }
  }
  console.log(emailTemplate);
  let body = {
    from: 'test <csq3411@gmail.com>',
    to: 'shaoqi1688@gmail.com',
    subject: emailTemplate.subject,
    html: emailTemplate.html,
  };

  const transporter = mailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log('Server is ready to take our messages');
    }
  });

  transporter.sendMail(body, (err, result) => {
    if (err) {
      console.log(err);
      return false;
    }
    console.log('email sent');
  });
};
