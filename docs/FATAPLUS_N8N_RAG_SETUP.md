# Fataplus n8n RAG Setup Guide

## Overview

This guide shows how to set up Fataplus as a complete RAG (Retrieval-Augmented Generation) system using n8n for workflow orchestration.

## Architecture

```
Fataplus Data Sources → Vector Database → n8n Workflows → AI Models → Actions
```

### Data Sources

- ✅ Nuxt Content (Products, Courses, Articles, Guides, Knowledge, Legal, Stories)
- ✅ User Profiles (Farmers, Vendors, Admins)
- ✅ Marketplace Data
- ✅ Community Content
- ✅ Learning Progress
- ✅ Analytics & Usage

## n8n Workflow Setup

### 1. Data Ingestion Workflow

**Trigger:** Webhook or Schedule
**Steps:**

1. **HTTP Request** → Fetch Fataplus content via API
2. **Code Node** → Process and chunk content
3. **Vector Database** → Store embeddings (Pinecone/Weaviate/Qdrant)
4. **Webhook Response** → Confirm ingestion

```json
{
  "name": "Fataplus Data Ingestion",
  "nodes": [
    {
      "name": "Content Fetcher",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://fataplus.mg/api/content/all",
        "method": "GET"
      }
    },
    {
      "name": "Process Content",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "// Chunk content and prepare for vectorization"
      }
    },
    {
      "name": "Store Vectors",
      "type": "n8n-nodes-base.pinecone",
      "parameters": {
        "operation": "insert"
      }
    }
  ]
}
```

### 2. RAG Query Workflow

**Trigger:** Webhook (from Fataplus AI chat)
**Steps:**

1. **Webhook** → Receive user query
2. **Vector Search** → Find relevant content
3. **Context Builder** → Combine retrieved content
4. **AI Model** → Generate response with context
5. **Action Router** → Execute actions if needed
6. **Response** → Send back to Fataplus

```json
{
  "name": "Fataplus RAG Query",
  "nodes": [
    {
      "name": "Query Webhook",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "fataplus-rag"
      }
    },
    {
      "name": "Vector Search",
      "type": "n8n-nodes-base.pinecone",
      "parameters": {
        "operation": "query",
        "topK": 5
      }
    },
    {
      "name": "Build Context",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "// Combine search results into context"
      }
    },
    {
      "name": "AI Response",
      "type": "n8n-nodes-base.openAi",
      "parameters": {
        "model": "gpt-4",
        "systemMessage": "You are Fataplus AI assistant for Madagascar farmers"
      }
    },
    {
      "name": "Action Router",
      "type": "n8n-nodes-base.switch",
      "parameters": {
        "rules": [
          { "condition": "contains", "value": "create_product" },
          { "condition": "contains", "value": "enroll_course" },
          { "condition": "contains", "value": "find_farmers" }
        ]
      }
    }
  ]
}
```

### 3. Real-time Sync Workflow

**Trigger:** Fataplus webhooks
**Steps:**

1. **Webhook** → Content updated in Fataplus
2. **Delta Processing** → Process only changed content
3. **Vector Update** → Update embeddings
4. **Cache Invalidation** → Clear relevant caches

## Implementation Steps

### Step 1: Set up Vector Database

**Option A: Pinecone (Recommended)**

```bash
# Install Pinecone n8n node
npm install n8n-nodes-pinecone
```

**Option B: Weaviate (Self-hosted)**

```bash
# Docker setup
docker run -d \
  --name weaviate \
  -p 8080:8080 \
  -e QUERY_DEFAULTS_LIMIT=25 \
  -e AUTHENTICATION_ANONYMOUS_ACCESS_ENABLED=true \
  semitechnologies/weaviate:latest
```

### Step 2: Configure Fataplus API Endpoints

Add these endpoints to expose data for n8n:

```typescript
// server/api/n8n/content/all.get.ts
export default defineEventHandler(async (event) => {
  const { queryContent } = await useStorage("content");

  const [products, courses, articles, guides, knowledge, legal, stories] =
    await Promise.all([
      queryContent("products").find(),
      queryContent("courses").find(),
      queryContent("articles").find(),
      queryContent("guides").find(),
      queryContent("knowledge").find(),
      queryContent("legal").find(),
      queryContent("stories").find(),
    ]);

  return {
    products,
    courses,
    articles,
    guides,
    knowledge,
    legal,
    stories,
    timestamp: new Date().toISOString(),
  };
});
```

```typescript
// server/api/n8n/users/farmers.get.ts
export default defineEventHandler(async (event) => {
  const db = hubDatabase();

  const farmers = await db
    .select()
    .from(tables.users)
    .where(eq(tables.users.role, "farmer"))
    .leftJoin(
      tables.farmerProfiles,
      eq(tables.users.id, tables.farmerProfiles.userId)
    );

  return farmers.map((farmer) => ({
    id: farmer.users.id,
    name: farmer.users.name,
    region: farmer.farmer_profiles?.region,
    crops: farmer.farmer_profiles?.primaryCrops,
    farmSize: farmer.farmer_profiles?.farmSize,
    experience: farmer.farmer_profiles?.experience,
  }));
});
```

### Step 3: Create n8n Workflows

**Import these workflow templates:**

1. **Data Ingestion**: Runs daily to sync all Fataplus content
2. **RAG Query**: Handles real-time AI queries
3. **Content Sync**: Updates vectors when content changes
4. **User Action**: Executes actions based on AI responses

### Step 4: Configure AI Integration

**Update Fataplus AI to use n8n:**

```typescript
// composables/useAI.ts
export const useAI = () => {
  const query = async (message: string, context?: any) => {
    const response = await $fetch("/api/ai/n8n-query", {
      method: "POST",
      body: {
        message,
        context,
        userId: user.value?.id,
        timestamp: new Date().toISOString(),
      },
    });

    return response;
  };

  return { query };
};
```

```typescript
// server/api/ai/n8n-query.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // Send to n8n RAG workflow
  const response = await $fetch(
    "https://n8n.fataplus.mg/webhook/fataplus-rag",
    {
      method: "POST",
      body: {
        query: body.message,
        user_context: body.context,
        user_id: body.userId,
      },
    }
  );

  return response;
});
```

## n8n Configuration

### Environment Variables

```env
# n8n
N8N_HOST=n8n.fataplus.mg
N8N_PROTOCOL=https
N8N_PORT=443

# Vector Database
PINECONE_API_KEY=your_pinecone_key
PINECONE_INDEX=fataplus-rag

# AI Models
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key

# Fataplus
FATAPLUS_API_URL=https://fataplus.mg/api
FATAPLUS_WEBHOOK_SECRET=your_webhook_secret
```

### Workflow Templates

**1. Daily Content Sync**

- Trigger: Cron (daily at 2 AM Madagascar time)
- Fetch all Fataplus content
- Process and vectorize
- Update vector database

**2. Real-time RAG**

- Trigger: Webhook from Fataplus
- Vector similarity search
- Context assembly
- AI generation
- Response delivery

**3. Action Execution**

- Trigger: AI action requests
- Route to appropriate Fataplus API
- Execute action
- Confirm completion

## Benefits

### 🎯 **Complete Knowledge Base**

- Every Fataplus feature becomes searchable context
- Farmers get answers about products, courses, regulations
- AI knows about local farmers, crops, and conditions

### 🔄 **Real-time Updates**

- Content changes immediately available to AI
- User actions update the knowledge base
- Dynamic learning from community interactions

### 🛠 **Extensible Actions**

- AI can create products, enroll users in courses
- Schedule farmer meetings, send notifications
- Generate reports, update profiles

### 📊 **Analytics Integration**

- Track AI usage patterns
- Optimize content based on queries
- Improve farmer experience

## Next Steps

1. **Set up n8n instance** (Docker or cloud)
2. **Configure vector database** (Pinecone recommended)
3. **Create API endpoints** for data exposure
4. **Build n8n workflows** using templates
5. **Test RAG system** with sample queries
6. **Deploy and monitor** performance

This setup turns Fataplus into a comprehensive AI-powered agricultural assistant that knows everything about your platform and can take actions on behalf of users.
