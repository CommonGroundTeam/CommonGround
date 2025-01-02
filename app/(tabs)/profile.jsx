import { Pressable, Text, View } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { router } from "expo-router";

const Profile = () => {
  const auth = getAuth();
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/new-user");
      console.log("User signed out successfully.");
    } catch (error) {
      console.error("Error signing out: ", error.message);
    }
  };

  return (
    <View>
      <Text style={{ padding: 20 }}>Profile</Text>
      <Pressable onPress={handleLogout}>
        <Text>Sign Out</Text>
      </Pressable>
    </View>
  );
};

export default Profile;
