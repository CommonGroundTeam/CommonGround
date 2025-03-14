import {
  collection,
  doc,
  setDoc,
  Timestamp,
  query,
  getDoc,
  getDocs,
  orderBy,
  startAt,
  endAt,
  teamsCollection,
} from "firebase/firestore";
import { FIRESTORE_DB } from "../firebaseConfig.js";
import { getAuth } from "firebase/auth";

const usersCollection = collection(FIRESTORE_DB, "users");
const interestsCollection = collection(FIRESTORE_DB, "interests");

/**
 * Update a user in Firestore.
 * @param {Object} userData - The user data to save.
 * @returns {Promise<void>}
 */
export const updateUser = async (userData) => {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error("No authenticated user found.");
    }

    const userId = currentUser.uid;
    const userDocRef = doc(usersCollection, userId);

    await setDoc(
      userDocRef,
      {
        ...userData,
        updatedAt: Timestamp.now(),
      },
      { merge: true }
    );

    console.log("User created or updated successfully for UID:", userId);
  } catch (error) {
    console.error("Error creating/updating user:", error);
    throw error; // Rethrow error for further handling
  }
};

export const getUsernameByUserId = async (userId) => {
  try {
    const userDocRef = doc(usersCollection, userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return userDoc.data().username || null;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching username:", error);
    throw new Error("Could not retrieve username.");
  }
};

/**
 * Fetch users by username.
 * @param {string} username - The username to search for.
 * @returns {Promise<Array>} - An array of user objects.
 */
export const fetchUsersByUsername = async (username) => {
  try {
    const normalizedUsername = username.toLowerCase().trim();
    if (normalizedUsername === "") {
      return [];
    }

    const endAtString = `${normalizedUsername}\uf8ff`;
    const q = query(
      usersCollection,
      orderBy("username"),
      startAt(normalizedUsername),
      endAt(endAtString)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching users by username:", error);
    throw error;
  }
};

/**
 * Fetch a user's details by ID.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Object>} - The user's data.
 */
export const fetchUserById = async (userId) => {
  try {
    const userDocRef = doc(usersCollection, userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return { userId, ...userDoc.data() };
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
};

/**
 * Fetch all available interests from Firestore.
 * @returns {Promise<Array<string>>} - List of interests.
 */
export const fetchInterests = async () => {
  try {
    const querySnapshot = await getDocs(interestsCollection);
    return querySnapshot.docs.map((doc) => doc.data().name); // Assuming 'name' is the field
  } catch (error) {
    console.error("Error fetching interests:", error);
    throw error;
  }
};

/**
 * Read all user details from Firestore.
 * @returns {Promise<Array<Object>>} - Array of user objects.
 */
export const fetchAllUsers = async () => {
  try {
    const querySnapshot = await getDocs(usersCollection);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};

/**
 * Fetch a user's date of birth by ID.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<string|null>} - The user's date of birth.
 */
export const getDateOfBirthByUserId = async (userId) => {
  try {
    const userDocRef = doc(usersCollection, userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return userDoc.data().dateOfBirth || null;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching date of birth:", error);
    throw new Error("Could not retrieve date of birth.");
  }
};

/**
 * Fetch a user's description by ID.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<string|null>} - The user's description.
 */
export const getDescriptionByUserId = async (userId) => {
  try {
    const userDocRef = doc(usersCollection, userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return userDoc.data().description || null;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching description:", error);
    throw new Error("Could not retrieve description.");
  }
};

/**
 * Fetch a user's profile picture by ID.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<string|null>} - The user's profile picture URL.
 */
export const getProfilePictureByUserId = async (userId) => {
  try {
    const userDocRef = doc(usersCollection, userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return userDoc.data().profilePicture || null;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching profile picture:", error);
    throw new Error("Could not retrieve profile picture.");
  }
};

export const addTeamToUserInFirebase = async (userId, teamId) => {
  try {
    const userDocRef = doc(usersCollection, userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      throw new Error("User not found.");
    }

    const userData = userDoc.data();
    const updatedTeams = userData.teams
      ? [...userData.teams, teamId]
      : [teamId];

    await setDoc(
      userDocRef,
      { teams: updatedTeams, updatedAt: Timestamp.now() },
      { merge: true }
    );

    console.log(`Team ${teamId} added to user ${userId}`);
  } catch (error) {
    console.error("Error adding team to user:", error);
    throw error;
  }
};

/**
 * Fetches the interests of the currently authenticated user from Firestore.
 * @returns {Promise<Array>} - List of user's interests or an empty array if none.
 */
export const fetchUserInterests = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      throw new Error("User not authenticated.");
    }

    const userDocRef = doc(collection(FIRESTORE_DB, "users"), user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.interests || [];
    } else {
      console.warn("User document not found.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching user interests:", error);
    return [];
  }
};

/**
 * Fetches the teams associated with a user directly from Firestore.
 * @param {string} userId - The UID of the authenticated user.
 * @returns {Promise<Array>} - List of teams the user is part of.
 */
export const fetchUserTeamsFromFirebase = async (userId) => {
  try {
    if (!userId) throw new Error("User ID is required.");

    // Reference to the user's document
    const userDocRef = doc(FIRESTORE_DB, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      console.warn("User document not found.");
      return [];
    }

    const userData = userDoc.data();
    const teamIds = userData.teams || [];

    if (teamIds.length === 0) return [];

    // Fetch team details using the stored team IDs
    const teamPromises = teamIds.map(async (teamId) => {
      const teamDocRef = doc(FIRESTORE_DB, "team", teamId);
      const teamDoc = await getDoc(teamDocRef);
      return teamDoc.exists() ? { id: teamDoc.id, ...teamDoc.data() } : null;
    });

    const teams = await Promise.all(teamPromises);
    return teams.filter(Boolean); // Remove null values for non-existent teams
  } catch (error) {
    console.error("Error fetching user teams from Firebase:", error);
    return [];
  }
};
