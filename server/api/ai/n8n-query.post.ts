export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // Validate required fields
    if (!body.message) {
      throw createError({
        statusCode: 400,
        statusMessage: "Message is required",
      });
    }

    // Get user context from headers or body
    const userId = body.userId || getCookie(event, "user-id");

    // Prepare context for n8n RAG workflow
    const payload = {
      query: body.message,
      user_context: {
        userId,
        timestamp: new Date().toISOString(),
        ...body.context,
      },
      metadata: {
        source: "fataplus-ai",
        version: "1.0",
        requestId: crypto.randomUUID(),
      },
    };

    // Send to n8n RAG workflow
    const n8nWebhookUrl =
      process.env.N8N_WEBHOOK_URL ||
      "https://n8n.fataplus.mg/webhook/fataplus-rag";

    const response = await $fetch(n8nWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.N8N_API_KEY || ""}`,
        "X-Fataplus-Source": "ai-assistant",
      },
      body: payload,
      timeout: 30000, // 30 second timeout
    });

    return {
      success: true,
      response: response.answer || response.message || response,
      actions: response.actions || [],
      context: response.context || {},
      metadata: {
        requestId: payload.metadata.requestId,
        timestamp: new Date().toISOString(),
        processingTime: response.processingTime || null,
      },
    };
  } catch (error) {
    console.error("Error in n8n RAG query:", error);

    // Fallback to local AI if n8n is unavailable
    if (error.statusCode === 503 || error.code === "ECONNREFUSED") {
      console.log("n8n unavailable, falling back to local AI");

      // Import local AI function as fallback
      const { generateAIResponse } = await import("~/shared/utils/ai");

      const fallbackResponse = await generateAIResponse(body.message, {
        context: "Fataplus agricultural assistant for Madagascar farmers",
        userId: body.userId,
      });

      return {
        success: true,
        response: fallbackResponse,
        fallback: true,
        metadata: {
          timestamp: new Date().toISOString(),
          source: "local-fallback",
        },
      };
    }

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Failed to process AI query",
    });
  }
});
