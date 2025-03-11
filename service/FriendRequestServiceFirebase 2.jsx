import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { FIRESTORE_DB } from "@/firebaseConfig";

import { fetchUserById } from "@/service/UserServiceFirebase";

/**
 * Fetch pending friend requests for a user.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Array>} - Array of friend requests.
 */
export const fetchPendingFriendRequests = async (userId) => {
  try {
    const friendRequestsRef = collection(FIRESTORE_DB, "friendRequests");
    const q = query(
      friendRequestsRef,
      where("receiverId", "==", userId),
      where("status", "==", "pending")
    );

    const querySnapshot = await getDocs(q);

    const requests = await Promise.all(
      querySnapshot.docs.map(async (requestDoc) => {
        const requestData = requestDoc.data();
        const senderData = await fetchUserById(requestData.senderId);

        return {
          id: requestDoc.id,
          ...requestData,
          senderUsername: senderData?.username || "Unknown User",
        };
      })
    );

    return requests;
  } catch (error) {
    console.error("Error fetching pending friend requests:", error);
    throw error;
  }
};

/**
 * Update the status of a friend request.
 * @param {string} requestId - The ID of the friend request.
 * @param {string} status - The new status ("accepted" or "rejected").
 * @returns {Promise<void>}
 */
export const updateFriendRequestStatus = async (requestId, status) => {
  try {
    const friendRequestRef = doc(FIRESTORE_DB, "friendRequests", requestId);
    await updateDoc(friendRequestRef, { status });
  } catch (error) {
    console.error("Error updating friend request status:", error);
    throw error;
  }
};

/**
 * Delete a friend request.
 * @param {string} requestId - The ID of the friend request.
 * @returns {Promise<void>}
 */
export const deleteFriendRequest = async (requestId) => {
  try {
    const friendRequestRef = doc(FIRESTORE_DB, "friendRequests", requestId);
    await deleteDoc(friendRequestRef);
  } catch (error) {
    console.error("Error deleting friend request:", error);
    throw error;
  }
};

/**
 * Send a friend request.
 * @param {string} senderId - The sender's UID.
 * @param {string} receiverId - The receiver's UID.
 * @returns {Promise<void>}
 */
export const sendFriendRequest = async (senderId, receiverId) => {
  const friendRequestsRef = collection(FIRESTORE_DB, "friendRequests");

  // Check if user already sent a friend request
  const q_sent = query(
    friendRequestsRef,
    where("senderId", "==", senderId),
    where("receiverId", "==", receiverId)
  );
  const existingSentRequests = await getDocs(q_sent);

  if (!existingSentRequests.empty) {
    throw new Error("Friend request already sent.");
  }

  // Check if user already sent a friend request
  const q_received = query(
    friendRequestsRef,
    where("senderId", "==", receiverId),
    where("receiverId", "==", senderId)
  );
  const existingReceivedRequests = await getDocs(q_received);

  if (!existingReceivedRequests.empty) {
    throw new Error("You already have a pending request from this user.");
  }

  // Add a new friend request
  await addDoc(friendRequestsRef, {
    senderId,
    receiverId,
    status: "pending",
    createdAt: Timestamp.now(),
  });
};
