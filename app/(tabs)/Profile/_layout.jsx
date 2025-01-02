import { Stack } from "expo-router";

const ProfileLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="ProfilePage" options={{ title: "Profile" }} />
      <Stack.Screen name="Events" options={{ title: "Events" }} />
      <Stack.Screen name="FriendsList" options={{ title: "Friends" }} />
    </Stack>
  );
};

export default ProfileLayout;
