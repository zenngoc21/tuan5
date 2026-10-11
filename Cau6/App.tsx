import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet,
  Switch, Text, TouchableOpacity, View,
} from "react-native";
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
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [posterMode, setPosterMode] = useState(false);
  const [onlyUnwatched, setOnlyUnwatched] = useState(false);

  const loadMovies = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(false);

    try {
      const data: Movie[] = await fetchMovies();
      if (!Array.isArray(data)) throw new Error("API phải trả về một mảng phim");
      setMovies(data);
    } catch {
      setError(true);
    } finally {
      if (isRefresh) setRefreshing(false);
      else setLoading(false);
    }
  }, []);

  useEffect(() => { void loadMovies(); }, [loadMovies]);

  const visibleMovies = useMemo(() => (
    onlyUnwatched ? movies.filter((movie) => !movie.watched) : movies
  ), [movies, onlyUnwatched]);

  const handleSelect = useCallback((id: string) => {
    const movie = movies.find((item) => item.id === id);
    if (movie) Alert.alert(movie.title, `Đạo diễn: ${movie.director}`);
  }, [movies]);

  const onRefresh = useCallback(() => { void loadMovies(true); }, [loadMovies]);
  const onRetry = useCallback(() => { void loadMovies(false); }, [loadMovies]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom", "left", "right"]}>
        <Text style={styles.title}>Movie Watchlist</Text>
        <View style={styles.switchRow}>
          <View style={styles.switchItem}>
            <Text style={styles.switchLabel}>Dạng poster</Text>
            <Switch value={posterMode} onValueChange={setPosterMode} />
          </View>
          <View style={styles.switchItem}>
            <Text style={styles.switchLabel}>Chưa xem</Text>
            <Switch value={onlyUnwatched} onValueChange={setOnlyUnwatched} />
          </View>
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" />
            <Text style={styles.helpText}>Đang tải danh sách phim...</Text>
          </View>
        ) : error ? (
          <View style={styles.center}>
            <Text style={styles.errorText}>Không tải được danh sách phim.</Text>
            <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
              <Text style={styles.retryText}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            key={posterMode ? "poster" : "row"}
            data={visibleMovies}
            keyExtractor={(item) => item.id}
            numColumns={posterMode ? 2 : 1}
            columnWrapperStyle={posterMode ? styles.columns : undefined}
            contentContainerStyle={[
              styles.list,
              visibleMovies.length === 0 && styles.emptyList,
            ]}
            renderItem={({ item }) => (
              <MovieCard
                movie={item}
                layout={posterMode ? "poster" : "row"}
                onSelect={handleSelect}
              />
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Không có phim nào để hiển thị.</Text>
            }
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f5f7fb" },
  title: { fontSize: 24, fontWeight: "700", color: "#183b73",
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10 },
  switchRow: { flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", paddingHorizontal: 16, paddingBottom: 8 },
  switchItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  switchLabel: { fontSize: 14, color: "#333" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  helpText: { marginTop: 10, color: "#666" },
  errorText: { color: "#c62828", fontWeight: "600", marginBottom: 12 },
  retryButton: { backgroundColor: "#1976d2", paddingHorizontal: 18,
    paddingVertical: 10, borderRadius: 8 },
  retryText: { color: "#fff", fontWeight: "700" },
  list: { paddingHorizontal: 12, paddingBottom: 22 },
  emptyList: { flexGrow: 1, justifyContent: "center" },
  emptyText: { textAlign: "center", color: "#666", fontSize: 15 },
  columns: { justifyContent: "space-between" },
});
