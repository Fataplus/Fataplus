// Script to set up Stripe integration with PocketBase
import PocketBase from 'pocketbase';
import readline from 'readline';
import fs from 'fs';
import path from 'path';

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Configuration
const POCKETBASE_URL = 'https://backend.fata.plus';

// Function to create Stripe integration files
const createStripeIntegrationFiles = async () => {
  try {
    // Create the hooks directory if it doesn't exist
    const hooksDir = path.join(process.cwd(), 'pb_hooks');
    if (!fs.existsSync(hooksDir)) {
      fs.mkdirSync(hooksDir, { recursive: true });
    }
    
    // Create the Stripe integration file
    const stripeIntegrationPath = path.join(hooksDir, 'stripe.js');
    
    const stripeIntegrationCode = `
// Stripe integration for PocketBase
// This file should be placed in the pb_hooks directory of your PocketBase instance

// Import required modules
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Initialize the app
onEvent('app.before', () => {
    // Register custom API endpoints for Stripe
    routerAdd('POST', '/api/stripe/create-payment-intent', createPaymentIntent, { authRequired: true });
    routerAdd('POST', '/api/stripe/webhook', stripeWebhook, {});
    
    console.log('Stripe integration initialized');
});

// Create a payment intent
async function createPaymentIntent(c) {
    try {
        // Get the authenticated user
        const user = c.get('authRecord');
        
        // Get request data
        const data = $apis.requestInfo(c).data;
        
        if (!data.amount || !data.currency || !data.orderId) {
            return c.json(400, {
                success: false,
                message: 'Missing required fields: amount, currency, orderId'
            });
        }
        
        // Create a payment intent with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(data.amount * 100), // Convert to cents
            currency: data.currency,
            metadata: {
                userId: user.id,
                orderId: data.orderId
            }
        });
        
        // Return the client secret to the client
        return c.json(200, {
            success: true,
            clientSecret: paymentIntent.client_secret
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        return c.json(500, {
            success: false,
            message: error.message
        });
    }
}

// Handle Stripe webhooks
async function stripeWebhook(c) {
    try {
        // Get the webhook signature
        const signature = $apis.requestInfo(c).headers['stripe-signature'];
        
        // Get the raw request body
        const rawBody = await $apis.requestInfo(c).rawData;
        
        // Verify the webhook signature
        let event;
        try {
            event = stripe.webhooks.constructEvent(
                rawBody,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET
            );
        } catch (error) {
            console.error('Webhook signature verification failed:', error);
            return c.json(400, {
                success: false,
                message: 'Webhook signature verification failed'
            });
        }
        
        // Handle the event
        switch (event.type) {
            case 'payment_intent.succeeded':
                await handlePaymentIntentSucceeded(event.data.object);
                break;
            case 'payment_intent.payment_failed':
                await handlePaymentIntentFailed(event.data.object);
                break;
            default:
                console.log('Unhandled event type:', event.type);
        }
        
        // Return a success response
        return c.json(200, {
            success: true,
            message: 'Webhook received'
        });
    } catch (error) {
        console.error('Error handling webhook:', error);
        return c.json(500, {
            success: false,
            message: error.message
        });
    }
}

// Handle successful payment
async function handlePaymentIntentSucceeded(paymentIntent) {
    try {
        // Get the order ID from the metadata
        const orderId = paymentIntent.metadata.orderId;
        
        // Update the order status in the database
        const order = await $app.dao().findRecordById('orders', orderId);
        
        if (order) {
            order.set('status', 'processing');
            order.set('paymentId', paymentIntent.id);
            await $app.dao().saveRecord(order);
            
            // Get the user
            const userId = paymentIntent.metadata.userId;
            const user = await $app.dao().findRecordById('users', userId);
            
            // Send order confirmation email
            if (user) {
                await sendOrderConfirmationEmail(order, user);
            }
            
            console.log('Order updated successfully:', orderId);
        } else {
            console.error('Order not found:', orderId);
        }
    } catch (error) {
        console.error('Error handling payment success:', error);
    }
}

// Handle failed payment
async function handlePaymentIntentFailed(paymentIntent) {
    try {
        // Get the order ID from the metadata
        const orderId = paymentIntent.metadata.orderId;
        
        // Update the order status in the database
        const order = await $app.dao().findRecordById('orders', orderId);
        
        if (order) {
            order.set('status', 'payment_failed');
            order.set('paymentId', paymentIntent.id);
            await $app.dao().saveRecord(order);
            
            console.log('Order marked as payment failed:', orderId);
        } else {
            console.error('Order not found:', orderId);
        }
    } catch (error) {
        console.error('Error handling payment failure:', error);
    }
}

// Send order confirmation email
async function sendOrderConfirmationEmail(order, user) {
    try {
        // Format the order date
        const orderDate = new Date(order.created).toLocaleDateString();
        
        // Get order items
        const items = JSON.parse(order.get('items'));
        
        // Create email content
        const subject = 'Your FataPlus Order Confirmation';
        let body = \`
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <img src="https://fataplus.vercel.app/assets/logo.svg" alt="FataPlus Logo" style="width: 120px;">
                </div>
                <h1 style="color: #10b981; text-align: center;">Order Confirmation</h1>
                <p>Hello \${user.get('name')},</p>
                <p>Thank you for your order! We're processing it now and will notify you when it ships.</p>
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h2 style="color: #10b981; font-size: 18px; margin-top: 0;">Order Summary</h2>
                    <p><strong>Order Number:</strong> \${order.id}</p>
                    <p><strong>Order Date:</strong> \${orderDate}</p>
                    <p><strong>Total Amount:</strong> $\${order.get('totalAmount').toFixed(2)}</p>
                    <p><strong>Payment Method:</strong> Credit Card</p>
                </div>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://fataplus.vercel.app/orders/\${order.id}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Order Details</a>
                </div>
                <p>If you have any questions about your order, please contact our support team.</p>
                <p>Best regards,<br>The FataPlus Team</p>
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666; font-size: 12px;">
                    <p>© 2023 FataPlus. All rights reserved.</p>
                </div>
            </div>
        \`;
        
        // Send the email
        await $app.newMailClient().send(
            user.get('email'),
            subject,
            body,
            { html: true }
        );
        
        console.log('Order confirmation email sent successfully!');
    } catch (error) {
        console.error('Error sending order confirmation email:', error);
    }
}
    `;
    
    fs.writeFileSync(stripeIntegrationPath, stripeIntegrationCode);
    console.log(`Stripe integration file created at: ${stripeIntegrationPath}`);
    
    // Create the .env file with Stripe configuration
    const envPath = path.join(process.cwd(), '.env');
    
    rl.question('Enter your Stripe Secret Key: ', (stripeSecretKey) => {
      rl.question('Enter your Stripe Webhook Secret: ', (stripeWebhookSecret) => {
        const envContent = `
# Stripe Configuration
STRIPE_SECRET_KEY=${stripeSecretKey}
STRIPE_WEBHOOK_SECRET=${stripeWebhookSecret}
        `;
        
        fs.writeFileSync(envPath, envContent);
        console.log(`Environment file created at: ${envPath}`);
        
        // Create the client-side integration file
        const clientIntegrationPath = path.join(process.cwd(), 'src', 'services', 'stripeService.ts');
        
        // Ensure the directory exists
        const clientDir = path.join(process.cwd(), 'src', 'services');
        if (!fs.existsSync(clientDir)) {
          fs.mkdirSync(clientDir, { recursive: true });
        }
        
        rl.question('Enter your Stripe Publishable Key: ', (stripePublishableKey) => {
          const clientIntegrationCode = `
// Stripe integration service for the client
import { loadStripe } from '@stripe/stripe-js';
import { pb } from '@/integrations/pocketbase/client';

// Initialize Stripe
const stripePromise = loadStripe('${stripePublishableKey}');

// Types
export interface PaymentIntentRequest {
  amount: number;
  currency: string;
  orderId: string;
}

export interface PaymentIntentResponse {
  success: boolean;
  clientSecret?: string;
  message?: string;
}

/**
 * Create a payment intent with Stripe
 * @param data Payment intent request data
 * @returns Payment intent response
 */
export const createPaymentIntent = async (data: PaymentIntentRequest): Promise<PaymentIntentResponse> => {
  try {
    const response = await fetch(\`\${pb.baseUrl}/api/stripe/create-payment-intent\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': pb.authStore.token
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create payment intent');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create payment intent'
    };
  }
};

/**
 * Process a payment with Stripe
 * @param clientSecret The client secret from the payment intent
 * @param paymentMethod The payment method to use
 * @returns Payment result
 */
export const processPayment = async (clientSecret: string, paymentMethod: any) => {
  try {
    const stripe = await stripePromise;
    
    if (!stripe) {
      throw new Error('Stripe failed to initialize');
    }
    
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod
    });
    
    if (result.error) {
      throw new Error(result.error.message);
    }
    
    return {
      success: true,
      paymentIntent: result.paymentIntent
    };
  } catch (error) {
    console.error('Error processing payment:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to process payment'
    };
  }
};

/**
 * Get Stripe instance
 * @returns Stripe instance
 */
export const getStripe = async () => {
  return await stripePromise;
};
          `;
          
          fs.writeFileSync(clientIntegrationPath, clientIntegrationCode);
          console.log(`Client-side integration file created at: ${clientIntegrationPath}`);
          
          console.log('\nStripe integration setup completed!');
          console.log('\nNext steps:');
          console.log('1. Install the required packages:');
          console.log('   npm install stripe @stripe/stripe-js @stripe/react-stripe-js');
          console.log('2. Copy the pb_hooks/stripe.js file to your PocketBase server');
          console.log('3. Set up the environment variables on your PocketBase server');
          console.log('4. Update your checkout page to use the Stripe integration');
          console.log('5. Test the integration with Stripe test mode');
          
          rl.close();
        });
      });
    });
  } catch (error) {
    console.error('Error creating Stripe integration files:', error);
    rl.close();
  }
};

// Main function
const setupStripeIntegration = async () => {
  try {
    console.log('Setting up Stripe integration for PocketBase...');
    
    // Create Stripe integration files
    await createStripeIntegrationFiles();
  } catch (error) {
    console.error('Error setting up Stripe integration:', error);
    rl.close();
  }
};

// Run the script
setupStripeIntegration();
