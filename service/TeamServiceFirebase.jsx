import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import {
  getUsernameByUserId,
  removeTeamFromUser,
} from "@/service/UserServiceFirebase";
import { removeUserFromTeamInSupabase } from "./UserTeamServiceSupabase";
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
 * Fetches team details and members from Firebase by team ID.
 * @param {string} teamId - The ID of the team.
 * @returns {Promise<Object|null>} - Team details including members.
 */
export const fetchTeamDetailsFromFirebase = async (teamId) => {
  try {
    const teamDocRef = doc(FIRESTORE_DB, "team", teamId);
    const teamDoc = await getDoc(teamDocRef);

    if (!teamDoc.exists()) {
      console.warn(`Team ${teamId} not found in Firebase.`);
      return null;
    }

    const teamData = teamDoc.data();

    const members = teamData.members
      ? await Promise.all(
          teamData.members.map(async (memberId) => {
            const username = await getUsernameByUserId(memberId);
            return {
              id: memberId,
              username: username || "Unknown User",
              role:
                teamData.preferences?.leader === memberId ? "Leader" : "Member",
            };
          })
        )
      : [];
    return { id: teamId, ...teamData, members };
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

/**
 * Adds a user to the specified team in Firebase.
 * Ensures that the user is added to the `members` array in the team document.
 *
 * @param {string} userId - The UID of the user.
 * @param {string} teamId - The ID of the team.
 * @returns {Promise<void>}
 */
export const addUserToTeamInFirebase = async (userId, teamId) => {
  try {
    if (!userId || !teamId) {
      throw new Error("Both userId and teamId are required.");
    }

    // Reference to the team document in Firestore
    const teamDocRef = doc(FIRESTORE_DB, "team", teamId);
    const teamDoc = await getDoc(teamDocRef);

    if (!teamDoc.exists()) {
      throw new Error("Team not found.");
    }

    // Update the team document to include the user in the `members` array
    await setDoc(
      teamDocRef,
      {
        members: arrayUnion(userId),
        updatedAt: Timestamp.now(),
      },
      { merge: true }
    );

    console.log(`User ${userId} added to team ${teamId} in Firebase.`);
  } catch (error) {
    console.error("Error adding user to team in Firebase:", error);
    throw error;
  }
};

/**
 * Removes a member from a team across Firebase and Supabase.
 * @param {string} teamId - The ID of the team.
 * @param {string} userId - The ID of the user to remove.
 */
export const removeMemberFromTeam = async (teamId, userId) => {
  try {
    const teamDocRef = doc(FIRESTORE_DB, "team", teamId);
    const teamDoc = await getDoc(teamDocRef);

    if (!teamDoc.exists()) {
      throw new Error(`Team ${teamId} not found.`);
    }

    const teamData = teamDoc.data();

    if (!teamData.members || !teamData.members.includes(userId)) {
      throw new Error(`User ${userId} is not in team ${teamId}.`);
    }

    await updateDoc(teamDocRef, {
      members: arrayRemove(userId),
    });

    console.log(`✅ User ${userId} removed from team ${teamId} in Firebase.`);

    await removeTeamFromUser(userId, teamId);
    console.log(`✅ Team ${teamId} removed from user ${userId} in Firebase.`);

    await removeUserFromTeamInSupabase(userId, teamId);
    console.log(`✅ User ${userId} removed from team ${teamId} in Supabase.`);

    return true;
  } catch (error) {
    console.error("❌ Error removing member from team:", error);
    throw error;
  }
};
