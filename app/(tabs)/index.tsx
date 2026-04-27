// app/(tabs)/index.tsx
import { useRouter } from "expo-router";
import React from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* 請確保 assets/images/ 內有這張圖片，或者換成你有的圖 */}
      <ImageBackground
        source={require("../../assets/images/火雞達人.jpg")}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <View style={styles.content}>
          <Text style={styles.title}>
            {"Chiayi Turkey Rice"}
            {"\n"}
            {"Explorer"}
          </Text>
          <Text style={styles.subtitle}>
            {"A Local's Guide to Delicious Food"}
          </Text>

          <TouchableOpacity
            style={styles.button}
            // 這裡改成 Expo Router 的寫法，會導向 app/info.tsx
            onPress={() => router.push("/info")}
          >
            <Text style={styles.buttonText}>Explore Now</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1, width: "100%", height: "100%" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "white",
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    textShadowColor: "black",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    marginBottom: 10,
  },
  subtitle: {
    color: "white",
    fontSize: 18,
    fontStyle: "italic",
    marginBottom: 50,
  },
  button: {
    backgroundColor: "#FFAB40",
    paddingHorizontal: 50,
    paddingVertical: 15,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    color: "black",
  },
});
