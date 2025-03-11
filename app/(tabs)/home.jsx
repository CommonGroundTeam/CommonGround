import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { fetchUserInterests } from "@/service/UserServiceFirebase";
import { fetchInterests } from "@/service/InterestServiceFirebase";
import { fetchFriendActivities } from "@/service/FriendServiceFirebase";

const Home = () => {
  const router = useRouter();

  const [currUserInterests, setCurrUserInterests] = useState([]);
  const [loadingInterests, setLoadingInterests] = useState(true);
  const [friendActivities, setFriendActivities] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingActivities, setLoadingActivities] = useState(true);

  useEffect(() => {
    // Fetch user interests
    const loadInterests = async () => {
      try {
        const userInterests = await fetchUserInterests();
        setCurrUserInterests(userInterests);
      } catch (error) {
        console.error("Error fetching interests:", error);
      } finally {
        setLoadingInterests(false);
      }
    };

    // Fetch friend activities
    // const loadFriendActivities = async () => {
    //   try {
    //     const activities = await fetchFriendActivities();
    //     setFriendActivities(activities);
    //   } catch (error) {
    //     console.error("Error fetching friend activities:", error);
    //   } finally {
    //     setLoadingActivities(false);
    //   }
    // };

    loadInterests();
    // loadFriendActivities();
  }, []);

  // To be implemented
  const handleSearch = (type) => {
    // router.push(`/search?query=${searchQuery}&type=${type}`);
  };

  const renderInterest = ({ item }) => (
    <TouchableOpacity
      style={{
        padding: 10,
        backgroundColor: "#FFE5D0", // Light orange background
        borderRadius: 10, // Rounded corners for a softer look
        marginVertical: 5,
        marginHorizontal: 5, // Added horizontal margin for spacing between items
        shadowColor: "#000", // Subtle shadow
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 3,
        elevation: 3, // For Android shadow
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold", // Bold text for emphasis
          color: "#FF6100", // Darker orange text color
        }}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  // const renderActivity = ({ item }) => (
  //   <TouchableOpacity
  //     style={{
  //       padding: 15,
  //       backgroundColor: "#FFE5D0", // Light orange background
  //       borderRadius: 10, // Rounded corners for a softer look
  //       marginVertical: 8, // Vertical spacing between activities
  //       marginHorizontal: 10, // Horizontal spacing for consistent layout
  //       shadowColor: "#000", // Subtle shadow for depth
  //       shadowOpacity: 0.1,
  //       shadowOffset: { width: 0, height: 2 },
  //       shadowRadius: 3,
  //       elevation: 3, // For Android shadow
  //     }}
  //   >
  //     <Text
  //       style={{
  //         fontSize: 16,
  //         fontWeight: "bold", // Bold text for emphasis
  //         color: "#FF6100", // Dark orange text color
  //       }}
  //     >
  //       {item.title}
  //     </Text>
  //     <Text
  //       style={{
  //         fontSize: 14,
  //         color: "#444", // Neutral gray for description
  //         marginTop: 5,
  //       }}
  //       numberOfLines={2} // Limit description to 2 lines
  //     >
  //       {item.description}
  //     </Text>
  //     <Text
  //       style={{
  //         fontSize: 12,
  //         color: "#888", // Lighter gray for timestamps or extra info
  //         marginTop: 5,
  //       }}
  //     >
  //       {item.timestamp}
  //     </Text>
  //   </TouchableOpacity>
  // );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView style={{ padding: 20 }}>
        {/* Header */}
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
          Welcome to CommonGround
        </Text>

        {/* Search Section */}
        <View
          style={{
            flexDirection: "row",
            marginBottom: 20,
            alignItems: "center",
          }}
        >
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search for events"
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              padding: 10,
              marginRight: 10,
            }}
          />
          <TouchableOpacity
            onPress={() => handleSearch("general")}
            style={{
              backgroundColor: "#FF6100",
              padding: 10,
              borderRadius: 8,
            }}
          >
            <Feather name="search" size={18} color="white" />
          </TouchableOpacity>
        </View>

        {/* Interests Section */}
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
          Your Interests
        </Text>
        {loadingInterests ? (
          <ActivityIndicator size="small" color="#FF6100" />
        ) : (
          <FlatList
            data={currUserInterests}
            renderItem={renderInterest}
            keyExtractor={(item, index) => `${item}-${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10 }}
          />
        )}
        <TouchableOpacity
          style={{
            marginTop: 10,
            alignSelf: "flex-start",
            backgroundColor: "#FF6100",
            paddingHorizontal: 15,
            paddingVertical: 8,
            borderRadius: 5,
          }}
          onPress={() => router.push("/interests")}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Add Interests
          </Text>
        </TouchableOpacity>

        {/* Friend Activities Section */}
        {/* <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            marginVertical: 20,
          }}
        >
          Friend Activities
        </Text>
        {loadingActivities ? (
          <ActivityIndicator size="small" color="#FF6100" />
        ) : friendActivities.length > 0 ? (
          <FlatList
            data={friendActivities}
            renderItem={renderActivity}
            keyExtractor={(item) => item.id}
          />
        ) : (
          <Text>No recent activities from friends.</Text>
        )} */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
