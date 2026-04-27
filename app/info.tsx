// app/info.tsx
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
    Alert,
    Dimensions,
    FlatList,
    Image,
    Modal,
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

// 檢查營業時間的輔助函式
const checkIsOpen = (timeStr: string) => {
  if (!timeStr || !timeStr.includes("-")) return false;

  const [startStr, endStr] = timeStr.split("-").map((s) => s.trim());
  const [startH, startM] = startStr.split(":").map(Number);
  const [endH, endM] = endStr.split(":").map(Number);

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  if (startMinutes <= endMinutes) {
    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  } else {
    return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
  }
};

export default function InfoScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRestaurants, setFilteredRestaurants] =
    useState<Restaurant[]>(allRestaurants);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(allRestaurants[0]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 🌟 新增：控制我們客製化下拉選單顯示與否的狀態
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

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

  // 🌟 修改：選擇餐廳時的處理邏輯
  const handleRestaurantSelect = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setCurrentImageIndex(0);
    setIsDropdownVisible(false); // 選完後關閉選單
    if (flatListRef.current)
      flatListRef.current.scrollToOffset({ offset: 0, animated: false });
  };

  const handleRandomPick = () => {
    const openRestaurants = allRestaurants.filter((r) => checkIsOpen(r.time));

    if (openRestaurants.length > 0) {
      const randomIndex = Math.floor(Math.random() * openRestaurants.length);
      const picked = openRestaurants[randomIndex];

      setSearchQuery("");
      setFilteredRestaurants(allRestaurants);
      setSelectedRestaurant(picked);
      setCurrentImageIndex(0);
      if (flatListRef.current)
        flatListRef.current.scrollToOffset({ offset: 0, animated: false });
    } else {
      Alert.alert("提示", "目前這個時間沒有營業中的火雞肉飯喔！");
    }
  };

  const openMap = (address: string) => {
    const url = `http://googleusercontent.com/maps.google.com/3{encodeURIComponent(address)}`;
    Linking.openURL(url).catch(() => Alert.alert("錯誤", "無法開啟地圖"));
  };

  const currentImages = selectedRestaurant
    ? restaurantImages[selectedRestaurant.name] || []
    : [];
  const isSelectedOpen = selectedRestaurant
    ? checkIsOpen(selectedRestaurant.time)
    : false;

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentImageIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <View style={styles.container}>
      <ScrollView bounces={false}>
        {/* 頂部圖片輪播區 */}
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

        {/* 內容區 */}
        <View style={styles.contentPadding}>
          <TextInput
            style={styles.searchInput}
            placeholder="搜尋餐廳..."
            value={searchQuery}
            onChangeText={handleSearch}
          />

          {filteredRestaurants.length > 0 && selectedRestaurant ? (
            <>
              {/* 🌟 1. 客製化選單按鈕 (取代原本的 Picker) */}
              <TouchableOpacity
                style={styles.customPickerButton}
                onPress={() => setIsDropdownVisible(true)}
              >
                <Text style={styles.customPickerText}>
                  {selectedRestaurant.name}
                </Text>
                <Ionicons name="chevron-down" size={24} color="#666" />
              </TouchableOpacity>

              {/* 2. 隨機篩選按鈕 */}
              <TouchableOpacity
                style={styles.randomButton}
                onPress={handleRandomPick}
              >
                <Ionicons name="dice" size={24} color="white" />
                <Text style={styles.randomButtonText}>
                  {" "}
                  隨機挑一間 (營業中)
                </Text>
              </TouchableOpacity>

              {/* 3. 餐廳標題與狀態 */}
              <View style={styles.titleRow}>
                <Text style={styles.restaurantName}>
                  {selectedRestaurant.name}
                </Text>
                <Text
                  style={isSelectedOpen ? styles.openBadge : styles.closedBadge}
                >
                  {isSelectedOpen ? "🟢 營業中" : "❌ 休息中"}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.gridButton}
                onPress={() => {
                  if (currentImages.length > 0) {
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
                <Text style={styles.gridButtonText}>
                  {" "}
                  所有圖片 (All Images)
                </Text>
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

      {/* 🌟 客製化選單的彈出視窗 (Modal) */}
      <Modal
        visible={isDropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsDropdownVisible(false)}
      >
        {/* 半透明黑色背景，點擊可關閉 */}
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsDropdownVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>選擇餐廳</Text>
            </View>
            <FlatList
              data={filteredRestaurants}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => {
                const isOpen = checkIsOpen(item.time);
                const isSelected = item.name === selectedRestaurant?.name;
                return (
                  <TouchableOpacity
                    style={[
                      styles.dropdownItem,
                      isSelected && styles.dropdownItemSelected,
                    ]}
                    onPress={() => handleRestaurantSelect(item)}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        isSelected && { fontWeight: "bold", color: "#FF5722" },
                      ]}
                    >
                      {item.name}
                    </Text>
                    {/* 這裡就是完美靠右對齊的關鍵！ */}
                    <Text
                      style={
                        isOpen
                          ? styles.dropdownOpenText
                          : styles.dropdownClosedText
                      }
                    >
                      {isOpen ? "🟢 營業中" : "❌ 休息中"}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
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

  // 🌟 新增：客製化選單按鈕樣式
  customPickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  customPickerText: { fontSize: 16, color: "#333" },

  // 🌟 新增：Modal 相關樣式
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    maxHeight: "70%",
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    padding: 15,
    backgroundColor: "#FF9800",
    alignItems: "center",
  },
  modalTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  dropdownItem: {
    flexDirection: "row",
    justifyContent: "space-between", // 完美左右對齊
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dropdownItemSelected: { backgroundColor: "#FFF3E0" },
  dropdownItemText: { fontSize: 16, color: "#333" },
  dropdownOpenText: { fontSize: 14, color: "#4CAF50", fontWeight: "500" },
  dropdownClosedText: { fontSize: 14, color: "#F44336", fontWeight: "500" },

  randomButton: {
    flexDirection: "row",
    backgroundColor: "#FF5722",
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  randomButtonText: { color: "white", fontSize: 18, fontWeight: "bold" },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  restaurantName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FF5722",
    flex: 1,
  },
  openBadge: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4CAF50",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
  closedBadge: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#F44336",
    backgroundColor: "#FFEBEE",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
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
  infoContent: { fontSize: 16, color: "#333", lineHeight: 22 },
  errorText: { color: "red", fontSize: 16, marginTop: 20 },
});
