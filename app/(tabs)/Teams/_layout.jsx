import { Stack } from "expo-router";

export default function StackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="ViewTeams"
        options={{ tabBarStyle: { display: "none" } }}
      />
      <Stack.Screen
        name="ManageTeams"
        options={{ tabBarStyle: { display: "none" } }}
      />
    </Stack>
  );
}
