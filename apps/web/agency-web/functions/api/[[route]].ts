import { Hono } from 'hono';
import { handle } from 'hono/cloudflare-pages';

const app = new Hono().basePath('/api');

app.get('/', (c) => c.text('Fata Plus API is running!'));

app.post('/contact', async (c) => {
  try {
    const body = await c.req.json();
    // TODO: Add logic to send WhatsApp message and/or store in KV/D1
    console.log('Form submission received:', body);

    return c.json({
      success: true,
      message: 'Message received successfully!',
      data: body
    });
  } catch (err) {
    return c.json({
      success: false,
      message: 'Error processing request',
      error: err.message
    }, 400);
  }
});

export const onRequest = handle(app);
