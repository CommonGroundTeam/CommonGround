import { View, Text, Platform } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

const ios = Platform.OS == "ios";

export default function Header({ text }) {
  const { top } = useSafeAreaInsets();
  return (
    <View
      style={{ paddingTop: ios ? top : top + 10 }}
      className="justify-center items-center px-5 bg-primary pb-6"
    >
      <View>
        <Text
          style={{ fontSize: hp(3) }}
          className="text-2xl text-white font-bold"
        >
          {text}
        </Text>
      </View>
    </View>
  );
}
