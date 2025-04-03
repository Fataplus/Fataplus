// PocketBase Data Validation Hooks
// This file should be placed in the pb_hooks directory of your PocketBase instance

// Initialize the app
onEvent('app.before', () => {
  console.log('Initializing data validation hooks...');
  
  // Register validation hooks for collections
  registerUserValidationHooks();
  registerProductValidationHooks();
  registerOrderValidationHooks();
  registerPostValidationHooks();
  
  console.log('Data validation hooks initialized');
});

// User validation hooks
function registerUserValidationHooks() {
  // Before create validation
  onRecordBeforeCreateRequest((e) => {
    if (e.collection.name !== 'users') {
      return;
    }
    
    const record = e.record;
    
    // Validate email format
    if (record.email) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(record.email)) {
        throw new Error('Invalid email format');
      }
    }
    
    // Validate password strength
    if (record.password) {
      // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(record.password)) {
        throw new Error('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character');
      }
    }
    
    // Validate user type
    if (record.userType) {
      const validUserTypes = ['farmer', 'seller', 'learner', 'admin'];
      if (!validUserTypes.includes(record.userType)) {
        throw new Error('Invalid user type. Must be one of: farmer, seller, learner, admin');
      }
    }
    
    // Initialize user preferences if not set
    if (!record.preferences) {
      record.set('preferences', JSON.stringify({
        notifications: true,
        darkMode: false,
        language: 'en',
        emailFrequency: 'daily'
      }));
    }
  });
  
  // Before update validation
  onRecordBeforeUpdateRequest((e) => {
    if (e.collection.name !== 'users') {
      return;
    }
    
    const record = e.record;
    
    // Validate email format if changed
    if (record.email && e.isChanged('email')) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(record.email)) {
        throw new Error('Invalid email format');
      }
    }
    
    // Validate password strength if changed
    if (record.password && e.isChanged('password')) {
      // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(record.password)) {
        throw new Error('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character');
      }
    }
    
    // Validate user type if changed
    if (record.userType && e.isChanged('userType')) {
      const validUserTypes = ['farmer', 'seller', 'learner', 'admin'];
      if (!validUserTypes.includes(record.userType)) {
        throw new Error('Invalid user type. Must be one of: farmer, seller, learner, admin');
      }
    }
    
    // Validate preferences format if changed
    if (e.isChanged('preferences')) {
      try {
        const preferences = JSON.parse(record.preferences);
        
        // Ensure required preferences fields
        const requiredFields = ['notifications', 'darkMode', 'language'];
        for (const field of requiredFields) {
          if (preferences[field] === undefined) {
            throw new Error(`Missing required preference field: ${field}`);
          }
        }
        
        // Validate language
        const validLanguages = ['en', 'fr', 'mg'];
        if (preferences.language && !validLanguages.includes(preferences.language)) {
          throw new Error(`Invalid language. Must be one of: ${validLanguages.join(', ')}`);
        }
      } catch (error) {
        throw new Error(`Invalid preferences format: ${error.message}`);
      }
    }
  });
}

// Product validation hooks
function registerProductValidationHooks() {
  // Before create validation
  onRecordBeforeCreateRequest((e) => {
    if (e.collection.name !== 'products') {
      return;
    }
    
    const record = e.record;
    
    // Validate required fields
    const requiredFields = ['name', 'price', 'seller', 'sellerName', 'location', 'category'];
    for (const field of requiredFields) {
      if (!record.get(field)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    
    // Validate price
    const price = parseFloat(record.price);
    if (isNaN(price) || price <= 0) {
      throw new Error('Price must be a positive number');
    }
    
    // Validate category
    const validCategories = [
      'grains', 'vegetables', 'fruits', 'spices', 'seeds', 
      'tools', 'equipment', 'fertilizers', 'pesticides', 'other'
    ];
    if (!validCategories.includes(record.category)) {
      throw new Error(`Invalid category. Must be one of: ${validCategories.join(', ')}`);
    }
    
    // Set creation date if not set
    if (!record.get('created')) {
      record.set('created', new Date().toISOString());
    }
  });
  
  // Before update validation
  onRecordBeforeUpdateRequest((e) => {
    if (e.collection.name !== 'products') {
      return;
    }
    
    const record = e.record;
    
    // Validate price if changed
    if (e.isChanged('price')) {
      const price = parseFloat(record.price);
      if (isNaN(price) || price <= 0) {
        throw new Error('Price must be a positive number');
      }
    }
    
    // Validate category if changed
    if (e.isChanged('category')) {
      const validCategories = [
        'grains', 'vegetables', 'fruits', 'spices', 'seeds', 
        'tools', 'equipment', 'fertilizers', 'pesticides', 'other'
      ];
      if (!validCategories.includes(record.category)) {
        throw new Error(`Invalid category. Must be one of: ${validCategories.join(', ')}`);
      }
    }
    
    // Set updated date
    record.set('updated', new Date().toISOString());
  });
}

// Order validation hooks
function registerOrderValidationHooks() {
  // Before create validation
  onRecordBeforeCreateRequest((e) => {
    if (e.collection.name !== 'orders') {
      return;
    }
    
    const record = e.record;
    
    // Validate required fields
    const requiredFields = ['user', 'items', 'totalAmount', 'status', 'paymentMethod', 'shippingAddress'];
    for (const field of requiredFields) {
      if (!record.get(field)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    
    // Validate total amount
    const totalAmount = parseFloat(record.totalAmount);
    if (isNaN(totalAmount) || totalAmount <= 0) {
      throw new Error('Total amount must be a positive number');
    }
    
    // Validate status
    const validStatuses = ['pending', 'processing', 'completed', 'cancelled', 'refunded'];
    if (!validStatuses.includes(record.status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }
    
    // Validate payment method
    const validPaymentMethods = ['credit_card', 'mobile_money', 'cash_on_delivery', 'bank_transfer'];
    if (!validPaymentMethods.includes(record.paymentMethod)) {
      throw new Error(`Invalid payment method. Must be one of: ${validPaymentMethods.join(', ')}`);
    }
    
    // Validate items format
    try {
      const items = JSON.parse(record.items);
      
      if (!Array.isArray(items) || items.length === 0) {
        throw new Error('Items must be a non-empty array');
      }
      
      // Validate each item
      for (const item of items) {
        if (!item.product || !item.product.id || !item.product.name || !item.product.price || !item.quantity) {
          throw new Error('Invalid item format');
        }
        
        if (isNaN(parseFloat(item.product.price)) || parseFloat(item.product.price) <= 0) {
          throw new Error('Item price must be a positive number');
        }
        
        if (isNaN(parseInt(item.quantity)) || parseInt(item.quantity) <= 0) {
          throw new Error('Item quantity must be a positive integer');
        }
      }
      
      // Validate total amount matches sum of items
      const calculatedTotal = items.reduce((sum, item) => {
        return sum + (parseFloat(item.product.price) * parseInt(item.quantity));
      }, 0);
      
      if (Math.abs(calculatedTotal - totalAmount) > 0.01) {
        throw new Error(`Total amount (${totalAmount}) does not match sum of items (${calculatedTotal})`);
      }
    } catch (error) {
      throw new Error(`Invalid items format: ${error.message}`);
    }
    
    // Validate shipping address format
    try {
      const shippingAddress = JSON.parse(record.shippingAddress);
      
      const requiredAddressFields = ['fullName', 'street', 'city', 'region', 'phone'];
      for (const field of requiredAddressFields) {
        if (!shippingAddress[field]) {
          throw new Error(`Missing required shipping address field: ${field}`);
        }
      }
    } catch (error) {
      throw new Error(`Invalid shipping address format: ${error.message}`);
    }
  });
  
  // Before update validation
  onRecordBeforeUpdateRequest((e) => {
    if (e.collection.name !== 'orders') {
      return;
    }
    
    const record = e.record;
    
    // Validate status if changed
    if (e.isChanged('status')) {
      const validStatuses = ['pending', 'processing', 'completed', 'cancelled', 'refunded'];
      if (!validStatuses.includes(record.status)) {
        throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
      }
      
      // Validate status transitions
      const oldStatus = e.oldRecord.get('status');
      
      // Prevent changing status of completed orders
      if (oldStatus === 'completed' && record.status !== 'completed' && record.status !== 'refunded') {
        throw new Error('Cannot change status of completed orders except to refunded');
      }
      
      // Prevent changing status of cancelled orders
      if (oldStatus === 'cancelled' && record.status !== 'cancelled') {
        throw new Error('Cannot change status of cancelled orders');
      }
      
      // Prevent changing status of refunded orders
      if (oldStatus === 'refunded' && record.status !== 'refunded') {
        throw new Error('Cannot change status of refunded orders');
      }
      
      // Set status change date
      record.set('statusChangedAt', new Date().toISOString());
    }
  });
  
  // After create hook - send order confirmation email
  onRecordAfterCreateRequest((e) => {
    if (e.collection.name !== 'orders') {
      return;
    }
    
    // Send order confirmation email
    try {
      const record = e.record;
      const userId = record.get('user');
      
      // Get user
      const user = $app.dao().findRecordById('users', userId);
      
      if (user) {
        // Format the order date
        const orderDate = new Date(record.get('created')).toLocaleDateString();
        
        // Create email content
        const subject = 'Your FataPlus Order Confirmation';
        let body = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="https://fataplus.vercel.app/assets/logo.svg" alt="FataPlus Logo" style="width: 120px;">
            </div>
            <h1 style="color: #10b981; text-align: center;">Order Confirmation</h1>
            <p>Hello ${user.get('name')},</p>
            <p>Thank you for your order! We're processing it now and will notify you when it ships.</p>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h2 style="color: #10b981; font-size: 18px; margin-top: 0;">Order Summary</h2>
              <p><strong>Order Number:</strong> ${record.id}</p>
              <p><strong>Order Date:</strong> ${orderDate}</p>
              <p><strong>Total Amount:</strong> $${record.get('totalAmount').toFixed(2)}</p>
              <p><strong>Payment Method:</strong> ${record.get('paymentMethod')}</p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://fataplus.vercel.app/orders/${record.id}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Order Details</a>
            </div>
            <p>If you have any questions about your order, please contact our support team.</p>
            <p>Best regards,<br>The FataPlus Team</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666; font-size: 12px;">
              <p>© 2023 FataPlus. All rights reserved.</p>
            </div>
          </div>
        `;
        
        // Send the email
        $app.newMailClient().send(
          user.get('email'),
          subject,
          body,
          { html: true }
        );
        
        console.log(`Order confirmation email sent to ${user.get('email')}`);
      }
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
    }
  });
}

// Post validation hooks
function registerPostValidationHooks() {
  // Before create validation
  onRecordBeforeCreateRequest((e) => {
    if (e.collection.name !== 'posts') {
      return;
    }
    
    const record = e.record;
    
    // Validate required fields
    const requiredFields = ['author', 'content', 'postType'];
    for (const field of requiredFields) {
      if (!record.get(field)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    
    // Validate content length
    const content = record.get('content');
    if (content.length < 10) {
      throw new Error('Content must be at least 10 characters long');
    }
    
    if (content.length > 5000) {
      throw new Error('Content must be at most 5000 characters long');
    }
    
    // Validate post type
    const validPostTypes = ['general', 'question', 'marketplace'];
    if (!validPostTypes.includes(record.get('postType'))) {
      throw new Error(`Invalid post type. Must be one of: ${validPostTypes.join(', ')}`);
    }
    
    // Check for spam or inappropriate content
    const spamKeywords = ['viagra', 'cialis', 'casino', 'lottery', 'prize', 'winner', 'free money'];
    const contentLower = content.toLowerCase();
    
    for (const keyword of spamKeywords) {
      if (contentLower.includes(keyword)) {
        throw new Error('Content contains prohibited keywords');
      }
    }
    
    // Set creation date if not set
    if (!record.get('created')) {
      record.set('created', new Date().toISOString());
    }
  });
  
  // Before update validation
  onRecordBeforeUpdateRequest((e) => {
    if (e.collection.name !== 'posts') {
      return;
    }
    
    const record = e.record;
    
    // Validate content length if changed
    if (e.isChanged('content')) {
      const content = record.get('content');
      if (content.length < 10) {
        throw new Error('Content must be at least 10 characters long');
      }
      
      if (content.length > 5000) {
        throw new Error('Content must be at most 5000 characters long');
      }
      
      // Check for spam or inappropriate content
      const spamKeywords = ['viagra', 'cialis', 'casino', 'lottery', 'prize', 'winner', 'free money'];
      const contentLower = content.toLowerCase();
      
      for (const keyword of spamKeywords) {
        if (contentLower.includes(keyword)) {
          throw new Error('Content contains prohibited keywords');
        }
      }
      
      // Set updated date
      record.set('updated', new Date().toISOString());
    }
    
    // Validate post type if changed
    if (e.isChanged('postType')) {
      const validPostTypes = ['general', 'question', 'marketplace'];
      if (!validPostTypes.includes(record.get('postType'))) {
        throw new Error(`Invalid post type. Must be one of: ${validPostTypes.join(', ')}`);
      }
    }
  });
}
