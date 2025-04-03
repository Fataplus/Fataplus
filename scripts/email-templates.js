// Script to set up email templates in PocketBase
import PocketBase from 'pocketbase';
import readline from 'readline';

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Configuration
const POCKETBASE_URL = 'https://backend.fata.plus';

// Email templates
const EMAIL_TEMPLATES = {
  verification: {
    subject: "Verify your FataPlus account",
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://fataplus.vercel.app/assets/logo.svg" alt="FataPlus Logo" style="width: 120px;">
        </div>
        <h1 style="color: #10b981; text-align: center;">Verify Your Email Address</h1>
        <p>Hello,</p>
        <p>Thank you for joining FataPlus, your all-in-one platform for agriculture in Madagascar!</p>
        <p>Please click the button below to verify your email address:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="{APP_URL}/_/#/auth/confirm-verification/{TOKEN}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Email</a>
        </div>
        <p>If you didn't create an account with us, you can safely ignore this email.</p>
        <p>Best regards,<br>The FataPlus Team</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666; font-size: 12px;">
          <p>© 2023 FataPlus. All rights reserved.</p>
        </div>
      </div>
    `
  },
  resetPassword: {
    subject: "Reset your FataPlus password",
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://fataplus.vercel.app/assets/logo.svg" alt="FataPlus Logo" style="width: 120px;">
        </div>
        <h1 style="color: #10b981; text-align: center;">Reset Your Password</h1>
        <p>Hello,</p>
        <p>We received a request to reset your password for your FataPlus account.</p>
        <p>Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="{APP_URL}/_/#/auth/confirm-password-reset/{TOKEN}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
        </div>
        <p>If you didn't request a password reset, you can safely ignore this email.</p>
        <p>Best regards,<br>The FataPlus Team</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666; font-size: 12px;">
          <p>© 2023 FataPlus. All rights reserved.</p>
        </div>
      </div>
    `
  },
  changeEmail: {
    subject: "Confirm your new FataPlus email address",
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://fataplus.vercel.app/assets/logo.svg" alt="FataPlus Logo" style="width: 120px;">
        </div>
        <h1 style="color: #10b981; text-align: center;">Confirm Your New Email</h1>
        <p>Hello,</p>
        <p>We received a request to change the email address associated with your FataPlus account.</p>
        <p>Click the button below to confirm your new email address:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="{APP_URL}/_/#/auth/confirm-email-change/{TOKEN}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Confirm New Email</a>
        </div>
        <p>If you didn't request this change, please contact our support team immediately.</p>
        <p>Best regards,<br>The FataPlus Team</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666; font-size: 12px;">
          <p>© 2023 FataPlus. All rights reserved.</p>
        </div>
      </div>
    `
  },
  orderConfirmation: {
    subject: "Your FataPlus Order Confirmation",
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://fataplus.vercel.app/assets/logo.svg" alt="FataPlus Logo" style="width: 120px;">
        </div>
        <h1 style="color: #10b981; text-align: center;">Order Confirmation</h1>
        <p>Hello {NAME},</p>
        <p>Thank you for your order! We're processing it now and will notify you when it ships.</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h2 style="color: #10b981; font-size: 18px; margin-top: 0;">Order Summary</h2>
          <p><strong>Order Number:</strong> {ORDER_ID}</p>
          <p><strong>Order Date:</strong> {ORDER_DATE}</p>
          <p><strong>Total Amount:</strong> ${ORDER_TOTAL}</p>
          <p><strong>Payment Method:</strong> {PAYMENT_METHOD}</p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="{APP_URL}/orders/{ORDER_ID}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Order Details</a>
        </div>
        <p>If you have any questions about your order, please contact our support team.</p>
        <p>Best regards,<br>The FataPlus Team</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666; font-size: 12px;">
          <p>© 2023 FataPlus. All rights reserved.</p>
        </div>
      </div>
    `
  },
  orderShipped: {
    subject: "Your FataPlus Order Has Shipped",
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://fataplus.vercel.app/assets/logo.svg" alt="FataPlus Logo" style="width: 120px;">
        </div>
        <h1 style="color: #10b981; text-align: center;">Your Order Has Shipped!</h1>
        <p>Hello {NAME},</p>
        <p>Great news! Your order is on its way to you.</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h2 style="color: #10b981; font-size: 18px; margin-top: 0;">Shipping Details</h2>
          <p><strong>Order Number:</strong> {ORDER_ID}</p>
          <p><strong>Shipping Date:</strong> {SHIP_DATE}</p>
          <p><strong>Estimated Delivery:</strong> {DELIVERY_DATE}</p>
          <p><strong>Tracking Number:</strong> {TRACKING_NUMBER}</p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="{APP_URL}/orders/{ORDER_ID}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Track Your Order</a>
        </div>
        <p>If you have any questions, please contact our support team.</p>
        <p>Best regards,<br>The FataPlus Team</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666; font-size: 12px;">
          <p>© 2023 FataPlus. All rights reserved.</p>
        </div>
      </div>
    `
  },
  welcomeEmail: {
    subject: "Welcome to FataPlus!",
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://fataplus.vercel.app/assets/logo.svg" alt="FataPlus Logo" style="width: 120px;">
        </div>
        <h1 style="color: #10b981; text-align: center;">Welcome to FataPlus!</h1>
        <p>Hello {NAME},</p>
        <p>Thank you for joining FataPlus, your all-in-one platform for agriculture in Madagascar!</p>
        <p>Here are some things you can do with your new account:</p>
        <ul style="margin-bottom: 20px;">
          <li>Browse and purchase agricultural products</li>
          <li>Take courses to improve your farming knowledge</li>
          <li>Connect with other farmers and experts</li>
          <li>Share your experiences and ask questions</li>
        </ul>
        <div style="text-align: center; margin: 30px 0;">
          <a href="{APP_URL}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Get Started</a>
        </div>
        <p>If you have any questions, our support team is always here to help.</p>
        <p>Best regards,<br>The FataPlus Team</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666; font-size: 12px;">
          <p>© 2023 FataPlus. All rights reserved.</p>
        </div>
      </div>
    `
  }
};

// Function to update email templates
const updateEmailTemplates = async () => {
  try {
    // Get admin credentials
    rl.question('Enter admin email: ', async (email) => {
      rl.question('Enter admin password: ', async (password) => {
        try {
          // Initialize PocketBase
          const pb = new PocketBase(POCKETBASE_URL);
          
          // Authenticate as admin
          console.log('Authenticating...');
          const authData = await pb.admins.authWithPassword(email, password);
          console.log('Authentication successful!');
          
          // Get the current settings
          console.log('Fetching current settings...');
          const settings = await pb.settings.getAll();
          
          // Update email templates
          console.log('Updating email templates...');
          
          // Update verification template
          settings.meta.emailTemplates.verification = {
            subject: EMAIL_TEMPLATES.verification.subject,
            body: EMAIL_TEMPLATES.verification.body,
            actionUrl: '{APP_URL}/_/#/auth/confirm-verification/{TOKEN}'
          };
          
          // Update password reset template
          settings.meta.emailTemplates.passwordReset = {
            subject: EMAIL_TEMPLATES.resetPassword.subject,
            body: EMAIL_TEMPLATES.resetPassword.body,
            actionUrl: '{APP_URL}/_/#/auth/confirm-password-reset/{TOKEN}'
          };
          
          // Update email change template
          settings.meta.emailTemplates.emailChange = {
            subject: EMAIL_TEMPLATES.changeEmail.subject,
            body: EMAIL_TEMPLATES.changeEmail.body,
            actionUrl: '{APP_URL}/_/#/auth/confirm-email-change/{TOKEN}'
          };
          
          // Save the updated settings
          console.log('Saving updated settings...');
          await pb.settings.update(settings);
          
          console.log('Email templates updated successfully!');
          
          // Create custom email templates for orders
          console.log('\nTo send custom emails for orders, you can use the following code in your application:');
          console.log(`
// Example code to send order confirmation email
const sendOrderConfirmationEmail = async (order, user) => {
  try {
    // Replace with your email service (SendGrid, Mailgun, etc.)
    const emailService = new EmailService();
    
    // Format the order date
    const orderDate = new Date(order.created).toLocaleDateString();
    
    // Replace template variables
    let emailBody = EMAIL_TEMPLATES.orderConfirmation.body
      .replace('{NAME}', user.name)
      .replace('{ORDER_ID}', order.id)
      .replace('{ORDER_DATE}', orderDate)
      .replace('{ORDER_TOTAL}', order.totalAmount.toFixed(2))
      .replace('{PAYMENT_METHOD}', order.paymentMethod)
      .replace('{APP_URL}', 'https://fataplus.vercel.app');
    
    // Send the email
    await emailService.send({
      to: user.email,
      subject: EMAIL_TEMPLATES.orderConfirmation.subject,
      html: emailBody
    });
    
    console.log('Order confirmation email sent successfully!');
    return true;
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return false;
  }
};
          `);
          
          rl.close();
        } catch (error) {
          console.error('Error:', error);
          rl.close();
        }
      });
    });
  } catch (error) {
    console.error('Error:', error);
    rl.close();
  }
};

// Run the script
updateEmailTemplates();
