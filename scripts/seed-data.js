// Script to seed PocketBase with sample data
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

// Sample data
const SAMPLE_DATA = {
  // Sample products
  products: [
    {
      name: 'Organic Rice (5kg)',
      price: 25.99,
      description: 'Premium organic rice grown in the highlands of Madagascar. Perfect for daily consumption with high nutritional value.',
      sellerName: 'Madagascar Organics',
      location: 'Antananarivo',
      category: 'grains'
    },
    {
      name: 'Fresh Vanilla Beans (100g)',
      price: 45.50,
      description: 'High-quality Madagascar vanilla beans, known for their exceptional flavor and aroma. Perfect for baking and cooking.',
      sellerName: 'Vanilla Exports',
      location: 'Toamasina',
      category: 'spices'
    },
    {
      name: 'Handcrafted Wooden Farming Tools Set',
      price: 120.00,
      description: 'Traditional wooden farming tools handcrafted by local artisans. Includes hoe, rake, and planting stick.',
      sellerName: 'Artisan Crafts',
      location: 'Fianarantsoa',
      category: 'tools'
    },
    {
      name: 'Organic Fertilizer (25kg)',
      price: 35.75,
      description: 'Natural organic fertilizer made from composted plant materials. Excellent for all types of crops.',
      sellerName: 'Green Growth',
      location: 'Mahajanga',
      category: 'fertilizers'
    },
    {
      name: 'Heirloom Tomato Seeds (50g)',
      price: 8.99,
      description: 'Rare heirloom tomato seeds adapted to Madagascar climate. Produces flavorful, juicy tomatoes.',
      sellerName: 'Seed Savers',
      location: 'Antsiranana',
      category: 'seeds'
    },
    {
      name: 'Solar-Powered Water Pump',
      price: 299.99,
      description: 'Efficient solar-powered water pump for small to medium farms. Easy to install and maintain.',
      sellerName: 'Solar Solutions',
      location: 'Toliara',
      category: 'equipment'
    },
    {
      name: 'Woven Storage Baskets (Set of 3)',
      price: 45.00,
      description: 'Handwoven storage baskets made from sustainable materials. Perfect for storing harvested produce.',
      sellerName: 'Weavers Collective',
      location: 'Antsirabe',
      category: 'storage'
    },
    {
      name: 'Organic Honey (1L)',
      price: 18.50,
      description: 'Pure, unfiltered honey from Madagascar forests. Collected using sustainable practices.',
      sellerName: 'Forest Honey',
      location: 'Moramanga',
      category: 'honey'
    }
  ],
  
  // Sample courses
  courses: [
    {
      title: 'Introduction to Sustainable Farming',
      description: 'Learn the basics of sustainable farming practices that improve soil health, conserve water, and increase biodiversity. This course covers fundamental concepts and practical techniques for small-scale farmers.',
      lessons: 8,
      category: 'sustainability'
    },
    {
      title: 'Organic Pest Management',
      description: 'Discover natural methods to control pests without harmful chemicals. This course teaches identification of common pests and diseases, preventive measures, and organic treatments.',
      lessons: 6,
      category: 'organic'
    },
    {
      title: 'Water Conservation Techniques',
      description: 'Master efficient water use in agriculture through rainwater harvesting, drip irrigation, and soil moisture management. Especially valuable for farming in drought-prone regions.',
      lessons: 5,
      category: 'water'
    },
    {
      title: 'Crop Rotation and Companion Planting',
      description: 'Maximize your yield and soil health through strategic crop rotation and companion planting. Learn which plants benefit each other and how to plan your growing seasons.',
      lessons: 7,
      category: 'techniques'
    },
    {
      title: 'Farm Business Management',
      description: 'Develop the business skills needed to run a profitable farm. Topics include budgeting, marketing, record-keeping, and creating value-added products.',
      lessons: 10,
      category: 'business'
    },
    {
      title: 'Climate-Smart Agriculture',
      description: 'Adapt your farming practices to changing climate conditions while reducing greenhouse gas emissions. Learn resilient farming methods for uncertain weather patterns.',
      lessons: 9,
      category: 'climate'
    }
  ],
  
  // Sample community posts
  posts: [
    {
      content: 'Just harvested my first crop of organic tomatoes using the techniques I learned from the sustainable farming course. The yield is amazing!',
      postType: 'general'
    },
    {
      content: 'Has anyone tried the new drought-resistant rice variety? I\'m considering it for next season but would like to hear some first-hand experiences.',
      postType: 'question'
    },
    {
      content: 'Selling freshly harvested vanilla beans at a special price this week. High quality and organically grown. Contact me for details!',
      postType: 'marketplace'
    },
    {
      content: 'I\'ve been experimenting with companion planting between maize and beans. The results are promising - both crops seem healthier than when planted separately.',
      postType: 'general'
    },
    {
      content: 'What\'s the best natural solution for controlling aphids on citrus trees? They\'re starting to damage my young trees.',
      postType: 'question'
    },
    {
      content: 'Looking for partners to establish a cooperative for exporting organic spices. If you\'re interested in joining, let\'s connect!',
      postType: 'marketplace'
    },
    {
      content: 'Just completed the water conservation course and implemented a rainwater harvesting system on my farm. It\'s already making a difference!',
      postType: 'general'
    },
    {
      content: 'Does anyone know where I can find affordable solar panels for powering irrigation pumps? The quotes I\'ve received seem very high.',
      postType: 'question'
    }
  ]
};

// Function to create a test user
const createTestUser = async (pb, email, password, name, userType, plan) => {
  try {
    console.log(`Creating test user: ${name} (${userType})...`);
    
    // Check if user already exists
    try {
      const users = await pb.collection('users').getList(1, 1, {
        filter: `email="${email}"`
      });
      
      if (users.items.length > 0) {
        console.log(`User ${email} already exists. Using existing user.`);
        return users.items[0];
      }
    } catch (error) {
      // Continue if error (likely means no users found)
    }
    
    // Create the user
    const user = await pb.collection('users').create({
      email,
      password,
      passwordConfirm: password,
      name,
      userType,
      plan
    });
    
    console.log(`User created: ${user.name} (${user.id})`);
    return user;
  } catch (error) {
    console.error(`Error creating user ${email}:`, error);
    throw error;
  }
};

// Function to seed products
const seedProducts = async (pb, sellerId, sellerName) => {
  try {
    console.log('Seeding products...');
    
    for (const product of SAMPLE_DATA.products) {
      try {
        // Check if product already exists
        const products = await pb.collection('products').getList(1, 1, {
          filter: `name="${product.name}" && seller="${sellerId}"`
        });
        
        if (products.items.length > 0) {
          console.log(`Product "${product.name}" already exists. Skipping...`);
          continue;
        }
        
        // Create the product
        const newProduct = await pb.collection('products').create({
          ...product,
          seller: sellerId,
          sellerName: sellerName
        });
        
        console.log(`Product created: ${newProduct.name}`);
      } catch (error) {
        console.error(`Error creating product "${product.name}":`, error);
      }
    }
    
    console.log('Products seeding completed!');
  } catch (error) {
    console.error('Error seeding products:', error);
  }
};

// Function to seed courses
const seedCourses = async (pb, adminId) => {
  try {
    console.log('Seeding courses...');
    
    for (const course of SAMPLE_DATA.courses) {
      try {
        // Check if course already exists
        const courses = await pb.collection('courses').getList(1, 1, {
          filter: `title="${course.title}"`
        });
        
        if (courses.items.length > 0) {
          console.log(`Course "${course.title}" already exists. Skipping...`);
          continue;
        }
        
        // Create the course
        const newCourse = await pb.collection('courses').create(course);
        
        console.log(`Course created: ${newCourse.title}`);
      } catch (error) {
        console.error(`Error creating course "${course.title}":`, error);
      }
    }
    
    console.log('Courses seeding completed!');
  } catch (error) {
    console.error('Error seeding courses:', error);
  }
};

// Function to seed community posts
const seedPosts = async (pb, authorId) => {
  try {
    console.log('Seeding community posts...');
    
    for (const post of SAMPLE_DATA.posts) {
      try {
        // Check if post already exists (approximate check)
        const posts = await pb.collection('posts').getList(1, 1, {
          filter: `author="${authorId}" && content="${post.content.substring(0, 50)}..."`
        });
        
        if (posts.items.length > 0) {
          console.log(`Similar post already exists. Skipping...`);
          continue;
        }
        
        // Create the post
        const newPost = await pb.collection('posts').create({
          ...post,
          author: authorId
        });
        
        console.log(`Post created: ${newPost.id}`);
      } catch (error) {
        console.error(`Error creating post:`, error);
      }
    }
    
    console.log('Community posts seeding completed!');
  } catch (error) {
    console.error('Error seeding posts:', error);
  }
};

// Main function to seed data
const seedData = async () => {
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
          
          // Create test users
          const adminUser = await createTestUser(
            pb,
            'admin@example.com',
            'Admin123!',
            'Admin User',
            'admin',
            'premium'
          );
          
          const farmerUser = await createTestUser(
            pb,
            'farmer@example.com',
            'Farmer123!',
            'Farmer User',
            'farmer',
            'free'
          );
          
          const sellerUser = await createTestUser(
            pb,
            'seller@example.com',
            'Seller123!',
            'Seller User',
            'seller',
            'premium'
          );
          
          const learnerUser = await createTestUser(
            pb,
            'learner@example.com',
            'Learner123!',
            'Learner User',
            'learner',
            'free'
          );
          
          // Seed products (as seller)
          await seedProducts(pb, sellerUser.id, sellerUser.name);
          
          // Seed courses (as admin)
          await seedCourses(pb, adminUser.id);
          
          // Seed community posts (as farmer)
          await seedPosts(pb, farmerUser.id);
          
          console.log('\nData seeding completed successfully!');
          console.log('\nTest users created:');
          console.log('- Admin: admin@example.com / Admin123!');
          console.log('- Farmer: farmer@example.com / Farmer123!');
          console.log('- Seller: seller@example.com / Seller123!');
          console.log('- Learner: learner@example.com / Learner123!');
          
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
seedData();
