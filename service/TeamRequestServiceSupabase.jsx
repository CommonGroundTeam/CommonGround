import { supabase } from "@/supabaseClient";
import { addUserToTeamInSupabase } from "@/service/UserTeamServiceSupabase";
import { addTeamToUserInFirebase } from "./UserServiceFirebase";
import { addUserToTeamInFirebase } from "./TeamServiceFirebase";

/**
 * Send a join request to a team
 * @param {string} teamId - The ID of the team
 * @param {string} userId - The ID of the user sending the request
 * @returns {Promise<void>}
 */
export const sendJoinRequest = async (teamId, userId) => {
  try {
    const { data: existingRequest, error: checkError } = await supabase
      .from("team_requests")
      .select("*")
      .eq("team_id", teamId)
      .eq("user_id", userId)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      throw checkError;
    }

    if (existingRequest) {
      throw new Error("You have already sent a request to join this team.");
    }

    const { error } = await supabase
      .from("team_requests")
      .insert([{ team_id: teamId, user_id: userId }]);

    if (error) {
      throw error;
    }
  } catch (error) {
    alert(error.message);
    // console.error("Error sending join request:", error);
    throw error;
  }
};

/**
 * Fetch pending join requests for a team
 * @param {string} teamId - The ID of the team
 * @returns {Promise<Array>}
 */
export const fetchPendingTeamRequests = async (teamId) => {
  try {
    const { data, error } = await supabase
      .from("team_requests")
      .select("request_id, user_id")
      .eq("team_id", teamId);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching team join requests:", error);
    return [];
  }
};

/**
 * Accept a join request: Add user to team and delete the request
 * @param {string} requestId - The ID of the join request
 * @param {string} teamId - The ID of the team
 * @param {string} userId - The ID of the user being added
 */
export const acceptTeamJoinRequest = async (requestId, teamId, userId) => {
  try {
    await addUserToTeamInSupabase(userId, teamId);
    await addTeamToUserInFirebase(userId, teamId);
    await addUserToTeamInFirebase(userId, teamId);

    const { error } = await supabase
      .from("team_requests")
      .delete()
      .eq("request_id", requestId);

    if (error) throw error;
  } catch (error) {
    console.error("Error accepting join request:", error);
    throw error;
  }
};

/**
 * Reject a join request: Simply delete the request
 * @param {string} requestId - The ID of the join request
 */
export const rejectTeamJoinRequest = async (requestId) => {
  try {
    const { error } = await supabase
      .from("team_requests")
      .delete()
      .eq("id", requestId);

    if (error) throw error;
  } catch (error) {
    console.error("Error rejecting join request:", error);
    throw error;
  }
};

/**
 * Gets the number of pending join requests for a team.
 * @param {string} teamId
 * @returns {Promise<number>}
 */
export const getJoinRequestCount = async (teamId) => {
  try {
    const { count, error } = await supabase
      .from("team_requests")
      .select("*", { count: "exact", head: true })
      .eq("team_id", teamId);

    if (error) throw error;
    return count ?? 0;
  } catch (error) {
    console.error("Error fetching join request count:", error);
    return 0;
  }
};
