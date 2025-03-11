import { Stack } from "expo-router";

export default function StackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="ViewTeams"
        options={{ tabBarStyle: { display: "none" } }}
      />
      <Stack.Screen
        name="CreateTeam"
        options={{ tabBarStyle: { display: "none" } }}
      />
      <Stack.Screen
        name="JoinTeam"
        options={{ tabBarStyle: { display: "none" } }}
      />
      <Stack.Screen
        name="PendingTeamRequests"
        options={{ tabBarStyle: { display: "none" } }}
      />
    </Stack>
  );
}
