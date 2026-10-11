import React from "react";
import { StyleSheet, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// Thay URL bằng resource movies thật do sinh viên tạo trên mockapi.io.
export const API_URL = "https://YOUR-ID.mockapi.io/movies";

// Hàm GET từ starter: giữ tên, logic và cách báo lỗi của đề.
export async function fetchMovies() {
  const res = await fetch(API_URL);
  if (!res.ok) {
    throw new Error("Gọi API thất bại: " + res.status);
  }
  return res.json();
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom", "left", "right"]}>
        <Text style={styles.title}>Movie Watchlist</Text>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f5f7fb" },
  title: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 24,
    fontWeight: "700",
    color: "#183b73",
  },
});
