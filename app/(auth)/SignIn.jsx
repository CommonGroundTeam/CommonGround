import { Keyboard, ScrollView, Text, View } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import { Image } from "react-native";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { Link } from "expo-router";
import { FIREBASE_AUTH } from "../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import CustomKeyboardView from "../../components/CustomKeyboardView";

const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const auth = FIREBASE_AUTH;
  const signInWithFirebase = async () => {
    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
    } catch (error) {
      console.log(error);
      alert("Sign in failed: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-background h-full">
      <CustomKeyboardView inChat={true}>
        <ScrollView>
          <View className="w-full justify-center min-h-[85vh] px-4 my-6">
            <View className="flex-row items-center">
              <Image
                source={images.transparent_splash}
                className="w-[80px] h-[80px]"
                resizeMode="contain"
              />

              <Text className="text-4xl text-white">CommonGround</Text>
            </View>
            <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">
              Log in to CommonGround
            </Text>

            <FormField
              title="Email"
              value={form.email}
              handleChangeText={(e) => setForm({ ...form, email: e })}
              otherStyles="mt-7"
              keyboardType="email-address"
            />

            <FormField
              title="Password"
              value={form.password}
              handleChangeText={(e) => setForm({ ...form, password: e })}
              otherStyles="mt-7"
            />

            <CustomButton
              title="Sign In"
              handlePress={() => signInWithFirebase()}
              containerStyles="mt-7"
              isLoading={isSubmitting}
            />

            <View className="justify-center pt-5 flex-row gap-2">
              <Text className="text-lg text-gray-100 font-pregular">
                Don't have an account?
              </Text>
              <Link
                href="/signUp"
                className="text-lg font-psemibold text-primary"
              >
                Sign Up
              </Link>
            </View>
          </View>
        </ScrollView>
      </CustomKeyboardView>
    </SafeAreaView>
  );
};

export default SignIn;
