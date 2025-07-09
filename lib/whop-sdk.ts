import { WhopServerSdk } from "@whop/api";

// Initialize Whop SDK with server-side configuration
export const whopSdk = WhopServerSdk({
  // This is the appId of your app from the Whop dashboard
  appId: process.env.WHOP_APP_ID,

  // Add your app api key here - required for server-side operations
  appApiKey: process.env.WHOP_API_KEY,

  // Agent user for making requests on behalf of the app
  onBehalfOfUserId: process.env.WHOP_AGENT_USER_ID,
});

// Export types for better TypeScript support
export type { AccessLevel } from "@whop/api";
