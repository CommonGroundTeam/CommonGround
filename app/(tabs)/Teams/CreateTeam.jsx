import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

import {
  createTeamInFirebase,
  checkIfTeamExists,
  addUserToTeamInFirebase,
} from "@/service/TeamServiceFirebase";
import { addTeamToUserInFirebase } from "@/service/UserServiceFirebase";
import { addUserToTeamInSupabase } from "@/service/UserTeamServiceSupabase";
import { useAuth } from "@/context/AuthContext";
import BackArrowHeader from "@/components/headers/BackArrowHeader";

const singaporeRegions = ["Central", "North", "North-East", "East", "West"];
const experienceLevels = ["Beginner", "Intermediate", "Advanced"];
const teamPrivacy = ["Open to Everyone", "Invite Only"];

const CreateTeam = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [teamName, setTeamName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [experienceLevel, setExperienceLevel] = useState(experienceLevels[0]);
  const [privacy, setPrivacy] = useState(teamPrivacy[0]);
  const [tags, setTags] = useState("");
  const [location, setLocation] = useState(singaporeRegions[0]);
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);

  const [pickerType, setPickerType] = useState(null);
  const [selectedValue, setSelectedValue] = useState("");

  const handleSubmit = async () => {
    if (!teamName || !category || !description) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const teamExists = await checkIfTeamExists(teamName);
      if (teamExists) {
        alert("Team name is already taken. Please choose another.");
        setLoading(false);
        return;
      }

      const teamId = await createTeamInFirebase(
        teamName,
        category,
        description,
        {
          experienceLevel,
          privacy,
          tags,
          location,
          profilePicture,
          createdBy: user.uid,
        },
        user.uid
      );

      await addUserToTeamInSupabase(user.uid, teamId);
      await addTeamToUserInFirebase(user.uid, teamId);
      await addUserToTeamInFirebase(user.uid, teamId);

      alert(`Team "${teamName}" created successfully!`);
      router.back();
    } catch (error) {
      console.error("Error creating team:", error);
      alert("An error occurred while creating the team.");
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission required to access gallery.");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setProfilePicture(pickerResult.assets[0].uri);
    }
  };

  return (
    <View className="flex-1 bg-white pb-20">
      <BackArrowHeader />
      <ScrollView className="flex-1 p-5" showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-bold mb-5 text-center">
          Create a Team
        </Text>

        {/* Team Name */}
        <Text className="text-base font-semibold mb-1">Team Name *</Text>
        <TextInput
          placeholder="Enter Team Name"
          value={teamName}
          onChangeText={setTeamName}
          className="border border-gray-300 p-3 rounded-lg mb-4 text-base"
        />

        {/* Category */}
        <Text className="text-base font-semibold mb-1">Category *</Text>
        <TextInput
          placeholder="Enter Category"
          value={category}
          onChangeText={setCategory}
          className="border border-gray-300 p-3 rounded-lg mb-4 text-base"
        />

        {/* Description */}
        <Text className="text-base font-semibold mb-1">Team Description *</Text>
        <TextInput
          placeholder="Describe your team..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          className="border border-gray-300 p-3 rounded-lg mb-4 text-base"
        />

        {/* Experience Level Picker */}
        <Text className="text-base font-semibold mb-1">Experience Level</Text>
        <TouchableOpacity
          className="border border-gray-300 p-3 rounded-lg mb-4"
          onPress={() => {
            setPickerType("experience");
            setSelectedValue(experienceLevel);
          }}
        >
          <Text className="text-base text-gray-700">{experienceLevel}</Text>
        </TouchableOpacity>

        <Text className="text-base font-semibold mb-1">Privacy Setting</Text>
        <TouchableOpacity
          className="border border-gray-300 p-3 rounded-lg mb-4"
          onPress={() => {
            setPickerType("privacy");
            setSelectedValue(privacy);
          }}
        >
          <Text className="text-base text-gray-700">{privacy}</Text>
        </TouchableOpacity>

        {/* Tags */}
        <Text className="text-base font-semibold mb-1">Tags</Text>
        <TextInput
          placeholder="Add tags (e.g. Sports, Gaming, Tech)"
          value={tags}
          onChangeText={setTags}
          className="border border-gray-300 p-3 rounded-lg mb-4 text-base"
        />

        {/* Location Picker */}
        <Text className="text-base font-semibold mb-1">Preferred Location</Text>
        <TouchableOpacity
          className="border border-gray-300 p-3 rounded-lg mb-4"
          onPress={() => {
            setPickerType("location");
            setSelectedValue(location);
          }}
        >
          <Text className="text-base text-gray-700">{location}</Text>
        </TouchableOpacity>

        {/* Profile Picture Upload */}
        <Text className="text-base font-semibold mb-1">Profile Picture</Text>
        <TouchableOpacity
          className="bg-orange-500 p-3 rounded-lg mb-4"
          onPress={pickImage}
        >
          <Text className="text-white font-bold text-center">
            Upload Profile Picture
          </Text>
        </TouchableOpacity>
        {profilePicture && (
          <Image
            source={{ uri: profilePicture }}
            className="w-24 h-24 rounded-lg self-center"
          />
        )}

        <TouchableOpacity
          className="bg-orange-500 p-4 rounded-lg items-center mb-5 mt-3"
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-white font-bold text-lg ">Create Team</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={!!pickerType} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white p-5 rounded-t-lg">
            <Picker
              selectedValue={selectedValue}
              onValueChange={(value) => setSelectedValue(value)}
            >
              {(pickerType === "experience"
                ? experienceLevels
                : pickerType === "privacy"
                ? teamPrivacy
                : singaporeRegions
              ).map((item) => (
                <Picker.Item key={item} label={item} value={item} />
              ))}
            </Picker>

            {/* Confirm Button */}
            <TouchableOpacity
              className="bg-orange-500 p-3 rounded-lg mt-3"
              onPress={() => {
                if (pickerType === "experience")
                  setExperienceLevel(selectedValue);
                if (pickerType === "privacy") setPrivacy(selectedValue);
                if (pickerType === "location") setLocation(selectedValue);
                setPickerType(null);
              }}
            >
              <Text className="text-white font-bold text-center">Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CreateTeam;
