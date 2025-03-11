import { Stack } from "expo-router";

const ProfileLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="ProfilePage" options={{ title: "Profile" }} />
      <Stack.Screen name="Events" options={{ title: "Events" }} />
      <Stack.Screen name="FriendsList" options={{ title: "Friends" }} />
      <Stack.Screen name="EditProfile" options={{ title: "EditProfile" }} />
      <Stack.Screen name="Settings" options={{ title: "Settings" }} />
      <Stack.Screen name="AddEvents" options={{ title: "AddEvents" }} />
    </Stack>
  );
};

export default ProfileLayout;
