// app/index.tsx (或者是 App.tsx)
import { FlatList, SafeAreaView, StatusBar, StyleSheet } from "react-native";
import Restaurants_Card from "../../components/Restaurants_Card";
import { RESTAURANTS_DATA } from "../../constants/data";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={RESTAURANTS_DATA}
        // 使用店名當作唯一值 key (前提是店名不重複)
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => <Restaurants_Card data={item} />}
        // 增加列表底部空白，滑動體驗更好
        contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
    // 避開 Android 頂部狀態列遮擋
    marginTop: StatusBar.currentHeight || 0,
  },
});
