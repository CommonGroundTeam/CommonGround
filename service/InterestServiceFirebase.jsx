import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { FIRESTORE_DB } from "@/firebaseConfig";

/**
 * Fetch all available interests from Firestore.
 * @returns {Promise<Array>} - An array of interests.
 */
export const fetchInterests = async () => {
  try {
    const interestsCollection = collection(FIRESTORE_DB, "interests");
    const querySnapshot = await getDocs(interestsCollection);

    const interests = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return interests;
  } catch (error) {
    console.error("Error fetching interests:", error);
    throw error;
  }
};

/**
 * Add a new interest to Firestore.
 * @param {Object} interest - The interest object to add (e.g., { name: "Gaming", icon: "url" }).
 * @returns {Promise<void>}
 */
export const addInterest = async (interest) => {
  try {
    const interestsCollection = collection(FIRESTORE_DB, "interests");
    await addDoc(interestsCollection, interest);
    console.log("Interest added successfully:", interest);
  } catch (error) {
    console.error("Error adding interest:", error);
    throw error;
  }
};

/**
 * Delete an interest from Firestore.
 * @param {string} interestId - The ID of the interest to delete.
 * @returns {Promise<void>}
 */
export const deleteInterest = async (interestId) => {
  try {
    const interestRef = doc(FIRESTORE_DB, "interests", interestId);
    await deleteDoc(interestRef);
    console.log("Interest deleted successfully:", interestId);
  } catch (error) {
    console.error("Error deleting interest:", error);
    throw error;
  }
};
