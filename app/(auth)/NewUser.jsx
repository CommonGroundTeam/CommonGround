import { View, Text } from "react-native";
import React from "react";
import { Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import CustomButton from "../../components/CustomButton";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

const NewUser = () => {
  return (
    <SafeAreaView className="bg-background h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full justify-center items-center min-h-[85vh] px-4">
          <View className="flex-row items-center">
            <Image
              source={images.transparent_splash}
              className="w-[80px] h-[80px]"
              resizeMode="contain"
            />

            <Text className="text-4xl text-white">CommonGround</Text>
          </View>

          <View className="relative mt-5">
            <Text className="text-2xl text-white font-bold text-center">
              Discover Endless Possibilities with
              <Text className="text-primary text-3xl"> Common</Text>
              <Text className="text-secondary text-3xl">Ground</Text>
            </Text>
          </View>

          <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
            Where shared passions connect: discover meaningful connections and
            build lasting friendships
          </Text>

          <CustomButton
            title="Continue with Email"
            handlePress={() => router.push("/signIn")}
            containerStyles="w-full mt-7"
          />

          <CustomButton
            title="Sign up for an account"
            handlePress={() => router.push("/signUp")}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default NewUser;
