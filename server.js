
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

// Store waiting users
const waitingUsers = new Map(); // ws -> user data

// Store active matches
const activeMatches = new Map(); // ws -> matched ws

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (message) => {
    const data = JSON.parse(message.toString());
    
    if (data.type === 'waiting') {
      // Add user to waiting pool
      waitingUsers.set(ws, data.user);
      console.log('User waiting:', data.user);
      
      // If this is a getter, try to find a matching giver
      if (data.user.role === 'getter') {
        for (const [potentialMatch, userData] of waitingUsers.entries()) {
          if (potentialMatch !== ws && // Not the same user
              userData.role === 'giver' && // Is a giver
              userData.gender === data.user.targetGender && // Matches target gender
              userData.orientation === data.user.targetOrientation) { // Matches target orientation
            
            // Found a match!
            console.log('Found match!');
            
            // Remove both users from waiting pool
            waitingUsers.delete(ws);
            waitingUsers.delete(potentialMatch);
            
            // Add to active matches
            activeMatches.set(ws, potentialMatch);
            activeMatches.set(potentialMatch, ws);
            
            // Notify both users
            ws.send(JSON.stringify({ type: 'matched' }));
            potentialMatch.send(JSON.stringify({ type: 'matched' }));
            
            break;
          }
        }
      }
    } else if (data.type === 'chat') {
      // Forward chat message to matched user
      const matchedUser = activeMatches.get(ws);
      if (matchedUser && matchedUser.readyState === WebSocket.OPEN) {
        matchedUser.send(JSON.stringify({
          type: 'chat',
          message: data.message
        }));
      }
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    // Clean up
    waitingUsers.delete(ws);
    const matchedUser = activeMatches.get(ws);
    if (matchedUser) {
      matchedUser.send(JSON.stringify({ type: 'matchEnded' }));
      activeMatches.delete(matchedUser);
    }
    activeMatches.delete(ws);
  });
});

console.log('WebSocket server is running on ws://localhost:8080');
