import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import BackArrowHeader from "@/components/headers/BackArrowHeader.jsx";
import { Feather } from "react-native-vector-icons";
import { useAuth } from "@/context/AuthContext.jsx";
import { fetchUserById } from "@/service/UserServiceFirebase";
import { isFriend, removeFriend } from "@/service/FriendServiceFirebase";
import { sendFriendRequest } from "@/service/FriendRequestServiceFirebase";

const UserProfile = () => {
  const [targetUser, setTargetUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFriendStatus, setIsFriendStatus] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const { item } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (item) {
      fetchUserProfile();
    }
  }, [item]);

  const fetchUserProfile = async () => {
    try {
      const parsedItem = JSON.parse(item);
      const userDetails = await fetchUserById(parsedItem?.userId);
      setTargetUser(userDetails);

      const friendStatus = await isFriend(user.uid, userDetails.userId);
      setIsFriendStatus(friendStatus);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Calculate age based on date of birth.
   * @param {string} dob - Date of birth in ISO format.
   * @returns {number | null} - Calculated age or null if invalid DOB.
   */
  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const getGenderInitial = (gender) => {
    switch (gender?.toLowerCase()) {
      case "male":
        return "M";
      case "female":
        return "F";
      default:
        return "O";
    }
  };

  const handleSendFriendRequest = async () => {
    try {
      await sendFriendRequest(user.uid, targetUser.userId);
      setRequestSent(true);
      alert("Friend request sent successfully!");
    } catch (error) {
      alert(error.message || "Error sending friend request.");
    }
  };

  const handleRemoveFriend = async () => {
    try {
      await removeFriend(user.uid, targetUser.userId);
      setIsFriendStatus(false);
      alert("Friend removed successfully.");
    } catch (error) {
      alert(error.message || "Error removing friend.");
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color="#FF6100" />
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <BackArrowHeader />
      <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: 20, alignItems: "center" }}>
          {/* Profile Picture */}
          <Image
            source={
              targetUser?.profilePicture
                ? { uri: targetUser?.profilePicture }
                : require("@/assets/icons/avatar.png")
            }
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              marginBottom: 20,
              backgroundColor: "#ccc",
            }}
          />

          {/* Username */}
          <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 5 }}>
            @{targetUser?.username || "Unknown User"}
          </Text>

          {/* Age and Gender */}
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#555",
              marginBottom: 10,
            }}
          >
            {`${calculateAge(targetUser?.dateOfBirth) || "N/A"} ${
              getGenderInitial(targetUser?.gender) || "O"
            }`}
          </Text>

          {/* Description */}
          {targetUser?.description && (
            <Text
              style={{
                fontSize: 16,
                color: "#555",
                marginBottom: 20,
                textAlign: "center",
              }}
            >
              {targetUser.description}
            </Text>
          )}

          {/* Action Buttons */}
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#FF6100",
              borderRadius: 8,
              marginBottom: 20,
              overflow: "hidden",
              height: 50, // Consistent height
            }}
          >
            {/* Message Button */}
            <TouchableOpacity
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => {
                router.push({
                  pathname: "/Chat/chatRoom",
                  params: { item: JSON.stringify(targetUser) },
                });
              }}
            >
              <Feather name="message-circle" size={20} color="#fff" />
            </TouchableOpacity>

            {/* Friend Request Button */}
            {isFriendStatus ? (
              <TouchableOpacity
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  borderLeftWidth: 1,
                  borderLeftColor: "#fff",
                }}
                onPress={handleRemoveFriend}
              >
                <Feather name="user-x" size={20} color="#fff" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  borderLeftWidth: 1,
                  borderLeftColor: "#fff",
                }}
                onPress={handleSendFriendRequest}
                disabled={requestSent}
              >
                <Feather
                  name="user-plus"
                  size={20}
                  color={requestSent ? "#ccc" : "#fff"}
                />
              </TouchableOpacity>
            )}

            {/* Share Profile Button */}
            <TouchableOpacity
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                borderLeftWidth: 1,
                borderLeftColor: "#fff",
              }}
              onPress={() => {
                alert("Profile shared!");
              }}
            >
              <Feather name="share-2" size={20} color="#fff" />
            </TouchableOpacity>

            {/* Block User Button */}
            <TouchableOpacity
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                borderLeftWidth: 1,
                borderLeftColor: "#fff",
              }}
              onPress={() => {
                alert("User blocked!");
              }}
            >
              <Feather name="slash" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* User Interests */}
          <View
            style={{
              width: "100%",
              marginBottom: 20,
              padding: 15,
              backgroundColor: "#FFE5D0",
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 10,
                color: "#FF6100",
              }}
            >
              Interests
            </Text>
            <Text style={{ fontSize: 16, color: "#555" }}>
              {targetUser?.interests?.join(", ") || "No interests specified."}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default UserProfile;
