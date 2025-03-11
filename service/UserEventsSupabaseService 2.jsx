import { supabase } from '../supabaseClient';

const TABLE_NAME = 'user_events';

/**
 * Fetch all relationships between users and events.
 */
export const fetchAllUserEventRelationships = async () => {
  const { data, error } = await supabase.from(TABLE_NAME).select('*');
  if (error) {
    console.error('Error fetching user-event relationships:', error);
    return null;
  }
  return data;
};

/**
 * Fetch all events for a specific user.
 * @param {string} userId - The user ID to filter by.
 */
export const fetchEventsByUser = async (userId) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('user_id', userId);
  if (error) {
    console.error('Error fetching events for user:', error);
    return null;
  }
  return data;
};

/**
 * Fetch all users associated with a specific event.
 * @param {string} eventId - The event ID to filter by.
 */
export const fetchUsersByEvent = async (eventId) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('event_id', eventId);
  if (error) {
    console.error('Error fetching users for event:', error);
    return null;
  }
  return data;
};

/**
 * Create a relationship between a user and an event.
 * @param {string} userId - The ID of the user.
 * @param {string} eventId - The ID of the event.
 */
export const addUserToEvent = async (userId, eventId) => {
  const { data, error } = await supabase.from(TABLE_NAME).insert([
    {
      user_id: userId,
      event_id: eventId,
      joined_at: new Date().toISOString(),
    },
  ]);
  if (error) {
    console.error('Error adding user to event:', error);
    return null;
  }
  return data;
};

/**
 * Remove a relationship between a user and an event.
 * @param {string} userId - The ID of the user.
 * @param {string} eventId - The ID of the event.
 */
export const removeUserFromEvent = async (userId, eventId) => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq('user_id', userId)
    .eq('event_id', eventId);
  if (error) {
    console.error('Error removing user from event:', error);
    return null;
  }
  return data;
};
