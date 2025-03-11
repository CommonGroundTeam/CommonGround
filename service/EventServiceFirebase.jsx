import { FIRESTORE_DB } from "../firebaseConfig.js";
import {
  collection,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";

const eventCollection = collection(FIRESTORE_DB, "event");

/**
 * Get all events
 * @returns {Promise<Array>} List of all events
 */
export const getAllEvents = async () => {
  try {
    const snapshot = await getDocs(eventCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

/**
 * Get a single event by ID
 * @param {string} id - Event document ID
 * @returns {Promise<Object>} Event data
 */
export const getEventById = async (id) => {
  try {
    const eventDoc = doc(eventCollection, id);
    const snapshot = await getDoc(eventDoc);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() };
    } else {
      throw new Error("Event not found");
    }
  } catch (error) {
    console.error("Error fetching event:", error);
    throw error;
  }
};

/**
 * Add a new event
 * @param {Object} eventData - Event data to save
 * @returns {Promise<string>} ID of the created event
 */
export const addEvent = async (eventData) => {
  try {
    const docRef = await addDoc(eventCollection, eventData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding event:", error);
    throw error;
  }
};

/**
 * Update an existing event
 * @param {string} id - Event document ID
 * @param {Object} updatedData - Data to update
 * @returns {Promise<void>}
 */
export const updateEvent = async (id, updatedData) => {
  try {
    const eventDoc = doc(eventCollection, id);
    await updateDoc(eventDoc, updatedData);
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};

/**
 * Delete an event
 * @param {string} id - Event document ID
 * @returns {Promise<void>}
 */
export const deleteEvent = async (id) => {
  try {
    const eventDoc = doc(eventCollection, id);
    await deleteDoc(eventDoc);
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

/**
 * Get the name of an event by its ID
 * @param {string} eventId - The ID of the event
 * @returns {Promise<string|null>} The event name or null if not found
 */
export const getEventNameById = async (eventId) => {
  try {
    const docRef = doc(eventCollection, eventId);
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? snapshot.data().name || null : null;
  } catch (error) {
    console.error("Error getting event name by ID:", error);
    throw error;
  }
};

/**
 * Get the date of an event by its ID
 * @param {string} eventId - The ID of the event
 * @returns {Promise<string|null>} The event date or null if not found
 */
export const getEventDateById = async (eventId) => {
  try {
    const docRef = doc(eventCollection, eventId);
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? snapshot.data().date || null : null;
  } catch (error) {
    console.error("Error getting event date by ID:", error);
    throw error;
  }
};

/**
 * Get the location of an event by its ID
 * @param {string} eventId - The ID of the event
 * @returns {Promise<string|null>} The event location or null if not found
 */
export const getEventLocationById = async (eventId) => {
  try {
    const docRef = doc(eventCollection, eventId);
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? snapshot.data().location || null : null;
  } catch (error) {
    console.error("Error getting event location by ID:", error);
    throw error;
  }
};

/**
 * Get the details of an event by its ID
 * @param {string} eventId - The ID of the event
 * @returns {Promise<string|null>} The event details or null if not found
 */
export const getEventDetailsById = async (eventId) => {
  try {
    const docRef = doc(eventCollection, eventId);
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? snapshot.data().details || null : null;
  } catch (error) {
    console.error("Error getting event details by ID:", error);
    throw error;
  }
};

/**
 * Get the ID of an event (for completeness, this simply returns the input)
 * @param {string} eventId - The ID of the event
 * @returns {string} The event ID
 */
export const getEventId = (eventId) => {
  return eventId; // Directly return the eventId since it's already provided
};

