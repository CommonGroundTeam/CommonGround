import { supabase } from "@/supabaseClient";
import { getAuth } from "firebase/auth";
import { fetchTeamDetailsFromFirebase } from "./TeamServiceFirebase.jsx";

/**
 * Fetches the teams that a user belongs to from Supabase.
 * @returns {Promise<Array>} - A list of teams the user is part of.
 */
export const fetchUserTeams = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      throw new Error("User not authenticated.");
    }

    const { data, error } = await supabase
      .from("user_teams")
      .select("team_id")
      .eq("user_id", user.uid);

    if (error) {
      console.error("Error fetching user teams from Supabase:", error.message);
      return [];
    }

    // console.log("Raw user_teams data:", data);

    if (!data || data.length === 0) {
      return [];
    }

    // Fetch team details from Firebase based on team IDs
    const teamDetails = await Promise.all(
      data.map(async (team) => {
        const teamData = await fetchTeamDetailsFromFirebase(team.team_id);
        return { ...teamData, id: team.team_id };
      })
    );

    // console.log("Final processed team details:", teamDetails); // 🔹 Debugging log
    return teamDetails;
  } catch (err) {
    console.error("Unexpected error fetching user teams:", err);
    return [];
  }
};

/**
 * Adds a user to a team in Supabase.
 * @param {string} userId - The ID of the user.
 * @param {string} teamId - The ID of the team.
 * @returns {Promise<void>}
 */
export const addUserToTeamInSupabase = async (userId, teamId) => {
  try {
    const { error } = await supabase
      .from("user_teams")
      .insert([{ user_id: userId, team_id: teamId }]);

    if (error) {
      console.error("Error adding user to team:", error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("Unexpected error adding user to team:", error);
    throw error;
  }
};
