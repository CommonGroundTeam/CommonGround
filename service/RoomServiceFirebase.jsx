import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
  Timestamp,
  orderBy,
  limit,
  onSnapshot,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import { FIRESTORE_DB } from "@/firebaseConfig";

export const fetchChatRoomsWithDetails = async (userId) => {
  try {
    const roomsRef = collection(FIRESTORE_DB, "rooms");
    const q = query(roomsRef, where("participants", "array-contains", userId));
    const querySnapshot = await getDocs(q);

    const rooms = await Promise.all(
      querySnapshot.docs.map(async (roomDoc) => {
        const roomData = roomDoc.data();
        const otherUserId = roomData.participants.find((id) => id !== userId);

        // Fetch the latest message in the room
        const messagesRef = collection(roomDoc.ref, "messages");
        const latestMessageQuery = query(
          messagesRef,
          orderBy("createdAt", "desc"),
          limit(1)
        );
        const latestMessageSnapshot = await getDocs(latestMessageQuery);
        const latestMessage = !latestMessageSnapshot.empty
          ? latestMessageSnapshot.docs[0].data()
          : null;

        // Fetch user details for the other participant
        const otherUserDoc = await getDoc(
          doc(FIRESTORE_DB, "users", otherUserId)
        );
        const otherUserDetails = otherUserDoc.exists()
          ? otherUserDoc.data()
          : null;

        return {
          roomId: roomDoc.id,
          ...roomData,
          latestMessage,
          otherUser: {
            userId: otherUserId,
            ...otherUserDetails,
          },
        };
      })
    );

    return rooms;
  } catch (error) {
    console.error("Error fetching chat rooms with details:", error);
    throw error;
  }
};

export const createRoomIfNotExists = async (roomId, participants) => {
  try {
    const roomRef = doc(FIRESTORE_DB, "rooms", roomId);
    const roomDoc = await getDoc(roomRef);

    if (!roomDoc.exists()) {
      await setDoc(roomRef, {
        roomId,
        createdAt: Timestamp.fromDate(new Date()),
        participants,
      });
      console.log(`Room created with ID: ${roomId}`);
    }
  } catch (error) {
    console.error("Error creating room:", error);
    throw error;
  }
};

export const fetchRoomMessages = async (roomId) => {
  try {
    const roomRef = doc(FIRESTORE_DB, "rooms", roomId);
    const messagesRef = collection(roomRef, "messages");
    return messagesRef;
  } catch (error) {
    console.error("Error fetching room messages:", error);
    throw error;
  }
};

/**
 * Listen to chat rooms and their latest messages for a user.
 * @param {string} userId - The user's ID.
 * @param {function} callback - Callback function to handle updates.
 * @returns {function} - Unsubscribe function to stop listening.
 */
export const listenToChatRoomsWithDetails = (userId, callback) => {
  const roomsRef = collection(FIRESTORE_DB, "rooms");
  const roomsQuery = query(
    roomsRef,
    where("participants", "array-contains", userId)
  );

  const unsubscribe = onSnapshot(roomsQuery, async (snapshot) => {
    const rooms = await Promise.all(
      snapshot.docs.map(async (roomDoc) => {
        const roomData = roomDoc.data();
        const otherUserId = roomData.participants.find((id) => id !== userId);

        // Real-time listener for the latest message
        const messagesRef = collection(roomDoc.ref, "messages");
        const latestMessageQuery = query(
          messagesRef,
          orderBy("createdAt", "desc"),
          limit(1)
        );

        const latestMessageSnapshot = await new Promise((resolve) =>
          onSnapshot(latestMessageQuery, (msgSnap) => resolve(msgSnap))
        );

        const latestMessage = latestMessageSnapshot.docs[0]?.data() || null;

        // Fetch other user's details
        const otherUserDoc = await getDoc(
          doc(FIRESTORE_DB, "users", otherUserId)
        );
        const otherUser = otherUserDoc.exists() ? otherUserDoc.data() : null;

        return {
          roomId: roomDoc.id,
          ...roomData,
          latestMessage,
          otherUser: {
            userId: otherUserId,
            ...otherUser,
          },
        };
      })
    );

    // Pass updated rooms to the callback
    callback(rooms);
  });

  return unsubscribe; // Return unsubscribe for cleanup
};

export const deleteChatRoom = async (item) => {
  try {
    const roomId = item.roomId;

    if (!roomId) {
      console.error("Room ID not found for the chat room.");
      return;
    }

    const roomRef = doc(FIRESTORE_DB, "rooms", roomId);
    const messagesRef = collection(roomRef, "messages");
    const messagesSnapshot = await getDocs(messagesRef);

    const batch = writeBatch(FIRESTORE_DB);

    // Add message deletions to the batch
    messagesSnapshot.docs.forEach((messageDoc) => {
      batch.delete(messageDoc.ref);
    });

    // Commit the batch
    await batch.commit();

    // Delete the room document
    await deleteDoc(roomRef);

    console.log(
      `Chat room and its messages deleted successfully for roomId: ${roomId}`
    );
  } catch (error) {
    console.error("Error deleting chat room and messages:", error.message);
  }
};
