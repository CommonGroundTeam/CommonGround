import { TouchableOpacity, View, Text, Platform } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "react-native-vector-icons";
import { router } from "expo-router";

const ios = Platform.OS == "ios";

export default function FindUserHeader() {
  const { top } = useSafeAreaInsets();

  const handleBackPress = () => {
    router.back();
  };

  return (
    <View
      style={{
        paddingTop: ios ? top : top + 10,
        paddingBottom: 10,
        paddingHorizontal: 15,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff", // White background
        borderBottomWidth: 1,
        borderBottomColor: "#ddd", // Divider line
      }}
    >
      {/* Back Button */}
      <TouchableOpacity onPress={handleBackPress} style={{ marginRight: 15 }}>
        <Feather name="chevron-left" size={24} color="#FF6100" />
      </TouchableOpacity>
    </View>
  );
}
