import { Query } from 'appwrite';
import { client, databases, DATABASE_ID, COLLECTIONS } from './appwrite';

export function listenToChats(uid, callback) {
  const fetchChats = () => {
    databases
      .listDocuments(DATABASE_ID, COLLECTIONS.CHATS, [
        Query.contains('participants', uid),
        Query.orderDesc('lastMessageTime'),
      ])
      .then((response) => callback(response.documents))
      .catch((err) => console.error('Error fetching chats:', err));
  };

  fetchChats();

  const channel = `databases.${DATABASE_ID}.collections.${COLLECTIONS.CHATS}.documents`;
  return client.subscribe(channel, () => {
    fetchChats();
  });
}