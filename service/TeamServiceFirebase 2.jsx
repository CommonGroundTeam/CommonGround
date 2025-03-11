import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { FIRESTORE_DB } from "@/firebaseConfig";

/**
 * Checks if a team with the given name already exists in Firebase.
 * @param {string} teamName - The name of the team.
 * @returns {Promise<boolean>} - True if the team exists, false otherwise.
 */
export const checkIfTeamExists = async (teamName) => {
  try {
    const teamCollectionRef = collection(FIRESTORE_DB, "team"); // ✅ Correct Firestore collection reference
    const q = query(teamCollectionRef, where("name", "==", teamName)); // ✅ Ensure correct query syntax

    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty; // ✅ Returns true if a team exists
  } catch (error) {
    console.error("Error checking team existence:", error);
    return false;
  }
};

/**
 * Creates a new team in Firebase and returns the team ID.
 * @param {string} teamName - Name of the team.
 * @param {string} category - Team category.
 * @param {string} details - Team description.
 * @param {Object} preferences - Other team preferences.
 * @param {string} userId - The user ID of the creator (Leader).
 * @returns {Promise<string>} - The created team's ID.
 */
export const createTeamInFirebase = async (
  teamName,
  category,
  details,
  preferences,
  userId
) => {
  try {
    const newTeamRef = doc(collection(FIRESTORE_DB, "team"));
    const teamId = newTeamRef.id;

    await setDoc(newTeamRef, {
      name: teamName,
      category,
      details,
      createdAt: new Date(),
      preferences: {
        ...preferences,
        leader: userId, // Store leader in preferences
      },
    });

    return teamId;
  } catch (error) {
    console.error("Error creating team:", error);
    throw new Error("Failed to create team");
  }
};

/**
 * Adds a team ID to a user's Firestore document.
 * @param {string} userId - The user's ID.
 * @param {string} teamId - The team's ID.
 */
export const addTeamToUser = async (userId, teamId) => {
  try {
    const userDocRef = doc(FIRESTORE_DB, "users", userId); // ✅ Correct Firestore reference
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
      { teams: updatedTeams, updatedAt: Timestamp.now() }, // ✅ Fix Timestamp usage
      { merge: true }
    );

    // console.log(`Team ${teamId} added to user ${userId}`);
  } catch (error) {
    console.error("Error adding team to user:", error);
    throw error;
  }
};

/**
 * Fetches team details from Firebase by team ID.
 * @param {string} teamId - The ID of the team.
 * @returns {Promise<Object>} - Team details.
 */
export const fetchTeamDetailsFromFirebase = async (teamId) => {
  try {
    const teamDocRef = doc(FIRESTORE_DB, "team", teamId);
    const teamDoc = await getDoc(teamDocRef);

    if (!teamDoc.exists()) {
      console.warn(`Team ${teamId} not found in Firebase.`);
      return null;
    }

    return { id: teamId, ...teamDoc.data() };
  } catch (error) {
    console.error("Error fetching team details from Firebase:", error);
    return null;
  }
};

/**
 * Fetches teams based on a partial name match (case-insensitive).
 * @param {string} teamName - Partial or full team name to search.
 * @returns {Promise<Array>} - Array of matching teams.
 */
export const fetchTeamsByName = async (teamName) => {
  try {
    if (!teamName) return [];

    const lowerCaseTeamName = teamName.toLowerCase(); // Convert input to lowercase
    const teamsRef = collection(FIRESTORE_DB, "team");
    const q = query(teamsRef);
    const querySnapshot = await getDocs(q);

    const teams = querySnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((team) => team.name.toLowerCase().includes(lowerCaseTeamName)); // Filter results based on lowercase comparison

    return teams;
  } catch (error) {
    console.error("Error fetching teams by name:", error);
    return [];
  }
};
