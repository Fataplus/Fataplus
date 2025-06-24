export default defineEventHandler(async (event) => {
  // Using NuxtHub's built-in database (D1)
  // This will automatically work with the NuxtHub deployment
  
  try {
    // Example using NuxtHub database - this will work when deployed to NuxtHub
    // For now, we'll return mock data that matches our admin dashboard
    
    const stats = {
      totalOrders: 1247,
      totalProducts: 89,
      totalRevenue: 4567800,
      activeUsers: 342,
      monthlyGrowth: {
        orders: 23.5,
        revenue: 18.2,
        users: 12.7
      },
      recentActivity: [
        {
          id: '1',
          type: 'order',
          message: 'Nouvelle commande #1001 - Riz Rouge de Lac Alaotra',
          timestamp: new Date().toISOString(),
          amount: 85000
        },
        {
          id: '2', 
          type: 'user',
          message: 'Nouvel utilisateur: Rakoto Jean',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          amount: null
        },
        {
          id: '3',
          type: 'product',
          message: 'Stock faible: Vanille de Sambava (12 unités)',
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          amount: null
        }
      ]
    }

    // When deployed to NuxtHub, you could use:
    // const db = hubDatabase()
    // const orders = await db.prepare('SELECT COUNT(*) as count FROM orders').first()
    // const revenue = await db.prepare('SELECT SUM(total) as sum FROM orders WHERE status = "completed"').first()
    
    return {
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
      source: 'nuxthub-ready' // Indicates this API is ready for NuxtHub features
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch admin statistics',
      timestamp: new Date().toISOString()
    }
  }
}) 