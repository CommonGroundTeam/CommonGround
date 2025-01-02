import "../gesture-handler";
import { FIREBASE_APP, FIREBASE_AUTH, FIRESTORE_DB } from "../firebaseConfig";
import { useAuth } from "@/context/AuthContext";
import { View, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";

const App = () => {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        className="bg-white"
      >
        <ActivityIndicator size="large" color="#FF6100" />
      </View>
    );
  }

  return null;
};

export default App;
