// PocketBase Realtime Notifications Hook
// This file should be placed in the pb_hooks directory of your PocketBase instance

// Initialize the app
onEvent('app.before', () => {
  console.log('Initializing realtime notifications hook...');
  
  // Register hooks for collections that should trigger notifications
  registerPostsHooks();
  registerCommentsHooks();
  registerLikesHooks();
  registerOrdersHooks();
  
  console.log('Realtime notifications hook initialized');
});

// Posts hooks
function registerPostsHooks() {
  // After create hook
  onRecordAfterCreateRequest((e) => {
    if (e.collection.name !== 'posts') {
      return;
    }
    
    // Get the created post
    const post = e.record;
    
    // Broadcast to all clients
    $app.dao().expandRecord(post, ['author'], null);
    
    // Send notification to all users
    broadcastNotification('posts/created', {
      post: serializeRecord(post),
      message: `New post by ${post.expand?.author?.name || 'Unknown User'}`
    });
  });
  
  // After update hook
  onRecordAfterUpdateRequest((e) => {
    if (e.collection.name !== 'posts') {
      return;
    }
    
    // Get the updated post
    const post = e.record;
    
    // Broadcast to all clients
    $app.dao().expandRecord(post, ['author'], null);
    
    // Send notification to all users
    broadcastNotification('posts/updated', {
      post: serializeRecord(post),
      message: `Post updated by ${post.expand?.author?.name || 'Unknown User'}`
    });
  });
  
  // After delete hook
  onRecordAfterDeleteRequest((e) => {
    if (e.collection.name !== 'posts') {
      return;
    }
    
    // Get the deleted post
    const post = e.record;
    
    // Send notification to all users
    broadcastNotification('posts/deleted', {
      postId: post.id,
      message: 'Post deleted'
    });
  });
}

// Comments hooks
function registerCommentsHooks() {
  // After create hook
  onRecordAfterCreateRequest((e) => {
    if (e.collection.name !== 'comments') {
      return;
    }
    
    // Get the created comment
    const comment = e.record;
    
    // Expand relations
    $app.dao().expandRecord(comment, ['author', 'post'], null);
    
    // Send notification to post author
    if (comment.expand?.post?.author) {
      sendNotification(comment.expand.post.author, 'comments/created', {
        comment: serializeRecord(comment),
        message: `${comment.expand?.author?.name || 'Unknown User'} commented on your post`
      });
    }
    
    // Broadcast to all clients
    broadcastNotification('comments/created', {
      comment: serializeRecord(comment),
      message: `New comment by ${comment.expand?.author?.name || 'Unknown User'}`
    });
  });
}

// Likes hooks
function registerLikesHooks() {
  // After create hook
  onRecordAfterCreateRequest((e) => {
    if (e.collection.name !== 'likes') {
      return;
    }
    
    // Get the created like
    const like = e.record;
    
    // Expand relations
    $app.dao().expandRecord(like, ['user', 'post'], null);
    
    // Send notification to post author
    if (like.expand?.post?.author && like.expand.post.author !== like.user) {
      sendNotification(like.expand.post.author, 'likes/created', {
        like: serializeRecord(like),
        message: `${like.expand?.user?.name || 'Unknown User'} liked your post`
      });
    }
  });
}

// Orders hooks
function registerOrdersHooks() {
  // After create hook
  onRecordAfterCreateRequest((e) => {
    if (e.collection.name !== 'orders') {
      return;
    }
    
    // Get the created order
    const order = e.record;
    
    // Send notification to user
    sendNotification(order.user, 'orders/created', {
      order: serializeRecord(order),
      message: `Your order #${order.id} has been placed`
    });
    
    // Send notification to admins
    sendNotificationToAdmins('orders/created', {
      order: serializeRecord(order),
      message: `New order #${order.id} has been placed`
    });
  });
  
  // After update hook
  onRecordAfterUpdateRequest((e) => {
    if (e.collection.name !== 'orders') {
      return;
    }
    
    // Get the updated order
    const order = e.record;
    const oldOrder = e.oldRecord;
    
    // Check if status has changed
    if (order.status !== oldOrder.status) {
      // Send notification to user
      sendNotification(order.user, 'orders/status_changed', {
        order: serializeRecord(order),
        oldStatus: oldOrder.status,
        newStatus: order.status,
        message: `Your order #${order.id} status has changed to ${order.status}`
      });
    }
  });
}

// Helper function to send notification to a specific user
function sendNotification(userId, eventType, data) {
  try {
    // Get the user's realtime connections
    const userConnections = $app.dao().findRecordById('users', userId);
    
    if (userConnections) {
      // Send notification to user
      $app.dao().recordSubscriptions().broadcast(
        `users/${userId}`,
        eventType,
        data
      );
    }
  } catch (error) {
    console.error(`Error sending notification to user ${userId}:`, error);
  }
}

// Helper function to send notification to all admin users
function sendNotificationToAdmins(eventType, data) {
  try {
    // Get all admin users
    const adminUsers = $app.dao().findRecordsByFilter('users', 'userType = "admin"');
    
    // Send notification to each admin
    for (const admin of adminUsers) {
      sendNotification(admin.id, eventType, data);
    }
  } catch (error) {
    console.error('Error sending notification to admins:', error);
  }
}

// Helper function to broadcast notification to all clients
function broadcastNotification(eventType, data) {
  try {
    // Broadcast to all clients
    $app.dao().recordSubscriptions().broadcast(
      '*',
      eventType,
      data
    );
  } catch (error) {
    console.error('Error broadcasting notification:', error);
  }
}

// Helper function to serialize a record
function serializeRecord(record) {
  try {
    // Convert record to JSON
    return JSON.parse(JSON.stringify(record));
  } catch (error) {
    console.error('Error serializing record:', error);
    return {};
  }
}
