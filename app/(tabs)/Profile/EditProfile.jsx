import { ScrollView, Text, View, Image, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker to allow the user to select an image
import Icon from "react-native-vector-icons/FontAwesome";

const EditProfile = () => {
  const [profilePic, setProfilePic] = useState("https://example.com/default-avatar.png"); // Default profile picture
  const [description, setDescription] = useState("This is my description."); // Default description

  // Function to pick an image from the gallery
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert("Permission to access the media library is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfilePic(result.uri); // Set the picked image as the profile picture
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: "center", padding: 20, backgroundColor: "#fff", paddingTop: 40 }}>
      {/* Profile Picture */}
      <TouchableOpacity onPress={pickImage}>
        <Image
          source={{ uri: profilePic }}
          style={{ width: 120, height: 120, borderRadius: 60, marginBottom: 10 }}
        />
        <Text style={{ color: "#007BFF", fontSize: 16 }}>Change Profile Picture</Text>
      </TouchableOpacity>

      {/* Profile Description */}
      <Text style={{ fontSize: 22, fontWeight: "bold", color: "#333", marginVertical: 20 }}>
        Profile Description
      </Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Write something about yourself"
        style={{
          width: "100%",
          height: 120,
          borderColor: "#ccc",
          borderWidth: 1,
          borderRadius: 8,
          padding: 10,
          textAlignVertical: "top",
          fontSize: 16,
        }}
        multiline
      />

      {/* Save Button */}
      <TouchableOpacity
        style={{
          marginTop: 20,
          padding: 10,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FF6100",
          borderRadius: 5,
        }}
        onPress={() => alert("Profile updated!")}
      >
        <Text style={{ color: "#fff", fontSize: 16 }}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditProfile;
