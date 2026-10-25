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
  layout?: "row" | "poster";
  onSelect: (id: string) => void;
}

function MovieCard({ movie, layout = "row", onSelect }: MovieCardProps) {
  const ratingText = Number(movie.rating).toFixed(1);

  if (layout === "poster") {
    return (
      <TouchableOpacity style={styles.posterCard} onPress={() => onSelect(movie.id)}>
        <View style={styles.posterWrap}>
          <Image source={{ uri: movie.poster }} style={styles.posterImage} />
          <View style={styles.ratingBadge}>
            <Text style={styles.badgeText}>⭐ {ratingText}</Text>
          </View>
          {movie.watched && (
            <View style={styles.watchedBadge}>
              <Text style={styles.badgeText}>✓ Đã xem</Text>
            </View>
          )}
        </View>
        <Text style={styles.posterTitle} numberOfLines={2}>{movie.title}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.rowCard} onPress={() => onSelect(movie.id)}>
      <Image source={{ uri: movie.poster }} style={styles.rowImage} />
      <View style={styles.rowInfo}>
        <Text style={styles.rowTitle}>{movie.title}</Text>
        <Text style={styles.meta}>{movie.director} · {movie.year}</Text>
        <Text style={styles.rating}>⭐ {ratingText}</Text>
        <Text style={movie.watched ? styles.watched : styles.unwatched}>
          {movie.watched ? "✅ Đã xem" : "🎬 Chưa xem"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default React.memo(MovieCard);

const styles = StyleSheet.create({
  rowCard: { flexDirection: "row", backgroundColor: "#fff", borderRadius: 10,
    padding: 10, marginBottom: 10, elevation: 2 },
  rowImage: { width: 70, height: 105, borderRadius: 7, backgroundColor: "#e4e9f1" },
  rowInfo: { flex: 1, paddingLeft: 12, justifyContent: "center" },
  rowTitle: { fontWeight: "700", fontSize: 17, color: "#1f2937" },
  meta: { marginTop: 5, color: "#667085" },
  rating: { marginTop: 5, fontWeight: "600" },
  watched: { color: "#15803d", marginTop: 5, fontWeight: "600" },
  unwatched: { color: "#444", marginTop: 5 },
  posterCard: { width: "48.5%", flexGrow: 0, flexShrink: 0, marginBottom: 14 },
  posterWrap: { width: "100%", aspectRatio: 2 / 3, overflow: "hidden",
    borderRadius: 10, backgroundColor: "#e4e9f1" },
  posterImage: { width: "100%", height: "100%" },
  ratingBadge: { position: "absolute", top: 6, right: 6,
    borderRadius: 12, paddingHorizontal: 7, paddingVertical: 4,
    backgroundColor: "rgba(20,20,20,0.85)" },
  watchedBadge: { position: "absolute", bottom: 6, left: 6,
    borderRadius: 12, paddingHorizontal: 7, paddingVertical: 4,
    backgroundColor: "#15803d" },
  badgeText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  posterTitle: { marginTop: 6, color: "#1f2937", fontWeight: "700" },
});
