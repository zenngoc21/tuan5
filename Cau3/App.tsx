import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import MovieCard, { Movie } from "./components/MovieCard";

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
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadMovies = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data: Movie[] = await fetchMovies();
      setMovies(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadMovies(); }, [loadMovies]);

  const handleSelect = useCallback((id: string) => {
    const movie = movies.find((item) => item.id === id);
    if (movie) Alert.alert(movie.title, `Đạo diễn: ${movie.director}`);
  }, [movies]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom", "left", "right"]}>
        <Text style={styles.title}>Movie Watchlist</Text>
        {loading ? (
          <View style={styles.center}><ActivityIndicator size="large" /></View>
        ) : error ? (
          <View style={styles.center}>
            <Text style={styles.errorText}>Không tải được danh sách phim.</Text>
            <TouchableOpacity style={styles.button} onPress={loadMovies}>
              <Text style={styles.buttonText}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={movies}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => <MovieCard movie={item} onSelect={handleSelect} />}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f5f7fb" },
  title: { fontSize: 24, fontWeight: "700", color: "#183b73", padding: 16 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  errorText: { color: "#c62828", marginBottom: 14 },
  button: { backgroundColor: "#1976d2", borderRadius: 8, padding: 12 },
  buttonText: { color: "#fff", fontWeight: "700" },
  list: { paddingHorizontal: 12, paddingBottom: 20 },
});
