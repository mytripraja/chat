import { ID, Query } from 'appwrite';
import { account, databases, DATABASE_ID } from './appwrite';

// Get currently logged-in user session
export async function getCurrentUser() {
  try {
    return await account.get();
  } catch (error) {
    return null; // Not logged in
  }
}

// Anonymous / Guest Login for quick access
export async function loginAnonymously() {
  try {
    await account.createAnonymousSession();
    return await account.get();
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

// Logout session
export async function logoutUser() {
  try {
    await account.deleteSession('current');
  } catch (error) {
    console.error('Logout failed:', error);
  }
}

// Fetch a user profile by ID (Used in ChatThread)
export async function getUserProfile(userId) {
  try {
    // Queries a hypothetical 'users' collection. 
    return await databases.getDocument(DATABASE_ID, 'users', userId);
  } catch (error) {
    // Fallback if the collection isn't set up yet so the app doesn't crash
    return { $id: userId, uid: userId, displayName: 'Unknown User' };
  }
}

// Search for a user by email (Used in NewChat)
export async function findUserByEmail(email) {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      'users',
      [Query.equal('email', email), Query.limit(1)]
    );
    return response.documents.length > 0 ? response.documents[0] : null;
  } catch (error) {
    console.error('Error finding user:', error);
    return null;
  }
}