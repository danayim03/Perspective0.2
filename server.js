
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

// Store waiting users
const waitingUsers = new Map(); // ws -> user data

// Store active matches
const activeMatches = new Map(); // ws -> matched ws

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      
      if (data.type === 'waiting') {
        // Add user to waiting pool
        waitingUsers.set(ws, data.user);
        console.log('User waiting:', data.user);
        
        // If this is a getter, try to find a matching giver
        if (data.user.role === 'getter') {
          console.log('Looking for a match for getter:', data.user);
          console.log('Current waiting users:', Array.from(waitingUsers.values()));
          
          for (const [potentialMatch, userData] of waitingUsers.entries()) {
            console.log('Checking potential match:', userData);
            
            const isMatch = 
              potentialMatch !== ws && // Not the same user
              userData.role === 'giver' && // Is a giver
              userData.gender === data.user.targetGender && // Matches target gender
              userData.orientation === data.user.targetOrientation; // Matches target orientation
            
            console.log('Match conditions:', {
              differentUser: potentialMatch !== ws,
              isGiver: userData.role === 'giver',
              matchesGender: userData.gender === data.user.targetGender,
              matchesOrientation: userData.orientation === data.user.targetOrientation
            });
            
            if (isMatch) {
              console.log('Match found between:', data.user, 'and', userData);
              
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
        // If this is a giver, check if any getters are waiting for someone like them
        else if (data.user.role === 'giver') {
          console.log('New giver joined, checking for waiting getters');
          
          for (const [potentialMatch, userData] of waitingUsers.entries()) {
            if (potentialMatch !== ws && // Not the same user
                userData.role === 'getter' && // Is a getter
                data.user.gender === userData.targetGender && // Giver matches getter's target gender
                data.user.orientation === userData.targetOrientation) { // Giver matches getter's target orientation
              
              console.log('Match found between giver:', data.user, 'and getter:', userData);
              
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
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    
    // Notify matched user if exists
    const matchedUser = activeMatches.get(ws);
    if (matchedUser && matchedUser.readyState === WebSocket.OPEN) {
      matchedUser.send(JSON.stringify({ type: 'matchEnded' }));
      activeMatches.delete(matchedUser);
    }
    
    // Clean up
    waitingUsers.delete(ws);
    activeMatches.delete(ws);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

console.log('WebSocket server is running on ws://localhost:8080');
