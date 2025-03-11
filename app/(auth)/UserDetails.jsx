import React, { useState, useEffect } from "react";
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { Button } from "react-native-paper";
import { KeyboardAvoidingView, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../context/AuthContext";
import { updateUser, fetchInterests } from "@/service/UserServiceFirebase";

const UserDetails = () => {
  const router = useRouter();
  const { isSigningUp, setIsSigningUp } = useAuth();

  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [interests, setInterests] = useState([]);
  const [description, setDescription] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [allInterests, setAllInterests] = useState([]);

  const defaultProfilePicture =
    "https://t3.ftcdn.net/jpg/00/64/67/80/360_F_64678017_zUpiZFjj04cnLri7oADnyMH0XBYyQghG.jpg";

  useEffect(() => {
    if (!isSigningUp) {
      router.replace("home");
    }

    const loadInterests = async () => {
      try {
        const interestsList = await fetchInterests();
        setAllInterests(interestsList);
      } catch (error) {
        Alert.alert("Error", "Unable to fetch interests. Please try again.");
      }
    };

    loadInterests();
  }, [isSigningUp, router]);

  const handleSubmit = async () => {
    const missingFields = [];

    if (!dateOfBirth) missingFields.push("Date of Birth");
    if (!gender) missingFields.push("Gender");
    if (!interests.length) missingFields.push("Interests");

    if (missingFields.length > 0) {
      Alert.alert(
        "Missing Information",
        `Please complete the following fields before submitting:\n ${missingFields.join(
          "\n- "
        )}`
      );
      return;
    }

    const userProfilePicture = profilePicture || defaultProfilePicture;

    const userData = {
      dateOfBirth,
      gender,
      interests,
      description,
      profilePicture: userProfilePicture,
    };

    try {
      await updateUser(userData);
      Alert.alert("Success", "Your profile has been created!");
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", "An error occurred while creating your profile.");
      console.error("Error creating user:", error);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onChangeDate = (date) => {
    setShowDatePicker(false);
    setDateOfBirth(moment(date).format("YYYY-MM-DD"));
  };

  const renderStepIndicator = () => {
    const steps = ["•", "•", "•", "•", "•"]; // Added another dot for the new step
    steps[currentStep] = (
      <Text style={{ fontWeight: "bold", fontSize: 24 }}>•</Text>
    );
    return steps.map((dot, index) => (
      <Text key={index} style={{ fontSize: 24, marginHorizontal: 5 }}>
        {dot}
      </Text>
    ));
  };

  const toggleInterest = (interest) => {
    setInterests((prevInterests) => {
      if (prevInterests.includes(interest)) {
        return prevInterests.filter((item) => item !== interest);
      } else {
        return [...prevInterests, interest];
      }
    });
  };

  const pickImage = async () => {
    // Ask for permission to access the camera roll
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission required",
        "We need permission to access your photos."
      );
      return;
    }

    // Open the image picker
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setProfilePicture(pickerResult.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    // Ask for permission to access the camera
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission required",
        "We need permission to use your camera."
      );
      return;
    }

    // Take a photo
    let cameraResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!cameraResult.canceled) {
      setProfilePicture(cameraResult.assets[0].uri);
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View
          style={{
            flex: 1,
            padding: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flexGrow: 1,
              width: "100%",
            }}
          >
            {/* Title */}
            <Text className="text-3xl font-bold text-[#FF6100] text-center mb-5">
              Tell Us About Yourself!
            </Text>

            {/* Step Content */}
            <View style={{ width: "100%", maxWidth: 400 }}>
              {currentStep === 0 && (
                <View className="mb-5">
                  <Text
                    style={{ fontWeight: "bold", textAlign: "center" }}
                    className="text-lg mb-2"
                  >
                    Date of Birth
                  </Text>
                  <TouchableOpacity
                    className="border border-gray-300 rounded-lg p-3 text-lg w-full"
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text className="text-gray-700 text-center">
                      {dateOfBirth || "Select Date"}
                    </Text>
                  </TouchableOpacity>

                  {showDatePicker && (
                    <DateTimePickerModal
                      isVisible={showDatePicker}
                      mode="date"
                      onConfirm={onChangeDate}
                      onCancel={() => setShowDatePicker(false)}
                    />
                  )}
                </View>
              )}

              {currentStep === 1 && (
                <View className="mb-5">
                  <Text
                    style={{ fontWeight: "bold", textAlign: "center" }}
                    className="text-lg mb-2"
                  >
                    Gender
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      marginBottom: 10,
                    }}
                  >
                    {["Male", "Female", "Others"].map((option) => (
                      <TouchableOpacity
                        key={option}
                        onPress={() => setGender(option)}
                        style={{
                          backgroundColor:
                            gender === option ? "#FF6100" : "#F3F4F6",
                          paddingVertical: 10,
                          paddingHorizontal: 20,
                          borderRadius: 20,
                          marginHorizontal: 5,
                          borderWidth: 1,
                          borderColor:
                            gender === option ? "#FF6100" : "#D1D5DB",
                        }}
                      >
                        <Text
                          style={{
                            color: gender === option ? "white" : "black",
                          }}
                        >
                          {option}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {currentStep === 2 && (
                <View className="mb-5">
                  <Text
                    style={{ fontWeight: "bold", textAlign: "center" }}
                    className="text-lg mb-2"
                  >
                    Select Your Interests
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      justifyContent: "center", // Centers the interests items
                    }}
                  >
                    {allInterests.map((interest, index) => (
                      <TouchableOpacity
                        key={index}
                        style={{
                          backgroundColor: interests.includes(interest)
                            ? "#FF6100"
                            : "#F3F4F6",
                          paddingVertical: 10,
                          paddingHorizontal: 20,
                          borderRadius: 5,
                          marginVertical: 5,
                          marginHorizontal: 5,
                          alignItems: "center",
                        }}
                        onPress={() => toggleInterest(interest)}
                      >
                        <Text
                          style={{
                            color: interests.includes(interest)
                              ? "white"
                              : "black",
                          }}
                        >
                          {interest}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {currentStep === 3 && (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 20,
                    width: "100%",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      textAlign: "center",
                      marginBottom: 10,
                    }}
                    className="text-lg"
                  >
                    Write a Short Description About Yourself
                  </Text>
                  <TextInput
                    style={{
                      borderColor: "#ccc",
                      borderWidth: 1,
                      borderRadius: 8,
                      padding: 10,
                      textAlignVertical: "top",
                      width: "90%", // Ensures input box doesn't touch the edges
                      minHeight: 100, // Ensure a proper height for multiline input
                      textAlign: "center", // Centralizes the text inside the input
                      fontSize: 16,
                      backgroundColor: "#F3F4F6",
                    }}
                    placeholder="Write something about yourself..."
                    value={description}
                    onChangeText={setDescription}
                    multiline
                  />
                </View>
              )}

              {/* New Step for Profile Picture */}
              {currentStep === 4 && (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 20,
                    width: "100%",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      textAlign: "center",
                      marginBottom: 10,
                    }}
                    className="text-lg"
                  >
                    Profile Picture
                  </Text>

                  {profilePicture ? (
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: 20,
                      }}
                    >
                      <Image
                        source={{ uri: profilePicture }}
                        style={{
                          width: 100,
                          height: 100,
                          borderRadius: 50,
                          marginBottom: 10,
                        }}
                      />
                    </View>
                  ) : (
                    <Text
                      style={{
                        textAlign: "center",
                        color: "#999",
                        fontSize: 16,
                        marginBottom: 20, // Space between text and buttons
                      }}
                    >
                      No profile picture selected
                    </Text>
                  )}

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      marginTop: 10,
                    }}
                  >
                    <Button
                      mode="outlined"
                      onPress={pickImage}
                      style={{
                        marginHorizontal: 10,
                        borderColor: "#FF6100", // Orange border
                        backgroundColor: "#FF6100", // Orange background
                      }}
                      labelStyle={{
                        color: "white", // White text color
                      }}
                    >
                      From Gallery
                    </Button>

                    <Button
                      mode="outlined"
                      onPress={takePhoto}
                      style={{
                        marginHorizontal: 10,
                        borderColor: "#FF6100", // Orange border
                        backgroundColor: "#FF6100", // Orange background
                      }}
                      labelStyle={{
                        color: "white", // White text color
                      }}
                    >
                      Take a Photo
                    </Button>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Step Indicator */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            {renderStepIndicator()}
          </View>

          {/* Grouped Navigation Buttons */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            {currentStep > 0 && (
              <Button
                onPress={handlePrev}
                mode="contained"
                style={{
                  backgroundColor: "#FF6100",
                  marginHorizontal: 10,
                }}
              >
                Prev
              </Button>
            )}

            <Button
              onPress={currentStep === 4 ? handleSubmit : handleNext} // Call handleSubmit on the last step
              mode="contained"
              style={{
                backgroundColor: "#FF6100",
                marginHorizontal: 10,
              }}
            >
              {currentStep === 4 ? "Submit" : "Next"}
            </Button>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default UserDetails;
