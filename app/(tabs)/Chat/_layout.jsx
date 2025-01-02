import { Stack } from "expo-router";

export default function StackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="chatMenu" options={{ title: "Chat Menu" }} />
      <Stack.Screen
        name="chatRoom"
        options={{ title: "Chat Room", tabBarStyle: { display: "none" } }}
      />
    </Stack>
  );
}
