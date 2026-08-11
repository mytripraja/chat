import { ID, Query } from 'appwrite';
import { client, databases, DATABASE_ID, COLLECTIONS } from './appwrite';

// Generates a deterministic ID for 1:1 chats
export function getChatId(uidA, uidB) {
  return [uidA, uidB].sort().join('_');
}

// Ensures a chat document exists in the 'chats' table
export async function ensureChat(uidA, uidB) {
  const chatId = getChatId(uidA, uidB);
  try {
    return await databases.getDocument(DATABASE_ID, COLLECTIONS.CHATS, chatId);
  } catch (error) {
    // If document doesn't exist (404), create it
    return await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.CHATS,
      chatId,
      {
        participants: [uidA, uidB],
        lastMessage: '',
        lastMessageTime: new Date().toISOString(),
        lastMessageSenderId: '',
      }
    );
  }
}

// Sends a message and updates the chat preview
export async function sendMessage(chatId, senderId, text) {
  const message = await databases.createDocument(
    DATABASE_ID,
    COLLECTIONS.MESSAGES,
    ID.unique(),
    {
      chatId,
      senderId,
      text,
      status: 'sent',
    }
  );

  await databases.updateDocument(DATABASE_ID, COLLECTIONS.CHATS, chatId, {
    lastMessage: text,
    lastMessageTime: new Date().toISOString(),
    lastMessageSenderId: senderId,
  });

  return message;
}

// Subscribes to real-time message updates for a chat
export function listenToMessages(chatId, callback) {
  // 1. Initial fetch of existing messages
  databases
    .listDocuments(DATABASE_ID, COLLECTIONS.MESSAGES, [
      Query.equal('chatId', chatId),
      Query.orderAsc('$createdAt'),
    ])
    .then((response) => {
      callback(response.documents);
    });

  // 2. Real-time WebSocket subscription for new incoming messages
  const channel = `databases.${DATABASE_ID}.collections.${COLLECTIONS.MESSAGES}.documents`;
  const unsubscribe = client.subscribe(channel, (response) => {
    if (
      response.events.includes('databases.*.collections.*.documents.*.create') &&
      response.payload.chatId === chatId
    ) {
      databases
        .listDocuments(DATABASE_ID, COLLECTIONS.MESSAGES, [
          Query.equal('chatId', chatId),
          Query.orderAsc('$createdAt'),
        ])
        .then((res) => callback(res.documents));
    }
  });

  return unsubscribe;
}
// Marks a specific message as read
export async function markMessageRead(chatId, messageId) {
  try {
    await databases.updateDocument(
      DATABASE_ID, 
      COLLECTIONS.MESSAGES, 
      messageId, 
      { status: 'read' }
    );
  } catch (error) {
    console.error('Failed to mark message read:', error);
  }
}