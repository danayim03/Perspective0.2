import { WebSocketServer } from 'ws';

const port = process.env.PORT || 8080;
const wss = new WebSocketServer({ port: parseInt(port, 10) });

// Store waiting users
const waitingUsers = new Map(); // userId -> user data
const userConnections = new Map(); // userId -> ws

// Store active matches
const activeMatches = new Map(); // ws -> matched ws

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      
      if (data.type === 'waiting') {
        const userId = data.user.id;
        
        // Clear any existing matches for this user's WebSocket
        const matchedWs = activeMatches.get(ws);
        if (matchedWs) {
          activeMatches.delete(matchedWs);
          activeMatches.delete(ws);
        }
        
        // Update or add user to waiting pool
        waitingUsers.set(userId, data.user);
        userConnections.set(userId, ws);
        
        console.log('User waiting or reconnected:', data.user);
        
        // Try to find a match based on gender preferences
        console.log('Looking for a match for user:', data.user);
        
        for (const [waitingUserId, userData] of waitingUsers.entries()) {
          if (waitingUserId === userId || userData.lastMatchedUserId === userId) continue; // Skip self and last match
          
          // Match if the gender preferences align
          const isMatch = 
            userData.gender === data.user.targetGender && 
            userData.targetGender === data.user.gender;
          
          if (isMatch) {
            const matchedWs = userConnections.get(waitingUserId);
            if (matchedWs && matchedWs.readyState === WebSocket.OPEN) {
              console.log('Match found between:', data.user, 'and', userData);
              
              // Remove both users from waiting pool
              waitingUsers.delete(userId);
              waitingUsers.delete(waitingUserId);
              
              // Add to active matches
              activeMatches.set(ws, matchedWs);
              activeMatches.set(matchedWs, ws);
              
              // Notify both users
              ws.send(JSON.stringify({ type: 'matched' }));
              matchedWs.send(JSON.stringify({ type: 'matched' }));
              break;
            }
          }
        }
      } else if (data.type === 'chat') {
        const matchedWs = activeMatches.get(ws);
        if (matchedWs && matchedWs.readyState === WebSocket.OPEN) {
          matchedWs.send(JSON.stringify({
            type: 'chat',
            message: data.message
          }));
        }
      } else if (data.type === 'typing') {
        // Handle typing signal
        const matchedWs = activeMatches.get(ws);
        if (matchedWs && matchedWs.readyState === WebSocket.OPEN) {
          matchedWs.send(JSON.stringify({
            type: 'typing'
          }));
        }
      } else if (data.type === 'endChat') {
        const matchedWs = activeMatches.get(ws);
        
        if (matchedWs && matchedWs.readyState === WebSocket.OPEN) {
          matchedWs.send(JSON.stringify({ type: 'matchEnded' }));
        }
        
        // Remove both users from active matches
        if (matchedWs) {
          activeMatches.delete(matchedWs);
        }
        activeMatches.delete(ws);
      } else if (data.type === 'rematchRequest') {
        const matchedWs = activeMatches.get(ws);

        if (matchedWs && matchedWs.readyState === WebSocket.OPEN) {
          matchedWs.send(JSON.stringify({ type: 'rematchNotification', message: "Your opponent has clicked rematch :(" }));
          console.log(`User ${data.user.id} requested a rematch, sending notification.`);
        }

        // Remove both users from active matches
        if (matchedWs) {
          activeMatches.delete(matchedWs);
        }
        activeMatches.delete(ws);

        // Send both users back to the waiting room while ensuring they do not get matched with each other again
        const userId = data.user.id;
        const opponentId = [...userConnections.entries()].find(([_, wsConn]) => wsConn === matchedWs)?.[0];

        if (userId) {
          waitingUsers.set(userId, { ...data.user, lastMatchedUserId: opponentId });
          userConnections.set(userId, ws);
        }

        if (opponentId) {
          waitingUsers.set(opponentId, { ...waitingUsers.get(opponentId), lastMatchedUserId: userId });
          userConnections.set(opponentId, matchedWs);
        }
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    
    // Handle matched users disconnection
    const matchedWs = activeMatches.get(ws);
    if (matchedWs && matchedWs.readyState === WebSocket.OPEN) {
      matchedWs.send(JSON.stringify({ type: 'matchEnded' }));
      activeMatches.delete(matchedWs);
      activeMatches.delete(ws);
    }
    
    // Remove user from waiting pool and connections
    for (const [userId, userWs] of userConnections.entries()) {
      if (userWs === ws) {
        userConnections.delete(userId);
        waitingUsers.delete(userId);
        break;
      }
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

console.log(`WebSocket server is running on port ${port}`);

// Keep the server alive
setInterval(() => console.log('Server is alive'), 10000);

process.on('SIGTERM', () => {
  console.log("Received SIGTERM. Gracefully shutting down.");
  wss.close(() => {
    console.log("WebSocket server closed.");
    process.exit(0);
  });
});
