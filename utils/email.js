const nodemailer = require('nodemailer');
const pug = require('pug');
module.exports = class Email {
  constructor(user, url = '', time = null) {
    this.to = user.email;
    this.name = user.name;
    this.url = url;
    this.time = time;
    this.from = `ADMIN <${process.env.EMAIL_FROM}>`;
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
    const html = pug.renderFile(`${__dirname}/../views/emails/welcome.pug`, {
      name: this.name,
      url: this.url,
      subject: 'Welcome!',
    });
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: 'Welcome!',
      html,
    };

    await this.transporter().sendMail(mailOptions);
  }

  async sendVerifyEmail() {
    const html = pug.renderFile(
      `${__dirname}/../views/emails/verifyEmail.pug`,
      {
        name: this.name,
        url: this.url,
        subject: 'Verify Email',
      }
    );
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: 'Verify Email',
      html,
    };

    await this.transporter().sendMail(mailOptions);
  }

  async sendResetPassword() {
    const html = pug.renderFile(
      `${__dirname}/../views/emails/resetPassword.pug`,
      {
        name: this.name,
        url: this.url,
        subject: 'Reset Password',
      }
    );
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: 'Reset Password',
      html,
    };

    await this.transporter().sendMail(mailOptions);
  }

  async sendFlashSale() {
    const html = pug.renderFile(`${__dirname}/../views/emails/flashsale.pug`, {
      name: this.name,
      url: this.url,
      time: this.time,
      subject: 'Flash Sale Time',
    });
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: 'Flash Sale Time',
      html,
    };

    await this.transporter().sendMail(mailOptions);
  }
};
