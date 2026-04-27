// app/image-grid.tsx
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Dimensions, FlatList, Image, StyleSheet, View } from "react-native";
import { restaurantImages } from "../constants/data";

const { width } = Dimensions.get("window");
const gap = 8;
const itemSize = (width - gap * 4) / 3;

export default function ImageGridScreen() {
  // 接收傳遞過來的參數
  const { restaurantName } = useLocalSearchParams<{ restaurantName: string }>();
  const images = restaurantName ? restaurantImages[restaurantName] || [] : [];

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        keyExtractor={(_, index) => index.toString()}
        numColumns={3}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <Image source={item} style={styles.image} resizeMode="cover" />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  listContainer: { padding: gap },
  image: {
    width: itemSize,
    height: itemSize,
    margin: gap / 2,
    borderRadius: 8,
  },
});
