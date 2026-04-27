// components/Restaurants_Card.tsx
import { Image, StyleSheet, Text, View } from "react-native";
import { Restaurant, RESTAURANT_IMAGES } from "../constants/data";

export default function Restaurants_Card({ data }: { data: Restaurant }) {
  // 透過店名拿圖片，如果沒有對應到，看要不要放個預設圖
  const imageSource = RESTAURANT_IMAGES[data.name];

  return (
    <View style={styles.card}>
      {/* 渲染本地圖片 */}
      {imageSource && <Image source={imageSource} style={styles.image} />}

      <View style={styles.infoContainer}>
        <Text style={styles.title}>{data.name}</Text>
        <Text style={styles.time}>營業時間: {data.time}</Text>
        <Text style={styles.address}>{data.addr}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {data.desc}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    // Android 陰影
    elevation: 4,
    // iOS 陰影
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 8,
    backgroundColor: "#e0e0e0", // 圖片還沒載入時的底色
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  time: {
    fontSize: 12,
    color: "#e67e22",
    marginTop: 4,
  },
  address: {
    fontSize: 12,
    color: "#7f8c8d",
    marginTop: 2,
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginTop: 6,
  },
});
