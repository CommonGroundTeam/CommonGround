import { View, Text, Platform } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Feather } from "react-native-vector-icons";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { blurhash } from "@/utils/common";

const ChatHeader = ({ user, router }) => {
  const { top } = useSafeAreaInsets();
  const ios = Platform.OS == "ios";

  const handleProfile = () => {
    // Navigate to the UserProfile screen
    router.push({
      pathname: "/Chat/userProfile", // Adjust the route to your `UserProfile` component path
      params: { item: JSON.stringify(user) },
    });
  };

  return (
    <SafeAreaView
      style={{
        paddingTop: ios ? -top : 0,
        paddingBottom: ios ? -25 : 5,
        paddingHorizontal: 15,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
      }}
    >
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ marginRight: 15 }}
      >
        <Feather name="chevron-left" size={24} color="#FF6100" />
      </TouchableOpacity>

      {/* Centered Username */}
      <View
        style={{
          flex: 1,
          alignItems: "center", // Center horizontally
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "#333",
          }}
        >
          {user.username}
        </Text>
      </View>

      {/* Profile Image */}
      <TouchableOpacity onPress={handleProfile}>
        <Image
          style={{
            height: hp(4.3),
            width: hp(4.3),
            borderRadius: hp(2.15),
            borderWidth: 1,
            borderColor: "#ddd",
          }}
          source={{
            uri:
              user.profilePicture || "https://picsum.photos/seed/696/3000/2000",
          }}
          placeholder={{ blurhash }}
          transition={500}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ChatHeader;
