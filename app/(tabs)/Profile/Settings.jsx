import { ScrollView, Text, View, TouchableOpacity, Switch } from "react-native";
import React, { useState } from "react";

const Settings = () => {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleLogout = () => {
    console.log("User logged out");
  };

  const handleDeleteAccount = () => {
    console.log("Account deletion initiated");
    // Add confirmation dialog and delete logic here
  };

  const handleAbout = () => {
    console.log("About CommonGround");
  };

  const handleFeedback = () => {
    console.log("Give Us Feedback");
  };

  const handleRateCommonGround = () => {
    console.log("Rate CommonGround");
  };

  const handleCopyToCalendar = () => {
    console.log("Copy events to calendar");
  };

  const toggleNotifications = () => setIsNotificationsEnabled((prev) => !prev);
  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const primaryColor = "#FF6100";

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, alignItems: "center", justifyContent: "start" }}
      className="p-5 bg-white"
    >
      {/* Notifications Preference */}
      <View
        className="flex-row justify-between items-center mb-8"
        style={{ borderBottomWidth: 1, borderBottomColor: "#E5E5E5", paddingBottom: 8 }}
      >
        <Text className="text-xl text-gray-800 mr-4">Notifications</Text>
        <Switch
          value={isNotificationsEnabled}
          onValueChange={toggleNotifications}
          trackColor={{ false: "#767577", true: primaryColor }}
          thumbColor={isNotificationsEnabled ? "#f5dd4b" : "#f4f3f4"}
        />
      </View>

      {/* Dark Mode Preference */}
      <View
        className="flex-row justify-between items-center mb-8"
        style={{ borderBottomWidth: 1, borderBottomColor: "#E5E5E5", paddingBottom: 8 }}
      >
        <Text className="text-xl text-gray-800 mr-4">Dark Mode</Text>
        <Switch
          value={isDarkMode}
          onValueChange={toggleDarkMode}
          trackColor={{ false: "#767577", true: primaryColor }}
          thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
        />
      </View>

      {/* Copy Events to Calendar Button */}
      <TouchableOpacity
        className="bg-[#FF6100] py-3 rounded-lg mt-5 w-11/12"
        onPress={handleCopyToCalendar}
      >
        <Text className="text-white text-lg font-bold text-center">Copy events to calendar</Text>
      </TouchableOpacity>

      {/* About CommonGround Button */}
      <TouchableOpacity
        className="bg-[#FF6100] py-3 rounded-lg mt-5 w-11/12"
        onPress={handleAbout}
      >
        <Text className="text-white text-lg font-bold text-center">About CommonGround</Text>
      </TouchableOpacity>

      {/* Give Us Feedback Button */}
      <TouchableOpacity
        className="bg-[#FF6100] py-3 rounded-lg mt-5 w-11/12"
        onPress={handleFeedback}
      >
        <Text className="text-white text-lg font-bold text-center">Give Us Feedback</Text>
      </TouchableOpacity>

      {/* Rate CommonGround Button */}
      <TouchableOpacity
        className="bg-[#FF6100] py-3 rounded-lg mt-5 w-11/12"
        onPress={handleRateCommonGround}
      >
        <Text className="text-white text-lg font-bold text-center">Rate CommonGround</Text>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity
        className="bg-red-600  py-3 rounded-lg mt-10 w-11/12"
        onPress={handleLogout}
      >
        <Text className="text-white text-lg font-bold text-center">Logout</Text>
      </TouchableOpacity>

      {/* Delete Account Button */}
      <TouchableOpacity
        className="bg-red-600 py-3 rounded-lg mt-5 w-11/12"
        onPress={handleDeleteAccount}
      >
        <Text className="text-white text-lg font-bold text-center">Delete Account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Settings;
