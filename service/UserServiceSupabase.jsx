import { supabase } from "../supabaseClient";

/**
 * Updates a user's data in Supabase.
 * @param {Object} userData - Fields to update.
 */
export const updateUser = async (userId, userData) => {
  const { error } = await supabase
    .from("users")
    .update({ ...userData, updated_at: new Date().toISOString() })
    .eq("id", userId);

  if (error) throw new Error("Failed to update user: " + error.message);
};

export const getUsernameByUserId = async (userId) => {
  const { data, error } = await supabase
    .from("users")
    .select("username")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data?.username || null;
};

export const fetchUsersByUsername = async (username) => {
  const { data, error } = await supabase
    .from("users")
    .select("id, username")
    .ilike("username", `${username}%`);

  if (error) throw error;
  return data;
};

export const fetchUserById = async (userId) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
};

export const fetchInterests = async () => {
  const { data, error } = await supabase.from("interests").select("name");
  if (error) throw error;
  return data.map((item) => item.name);
};

export const fetchAllUsers = async () => {
  const { data, error } = await supabase.from("users").select("*");
  if (error) throw error;
  return data;
};

export const getDateOfBirthByUserId = async (userId) => {
  const { data, error } = await supabase
    .from("users")
    .select("date_of_birth")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data?.date_of_birth || null;
};

export const getDescriptionByUserId = async (userId) => {
  const { data, error } = await supabase
    .from("users")
    .select("description")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data?.description || null;
};

export const getProfilePictureByUserId = async (userId) => {
  const { data, error } = await supabase
    .from("users")
    .select("profile_picture")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data?.profile_picture || null;
};

export const fetchUserInterests = async (userId) => {
  const { data, error } = await supabase
    .from("users")
    .select("interests")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data?.interests || [];
};

export const fetchUserTeams = async (userId) => {
  const { data, error } = await supabase
    .from("user_teams")
    .select("team_id, teams(*)")
    .eq("user_id", userId);

  if (error) throw error;

  return data.map((item) => item.teams);
};

export const addTeamToUser = async (userId, teamId) => {
  const { error } = await supabase
    .from("user_teams")
    .insert({ user_id: userId, team_id: teamId });

  if (error) throw error;
};

export const removeTeamFromUser = async (userId, teamId) => {
  const { error } = await supabase
    .from("user_teams")
    .delete()
    .match({ user_id: userId, team_id: teamId });

  if (error) throw error;
};
