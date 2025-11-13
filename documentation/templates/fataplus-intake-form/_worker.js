// Cloudflare Worker for form processing
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    // API Routes
    if (url.pathname.startsWith('/api/')) {
      return handleAPI(request, env, corsHeaders);
    }

    // Serve static files (fallback to Pages)
    return env.ASSETS.fetch(request);
  }
};

async function handleAPI(request, env, corsHeaders) {
  const url = new URL(request.url);

  try {
    switch (url.pathname) {
      case '/api/submit':
        return handleSubmit(request, env, corsHeaders);
      case '/api/validate':
        return handleValidate(request, env, corsHeaders);
      default:
        return new Response(JSON.stringify({ error: 'Not Found' }), {
          status: 404,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        });
    }
  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  }
}

async function handleSubmit(request, env, corsHeaders) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const formData = await request.json();

    // Validate required fields
    const requiredFields = ['projectTitle', 'contactName', 'contactEmail', 'consent'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      return new Response(JSON.stringify({
        error: 'Missing required fields',
        missing: missingFields
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }

    // Generate unique project ID
    const projectId = `FP-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

    // Store submission data (you can use KV, D1, or external service)
    const submissionData = {
      id: projectId,
      ...formData,
      timestamp: new Date().toISOString(),
      status: 'submitted'
    };

    // Store in KV (if configured)
    if (.env.FORM_SUBMISSIONS) {
      await env.FORM_SUBMISSIONS.put(projectId, JSON.stringify(submissionData));
    }

    // Send email notification (if configured)
    if (env.EMAIL_SERVICE && env.NOTIFICATION_EMAIL) {
      await sendNotificationEmail(submissionData, env);
    }

    // Return success response
    return new Response(JSON.stringify({
      success: true,
      projectId,
      message: 'Form submitted successfully'
    }), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Submit Error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to process submission',
      details: error.message
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  }
}

async function handleValidate(request, env, corsHeaders) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const { field, value } = await request.json();

    let isValid = true;
    let message = '';

    // Validation rules
    switch (field) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(value);
        message = isValid ? 'Valid email' : 'Invalid email format';
        break;

      case 'phone':
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        isValid = !value || phoneRegex.test(value);
        message = isValid ? 'Valid phone' : 'Invalid phone format';
        break;

      case 'projectTitle':
        isValid = value.length >= 3 && value.length <= 100;
        message = isValid ? 'Valid title' : 'Title must be 3-100 characters';
        break;

      default:
        isValid = value.trim().length > 0;
        message = isValid ? 'Valid' : 'This field is required';
    }

    return new Response(JSON.stringify({
      isValid,
      message
    }), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Validate Error:', error);
    return new Response(JSON.stringify({
      error: 'Validation failed',
      details: error.message
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  }
}

async function sendNotificationEmail(submissionData, env) {
  // Email notification template
  const emailBody = `
Nouveau projet soumis - Fataplus SARLU

Détails du projet:
- Projet ID: ${submissionData.id}
- Titre: ${submissionData.projectTitle}
- Client: ${submissionData.companyName}
- Contact: ${submissionData.contactName} (${submissionData.contactEmail})
- Téléphone: ${submissionData.contactPhone || 'Non spécifié'}
- Budget: ${submissionData.budget}
- Délai: ${submissionData.timeline}
- Type: ${submissionData.projectTypes?.join(', ') || 'Non spécifié'}

Description:
${submissionData.problemStatement}

Solution proposée:
${submissionData.solutionVision}

Soumis le: ${new Date(submissionData.timestamp).toLocaleString('fr-FR')}

---
Formulaire d'Intake Fataplus
  `.trim();

  // Send email using your preferred email service
  // This is a placeholder - implement with your actual email service
  console.log('Email notification:', emailBody);
}