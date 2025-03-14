import { Stack } from "expo-router";

export default function StackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChatMenu" />
      <Stack.Screen
        name="FindUser"
        options={{ tabBarStyle: { display: "none" } }}
      />
      <Stack.Screen
        name="ChatRoom"
        options={{ tabBarStyle: { display: "none" } }}
      />
      <Stack.Screen
        name="PendingFriendRequests"
        options={{ tabBarStyle: { display: "none" } }}
      />
    </Stack>
  );
}
