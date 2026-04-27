// app/info.tsx
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
    Alert,
    Dimensions,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import {
    allRestaurants,
    Restaurant,
    restaurantImages,
} from "../constants/data";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function InfoScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRestaurants, setFilteredRestaurants] =
    useState<Restaurant[]>(allRestaurants);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(allRestaurants[0]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const flatListRef = useRef<FlatList>(null);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === "") {
      setFilteredRestaurants(allRestaurants);
    } else {
      const filtered = allRestaurants.filter((r) =>
        r.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredRestaurants(filtered);
      if (filtered.length > 0) {
        setSelectedRestaurant(filtered[0]);
        setCurrentImageIndex(0);
        if (flatListRef.current)
          flatListRef.current.scrollToOffset({ offset: 0, animated: false });
      } else {
        setSelectedRestaurant(null);
      }
    }
  };

  const handleRestaurantChange = (val: string) => {
    const restaurant = filteredRestaurants.find((r) => r.name === val) || null;
    setSelectedRestaurant(restaurant);
    setCurrentImageIndex(0);
    if (flatListRef.current)
      flatListRef.current.scrollToOffset({ offset: 0, animated: false });
  };

  const openMap = (address: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=$${encodeURIComponent(address)}`;
    Linking.openURL(url).catch(() => Alert.alert("錯誤", "無法開啟地圖"));
  };

  const currentImages = selectedRestaurant
    ? restaurantImages[selectedRestaurant.name] || []
    : [];

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentImageIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <ScrollView style={styles.container} bounces={false}>
      {/* 頂部圖片輪播 */}
      <View style={styles.imageHeader}>
        {currentImages.length > 0 ? (
          <View style={{ flex: 1 }}>
            <FlatList
              ref={flatListRef}
              data={currentImages}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, index) => index.toString()}
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
              renderItem={({ item }) => (
                <Image
                  source={item}
                  style={styles.headerImage}
                  resizeMode="cover"
                />
              )}
            />
            <View style={styles.imageCounter}>
              <Text style={styles.imageCounterText}>
                {currentImageIndex + 1} / {currentImages.length}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.noImageContainer}>
            <Text style={styles.noImageText}>此餐廳尚無照片</Text>
          </View>
        )}
      </View>

      <View style={styles.contentPadding}>
        <TextInput
          style={styles.searchInput}
          placeholder="搜尋餐廳..."
          value={searchQuery}
          onChangeText={handleSearch}
        />

        {filteredRestaurants.length > 0 && selectedRestaurant ? (
          <>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedRestaurant.name}
                onValueChange={handleRestaurantChange}
              >
                {filteredRestaurants.map((data) => (
                  <Picker.Item
                    key={data.name}
                    label={data.name}
                    value={data.name}
                  />
                ))}
              </Picker>
            </View>

            <Text style={styles.restaurantName}>{selectedRestaurant.name}</Text>

            <TouchableOpacity
              style={styles.gridButton}
              onPress={() => {
                if (currentImages.length > 0) {
                  // Expo Router 帶參數跳轉的寫法
                  router.push({
                    pathname: "/image-grid",
                    params: { restaurantName: selectedRestaurant.name },
                  });
                } else {
                  Alert.alert("提示", "此餐廳目前沒有照片喔！");
                }
              }}
            >
              <Ionicons name="grid" size={20} color="#E65100" />
              <Text style={styles.gridButtonText}> 所有圖片 (All Images)</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <InfoRow
              icon="information-circle-outline"
              label="介紹"
              content={selectedRestaurant.desc}
            />
            <InfoRow
              icon="time-outline"
              label="營業時間"
              content={selectedRestaurant.time}
            />
            <InfoRow
              icon="location-outline"
              label="地址 (點擊開啟地圖)"
              content={selectedRestaurant.addr}
              isLink
              onPress={() => openMap(selectedRestaurant.addr)}
            />
          </>
        ) : (
          <Text style={styles.errorText}>
            找不到符合的餐廳，請嘗試其他關鍵字。
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

// 抽取的小元件
const InfoRow = ({ icon, label, content, isLink, onPress }: any) => (
  <TouchableOpacity onPress={onPress} disabled={!isLink} style={styles.infoRow}>
    <Ionicons name={icon} size={28} color={isLink ? "#2196F3" : "#FF9800"} />
    <View style={styles.infoTextContainer}>
      <Text style={[styles.infoLabel, isLink && { color: "#2196F3" }]}>
        {label}
      </Text>
      <Text
        style={[
          styles.infoContent,
          isLink && { color: "#2196F3", textDecorationLine: "underline" },
        ]}
      >
        {content}
      </Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  imageHeader: { height: screenHeight * 0.4, backgroundColor: "orange" },
  headerImage: { width: screenWidth, height: screenHeight * 0.4 },
  noImageContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  noImageText: { fontSize: 24, color: "white" },
  imageCounter: {
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  imageCounterText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 2.0,
  },
  contentPadding: { padding: 20 },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
  },
  restaurantName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FF5722",
    marginBottom: 10,
  },
  gridButton: {
    flexDirection: "row",
    backgroundColor: "#FFE0B2",
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  gridButtonText: { color: "#E65100", fontSize: 16, fontWeight: "bold" },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 25 },
  infoRow: { flexDirection: "row", marginBottom: 25 },
  infoTextContainer: { marginLeft: 15, flex: 1 },
  infoLabel: {
    fontWeight: "bold",
    fontSize: 18,
    color: "black",
    marginBottom: 5,
  },
  infoContent: { fontSize: 16, color: "#333" },
  errorText: { color: "red", fontSize: 16, marginTop: 20 },
});
