import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function AuthLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="NewUser"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="SignIn"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="SignUp"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
}
