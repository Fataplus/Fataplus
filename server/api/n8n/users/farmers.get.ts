/*
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  try {
    const db = hubDatabase();

    // Get farmers with their profiles
    const farmers = await db
      .select({
        id: tables.users.id,
        name: tables.users.name,
        email: tables.users.email,
        role: tables.users.role,
        createdAt: tables.users.createdAt,
        region: tables.farmerProfiles.region,
        primaryCrops: tables.farmerProfiles.primaryCrops,
        farmSize: tables.farmerProfiles.farmSize,
        experience: tables.farmerProfiles.experience,
        farmingMethods: tables.farmerProfiles.farmingMethods,
        challenges: tables.farmerProfiles.challenges,
        goals: tables.farmerProfiles.goals,
        contactPreference: tables.farmerProfiles.contactPreference,
      })
      .from(tables.users)
      .where(eq(tables.users.role, "farmer"))
      .leftJoin(
        tables.farmerProfiles,
        eq(tables.users.id, tables.farmerProfiles.userId)
      );

    // Format for RAG system
    const farmerData = farmers.map((farmer) => ({
      id: farmer.id,
      type: "farmer_profile",
      title: `Farmer: ${farmer.name} from ${farmer.region || "Madagascar"}`,
      content: `
        Farmer Profile:
        Name: ${farmer.name}
        Region: ${farmer.region || "Not specified"}
        Primary Crops: ${farmer.primaryCrops?.join(", ") || "Not specified"}
        Farm Size: ${farmer.farmSize || "Not specified"}
        Experience: ${farmer.experience || "Not specified"}
        Farming Methods: ${farmer.farmingMethods?.join(", ") || "Not specified"}
        Challenges: ${farmer.challenges?.join(", ") || "Not specified"}
        Goals: ${farmer.goals?.join(", ") || "Not specified"}
        Contact Preference: ${farmer.contactPreference || "Not specified"}
        Member since: ${farmer.createdAt ? new Date(farmer.createdAt).toLocaleDateString() : "Unknown"}
      `.trim(),
      metadata: {
        userId: farmer.id,
        region: farmer.region,
        crops: farmer.primaryCrops,
        farmSize: farmer.farmSize,
        experience: farmer.experience,
        farmingMethods: farmer.farmingMethods,
        challenges: farmer.challenges,
        goals: farmer.goals,
        contactPreference: farmer.contactPreference,
        memberSince: farmer.createdAt,
      },
    }));

    return {
      success: true,
      data: farmerData,
      timestamp: new Date().toISOString(),
      totalFarmers: farmerData.length,
      summary: {
        totalFarmers: farmerData.length,
        regions: [...new Set(farmers.map((f) => f.region).filter(Boolean))],
        crops: [...new Set(farmers.flatMap((f) => f.primaryCrops || []))],
        farmSizes: [...new Set(farmers.map((f) => f.farmSize).filter(Boolean))],
        experienceLevels: [
          ...new Set(farmers.map((f) => f.experience).filter(Boolean)),
        ],
      },
    };
  } catch (error) {
    console.error("Error fetching farmers for n8n:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch farmer data for RAG ingestion",
    });
  }
});
*/
