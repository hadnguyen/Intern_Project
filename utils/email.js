const nodemailer = require('nodemailer');

module.exports = class Email {
  constructor(user, url = '') {
    this.to = user.email;
    this.name = user.name;
    this.url = url;
    this.from = `Ha <${process.env.EMAIL_FROM}>`;
  }

  transporter() {
    return nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USERNAME,
        pass: process.env.SENDGRID_PASSWORD,
      },
    });
  }

  async sendWelcome() {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: 'Welcome!',
      text: `Hello ${this.name}`,
    };

    await this.transporter().sendMail(mailOptions);
  }

  async sendVerifyEmail() {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: 'Verify Email',
      html: `Please click this link to verify your email: <a href="${this.url}">${this.url}</a>`,
    };

    await this.transporter().sendMail(mailOptions);
  }

  //   async sendPasswordReset() {
  //     await this.send(
  //       'passwordReset',
  //       'Password reset token (valid for 10 minutes)'
  //     );
  //   }
};
