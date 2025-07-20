import nodemailer from 'nodemailer';

// Create transporter for sending emails
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'subiksham.23bir@kongu.edu',
      pass: process.env.EMAIL_PASS || 'nbrqepoqdxmumvdb'
    }
  });
};

// Generate OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
export const sendOTPEmail = async (email, otp, firstName) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'subiksham.23bir@kongu.edu',
      to: email,
      subject: 'Email Verification - GlowIt Organics',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 15px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 2rem;">GlowIt Organics</h1>
            <p style="margin: 10px 0; font-size: 1.1rem;">Email Verification</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${firstName}!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              Thank you for signing up with GlowIt Organics! To complete your registration, 
              please use the verification code below:
            </p>
            
            <div style="background: #667eea; color: white; padding: 20px; border-radius: 10px; text-align: center; margin: 25px 0;">
              <h1 style="margin: 0; font-size: 2.5rem; letter-spacing: 5px;">${otp}</h1>
              <p style="margin: 10px 0 0 0; font-size: 14px;">Your verification code</p>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 25px;">
              This code will expire in 10 minutes. If you didn't request this verification, 
              please ignore this email.
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                Best regards,<br>
                The GlowIt Organics Team
              </p>
            </div>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Send welcome email
export const sendWelcomeEmail = async (email, firstName) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'subiksham.23bir@kongu.edu',
      to: email,
      subject: 'Welcome to GlowIt Organics!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 15px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 2rem;">Welcome to GlowIt Organics!</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${firstName}!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              Welcome to GlowIt Organics! Your account has been successfully verified and you're now ready 
              to explore our natural collection of organic products.
            </p>
            
            <div style="background: #10b981; color: white; padding: 20px; border-radius: 10px; text-align: center; margin: 25px 0;">
              <h3 style="margin: 0;">🎉 Account Verified Successfully!</h3>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              You can now:
            </p>
            <ul style="color: #666; line-height: 1.6;">
              <li>Browse our natural products</li>
              <li>Add items to your cart</li>
              <li>Complete purchases</li>
              <li>Track your orders</li>
            </ul>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                Thank you for choosing GlowIt Organics!<br>
                The GlowIt Organics Team
              </p>
            </div>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully:', result.messageId);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
}; 