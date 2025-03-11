import React, { useState } from "react";
import {
    View, Text, TextInput, TouchableOpacity, Alert, Keyboard, TouchableWithoutFeedback
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../../supabaseClient";
import { getAuth } from "firebase/auth";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { googleConfig } from "../../../googleConfig";
import 'react-native-get-random-values';

const PLACES_MAPS_API_KEY = googleConfig.apiKey;

const AddEvents = () => {
    const [eventName, setEventName] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [eventLocation, setEventLocation] = useState("");
    const [eventDetails, setEventDetails] = useState("");
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const router = useRouter();

    const handleConfirmDate = (date) => {
        const formattedDate = date.toISOString().split("T")[0];
        setEventDate(formattedDate);
        setDatePickerVisible(false);
    };

    const handleAddEvent = async () => {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (!currentUser) {
            Alert.alert("Error", "You must be logged in to create an event.");
            return;
        }

        const { error } = await supabase.from("events").insert([
            {
                name: eventName,
                date: eventDate,
                location: eventLocation,
                details: eventDetails,
                created_by: currentUser.uid,
                created_at: new Date().toISOString(),
            },
        ]);

        if (error) {
            Alert.alert("Error", "Failed to add event.");
            console.error("Error adding event:", error);
        } else {
            Alert.alert("Success", "Event added successfully!");
            setEventName("");
            setEventDate("");
            setEventLocation("");
            setEventDetails("");
            router.push("/events");
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View className="flex-1 p-5 bg-white">
                <View className="w-full bg-white rounded-xl p-5 shadow-md">
                    <Text className="text-lg font-semibold text-orange-600 mb-2">Event Name</Text>
                    <TextInput
                        placeholder="Enter event name"
                        value={eventName}
                        onChangeText={setEventName}
                        className="w-full p-3 border border-orange-300 rounded-lg bg-white text-base text-gray-800"
                    />

                    <Text className="text-lg font-semibold text-orange-600 mt-4">Date</Text>
                    <TouchableOpacity className="w-full p-3 border border-orange-300 rounded-lg bg-orange-100 mt-1 items-center" onPress={() => setDatePickerVisible(true)}>
                        <Text className={eventDate ? "text-base text-gray-800" : "text-base text-gray-500"}>
                            {eventDate || "Select event date"}
                        </Text>
                    </TouchableOpacity>

                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleConfirmDate}
                        onCancel={() => setDatePickerVisible(false)}
                    />

                    <Text className="text-lg font-semibold text-orange-600 mt-4">Location</Text>
                    <GooglePlacesAutocomplete
                        placeholder="Search for location"
                        query={{ key: PLACES_MAPS_API_KEY, language: "en" }}
                        onPress={(data, details = null) => setEventLocation(data.description)}
                        fetchDetails={true}
                        listViewDisplayed="auto"
                        onFail={(error) => console.error("Places API Error:", error)}
                        onNotFound={() => console.warn("No results found")}
                        styles={{
                            textInput: {
                                padding: 12,
                                borderWidth: 1,
                                borderColor: "#ccc",
                                borderRadius: 8,
                                backgroundColor: "white",
                            },
                            container: {
                                marginBottom: 60,
                            },
                            listView: {
                                position: "absolute",
                                zIndex: 1000,
                                backgroundColor: "white",
                                marginTop: 50,
                            },
                        }}
                    />


                    <Text className="text-lg font-semibold text-orange-600 mt-4">Details</Text>
                    <TextInput
                        placeholder="Describe your event"
                        value={eventDetails}
                        onChangeText={setEventDetails}
                        className="w-full p-3 border border-orange-300 rounded-lg bg-white text-base text-gray-800 h-32"
                        multiline
                    />

                    <TouchableOpacity className="bg-orange-500 py-3 rounded-lg mt-4 items-center" onPress={handleAddEvent}>
                        <Text className="text-lg font-bold text-white">Add Event</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default AddEvents;