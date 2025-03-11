import {
  doc,
  getDoc,
  getDocs,
  deleteDoc,
  collection,
  query,
  where,
  setDoc,
} from "firebase/firestore";
import { FIRESTORE_DB } from "@/firebaseConfig";

/**
 * Add two users as friends.
 * @param {string} userId1 - The first user's ID.
 * @param {string} userId2 - The second user's ID.
 * @returns {Promise<void>}
 */
export const addFriends = async (userId1, userId2) => {
  try {
    const user1FriendsRef = doc(FIRESTORE_DB, "friends", userId1);
    const user2FriendsRef = doc(FIRESTORE_DB, "friends", userId2);

    await Promise.all([
      setDoc(user1FriendsRef, { [userId2]: true }, { merge: true }),
      setDoc(user2FriendsRef, { [userId1]: true }, { merge: true }),
    ]);
  } catch (error) {
    console.error("Error adding friends:", error);
    throw error;
  }
};

/**
 * Check if two users are friends.
 * @param {string} currentUserId - Current user's ID.
 * @param {string} targetUserId - Target user's ID.
 * @returns {Promise<boolean>} - Whether the users are friends.
 */
export const isFriend = async (currentUserId, targetUserId) => {
  try {
    const friendsRef = doc(FIRESTORE_DB, "friends", currentUserId);
    const friendsDoc = await getDoc(friendsRef);
    return friendsDoc.exists() && !!friendsDoc.data()[targetUserId];
  } catch (error) {
    console.error("Error checking friendship status:", error);
    throw error;
  }
};

/**
 * Remove a friend for two users and delete any existing friend requests.
 * @param {string} currentUserId - Current user's ID.
 * @param {string} targetUserId - Target user's ID.
 * @returns {Promise<void>}
 */
export const removeFriend = async (currentUserId, targetUserId) => {
  try {
    const currentUserFriendRef = doc(FIRESTORE_DB, "friends", currentUserId);
    const targetUserFriendRef = doc(FIRESTORE_DB, "friends", targetUserId);

    // Delete the friend relationship
    await Promise.all([
      deleteDoc(currentUserFriendRef),
      deleteDoc(targetUserFriendRef),
    ]);

    // Delete any existing friend requests
    const friendRequestsRef = collection(FIRESTORE_DB, "friendRequests");

    // Query for friend requests where the current user is the sender or receiver
    const friendRequestsQuery = query(
      friendRequestsRef,
      where("senderId", "in", [currentUserId, targetUserId]),
      where("receiverId", "in", [currentUserId, targetUserId])
    );

    const requestSnapshot = await getDocs(friendRequestsQuery);

    const deletePromises = requestSnapshot.docs.map((doc) =>
      deleteDoc(doc.ref)
    );

    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Error removing friend and friend requests:", error);
    throw error;
  }
};

/**
 * Fetch friends' details for a user.
 * @param {string} userId - The UID of the current user.
 * @returns {Promise<Array>} - An array of friend details.
 */
export const fetchFriendsWithDetails = async (userId) => {
  try {
    const friendsRef = doc(FIRESTORE_DB, "friends", userId);
    const friendsDoc = await getDoc(friendsRef);
    const friendIds = friendsDoc.exists() ? Object.keys(friendsDoc.data()) : [];
    const friendsDetails = await Promise.all(
      friendIds.map(async (id) => {
        const friendDoc = await getDoc(doc(FIRESTORE_DB, "users", id));
        return { userId: id, ...friendDoc.data() };
      })
    );
    return friendsDetails;
  } catch (error) {
    console.error("Error fetching friends with details:", error);
    throw error;
  }
};

/**
 * Fetch recent activities of friends.
 * @param {string} userId - The ID of the current user.
 * @param {number} [limitCount=10] - The maximum number of activities to fetch.
 * @returns {Promise<Array>} - An array of friend activities.
 */
export const fetchFriendActivities = async (userId, limitCount = 10) => {
  try {
    // Fetch friends of the current user
    const friendsRef = collection(FIRESTORE_DB, "friends");
    const friendsQuery = query(
      friendsRef,
      where("userIds", "array-contains", userId)
    );
    const friendsSnapshot = await getDocs(friendsQuery);

    const friendIds = friendsSnapshot.docs.map((doc) =>
      doc.data().userIds.find((id) => id !== userId)
    );

    if (friendIds.length === 0) return [];

    // Fetch activities for all friends
    const activities = [];

    // Fetch recent events attended by friends
    const eventsRef = collection(FIRESTORE_DB, "events");
    const eventsQuery = query(
      eventsRef,
      where("userId", "in", friendIds),
      orderBy("timestamp", "desc"),
      limit(limitCount)
    );
    const eventsSnapshot = await getDocs(eventsQuery);
    eventsSnapshot.forEach((doc) => {
      activities.push({
        type: "event",
        ...doc.data(),
      });
    });

    // Fetch recent messages sent by friends
    const messagesRef = collection(FIRESTORE_DB, "messages");
    const messagesQuery = query(
      messagesRef,
      where("userId", "in", friendIds),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );
    const messagesSnapshot = await getDocs(messagesQuery);
    messagesSnapshot.forEach((doc) => {
      activities.push({
        type: "message",
        ...doc.data(),
      });
    });

    // Fetch recent interests added by friends
    const interestsRef = collection(FIRESTORE_DB, "interests");
    const interestsQuery = query(
      interestsRef,
      where("userId", "in", friendIds),
      orderBy("timestamp", "desc"),
      limit(limitCount)
    );
    const interestsSnapshot = await getDocs(interestsQuery);
    interestsSnapshot.forEach((doc) => {
      activities.push({
        type: "interest",
        ...doc.data(),
      });
    });

    // Sort activities by timestamp in descending order
    activities.sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds);

    return activities;
  } catch (error) {
    console.error("Error fetching friend activities:", error);
    throw error;
  }
};
