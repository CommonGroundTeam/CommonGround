import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  doc,
} from "firebase/firestore";
import { FIRESTORE_DB } from "@/firebaseConfig";

/**
 * Sends a message to a Firestore collection.
 *
 * @param {CollectionReference} messagesRef - A reference to the Firestore messages collection.
 * @param {Object} messageData - The data of the message to be sent.
 * @param {string} messageData.text - The text content of the message.
 * @param {string} messageData.userId - The ID of the user sending the message.
 * @param {Timestamp} messageData.createdAt - The timestamp when the message was created.
 *
 * @returns {Promise<void>} - A promise that resolves when the message is successfully sent.
 *
 * @throws {Error} - Throws an error if the message cannot be sent.
 */
export const sendMessage = async (messagesRef, messageData) => {
  try {
    await addDoc(messagesRef, messageData);
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

/**
 * Listens for real-time updates to messages in a Firestore collection.
 *
 * @param {CollectionReference} messagesRef - A reference to the Firestore messages collection.
 * @param {function} callback - A callback function that is invoked with the array of messages whenever the collection updates.
 *
 * @returns {function} - A function to unsubscribe from the listener when no longer needed.
 *
 * @throws {Error} - Throws an error if unable to listen to messages.
 */
export const listenForMessages = (messagesRef, callback) => {
  try {
    const q = query(messagesRef, orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map((doc) => doc.data());
      callback(messages);
    });
    return unsubscribe; // Return the unsubscribe function to stop listening when needed
  } catch (error) {
    console.error("Error listening for messages:", error);
    throw error;
  }
};

/**
 * Listen to the latest messages in a chat room.
 * @param {string} roomId - The room ID.
 * @param {function} callback - Function to handle the latest messages.
 * @returns {function} - Unsubscribe function to stop listening.
 */
export const listenToLatestMessages = (roomId, callback) => {
  try {
    const docRef = doc(FIRESTORE_DB, "rooms", roomId);
    const messagesRef = collection(docRef, "messages");
    const messagesQuery = query(messagesRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messages = snapshot.docs.map((doc) => doc.data());
      callback(messages[0] || null); // Pass the latest message to the callback
    });

    return unsubscribe; // Return the unsubscribe function for cleanup
  } catch (error) {
    console.error("Error listening to latest messages:", error);
    throw error;
  }
};
