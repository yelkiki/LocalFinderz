import nodemailer from 'nodemailer';


export async function sendEmail(dest, html, attachments = []) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.nodemailerEmail,
      pass: process.env.NODEMAILER,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // Send mail with the defined transport object
  let info = await transporter.sendMail({
    from: `${process.env.nodemailerEmail}`,
    to: dest,
    subject: "Reset Password Request",
    html: html, // Use the HTML template here
    attachments,
  });
  
  return info;
}
