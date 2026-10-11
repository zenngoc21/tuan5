import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface Movie {
  id: string;
  title: string;
  director: string;
  year: number;
  rating: number;
  poster: string;
  watched: boolean;
}

export interface MovieCardProps {
  movie: Movie;
  onSelect: (id: string) => void;
}

function MovieCard({ movie, onSelect }: MovieCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onSelect(movie.id)}>
      <Image source={{ uri: movie.poster }} style={styles.poster} />
      <View style={styles.info}>
        <Text style={styles.name}>{movie.title}</Text>
        <Text style={styles.meta}>{movie.director} · {movie.year}</Text>
        <Text>⭐ {Number(movie.rating).toFixed(1)}</Text>
        <Text>{movie.watched ? "✅ Đã xem" : "🎬 Chưa xem"}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default React.memo(MovieCard);

const styles = StyleSheet.create({
  card: { flexDirection: "row", backgroundColor: "#fff", borderRadius: 10,
    marginBottom: 10, padding: 10, elevation: 2 },
  poster: { width: 70, height: 105, borderRadius: 7, backgroundColor: "#e4e9f1" },
  info: { flex: 1, justifyContent: "center", paddingLeft: 12 },
  name: { fontSize: 17, fontWeight: "700", color: "#1f2937" },
  meta: { color: "#667085", marginVertical: 5 },
});
