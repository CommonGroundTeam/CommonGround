import { View, Text, Platform } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { blurhash } from "../utils/common";
import { Menu, MenuOptions, MenuTrigger } from "react-native-popup-menu";
import { MenuItem } from "./CustomMenuItems";
import { Feather } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

const ios = Platform.OS == "ios";

export default function ChatHeader({ user, router }) {
  const { top } = useSafeAreaInsets();
  const handleProfile = () => {};
  return (
    <View
      style={{
        paddingTop: top + 10,
        marginTop: ios ? -50 : 0,
      }}
      className="flex-row justify-between items-center px-5 bg-primary pb-3"
    >
      <TouchableOpacity onPress={() => router.back()}>
        <Feather name="chevron-left" size={24} color="white" />
      </TouchableOpacity>
      <View>
        <Text
          styles={{ fontSize: hp(3) }}
          className="text-2xl text-white font-bold"
        >
          {user.username}
        </Text>
      </View>
      <Menu>
        <MenuTrigger>
          <Image
            style={{ height: hp(4.3), aspectRatio: 1, borderRadius: 100 }}
            source="https://picsum.photos/seed/696/3000/2000"
            placeholder={{ blurhash }}
            transition={500}
          />
        </MenuTrigger>
        <MenuOptions>
          <MenuItem
            text="profile"
            action={handleProfile}
            value={null}
            icon={<Feather name="user" size={hp(2.5)} color="#FF6100" />}
          />
        </MenuOptions>
      </Menu>
    </View>
  );
}
