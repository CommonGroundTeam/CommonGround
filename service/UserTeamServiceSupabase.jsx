import { supabase } from "@/supabaseClient";

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

/**
 * Removes a user from a specific team in the `user_teams` table in Supabase.
 * This function deletes the corresponding row where `user_id` matches the given `userId`
 * and `team_id` matches the given `teamId`, effectively revoking the user's membership from the team.
 *
 * @param {string} userId - The unique identifier of the user to be removed.
 * @param {string} teamId - The unique identifier of the team from which the user is being removed.
 * @throws {Error} Throws an error if the deletion fails.
 * @returns {Promise<void>} Resolves if the user is successfully removed, otherwise throws an error.
 */
export const removeUserFromTeamInSupabase = async (userId, teamId) => {
  try {
    const { error } = await supabase
      .from("user_teams")
      .delete()
      .match({ user_id: userId, team_id: teamId });

    if (error) {
      throw new Error(`Failed to remove user from Supabase: ${error.message}`);
    }

    console.log(
      `Successfully removed user ${userId} from team ${teamId} in Supabase.`
    );
  } catch (error) {
    console.error("Error removing user from team in Supabase:", error);
    throw error;
  }
};
