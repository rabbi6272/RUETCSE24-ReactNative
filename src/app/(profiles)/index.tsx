import React, { useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  Animated,
} from "react-native";
import { Image } from "expo-image";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ─── your existing utilities (unchanged) ────────────────────────────────────
import { getAllUsers } from "@/utils/Database";
import { queryKeys } from "@/utils/queryKeys";
import type { Student, SectionFilter } from "@/types/Student";

// ─── Design tokens ───────────────────────────────────────────────────────────
const COLORS = {
  // Surfaces
  bg: "#0f1512",
  surface: "#1a2421",
  card: "#1e2c28",
  cardBorder: "#2a3d38",

  // Accent
  accent: "#6366f1",
  accentMuted: "rgba(99,102,241,0.15)",

  // Text
  textPrimary: "#f1f5f4",
  textSecondary: "#8a9e99",
  textMuted: "#556660",

  // Status
  error: "#f87171",
  shimmer: "#243330",
} as const;

const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

// No fixed CARD_WIDTH needed — cards use flex: 1 inside columnWrapper

// ─── Data helpers ─────────────────────────────────────────────────────────────
async function fetchStudents() {
  const students = await getAllUsers();
  return students
    .filter((s) => s.roll.includes("2403"))
    .sort((a, b) => a.roll.localeCompare(b.roll));
}

function getSectionFromRoll(roll: string): SectionFilter | null {
  const n = Number(roll);
  if (n >= 2403001 && n <= 2403060) return "a";
  if (n >= 2403061 && n <= 2403120) return "b";
  if (n >= 2403121 && n <= 2403180) return "c";
  return null;
}

function getInitials(fullName: string): string {
  return fullName
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
}

// Deterministic accent color per student (not random — stable across renders)
const AVATAR_ACCENTS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#0ea5e9",
  "#14b8a6",
  "#f59e0b",
];
function getAvatarColor(roll: string): string {
  const n = parseInt(roll.slice(-3), 10) || 0;
  return AVATAR_ACCENTS[n % AVATAR_ACCENTS.length];
}

// ─── Section pills ────────────────────────────────────────────────────────────
const SECTIONS: SectionFilter[] = ["All", "a", "b", "c"];

function SectionPill({
  label,
  active,
  onPress,
}: {
  label: SectionFilter;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={
        label === "All" ? "All sections" : `Section ${label.toUpperCase()}`
      }
      style={({ pressed }) => [
        styles.pill,
        active && styles.pillActive,
        pressed && styles.pillPressed,
      ]}
    >
      <Text style={[styles.pillText, active && styles.pillTextActive]}>
        {label === "All" ? "All" : `Sec ${label.toUpperCase()}`}
      </Text>
    </Pressable>
  );
}

// ─── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  const opacity = React.useRef(new Animated.Value(0.4)).current;

  React.useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View style={[styles.skeletonCard, { opacity }]}>
      <View style={styles.skeletonAvatar} />
      <View style={styles.skeletonLine} />
      <View
        style={[styles.skeletonLine, { width: "55%", marginTop: SPACING.xs }]}
      />
      <View style={[styles.skeletonPill, { marginTop: SPACING.sm }]} />
    </Animated.View>
  );
}

// ─── Profile card ─────────────────────────────────────────────────────────────
function ProfileCard({ student }: { student: Student }) {
  const avatarColor = getAvatarColor(student.roll);
  const initials = getInitials(student.fullName || student.nickname || "?");

  return (
    <Pressable
      // style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      style={styles.card}
      accessibilityRole="button"
      accessibilityLabel={`View profile of ${student.fullName}`}
    >
      {/* Blood group badge */}
      {!!student.bloodGroup && (
        <View style={styles.bloodBadge}>
          <Text style={styles.bloodBadgeText}>{student.bloodGroup}</Text>
        </View>
      )}

      {/* Avatar */}
      <View style={styles.avatarWrapper}>
        {student.profilePicture?.url ? (
          <Image
            source={{ uri: student.profilePicture.url }}
            style={styles.avatarImage}
            contentFit="cover"
            transition={250}
          />
        ) : (
          <View
            style={[
              styles.avatarFallback,
              { backgroundColor: avatarColor + "22" },
            ]}
          >
            <Text style={[styles.avatarInitials, { color: avatarColor }]}>
              {initials}
            </Text>
          </View>
        )}
        {/* Accent ring */}
        <View
          style={[styles.avatarRing, { borderColor: avatarColor + "55" }]}
        />
      </View>

      {/* Name */}
      <Text style={styles.cardName} numberOfLines={1}>
        {student.fullName}
      </Text>

      {/* Nickname */}
      {!!student.nickname && (
        <Text style={styles.cardNickname} numberOfLines={1}>
          "{student.nickname}"
        </Text>
      )}

      {/* Roll chip */}
      <View style={styles.rollChip}>
        <Text style={styles.rollChipText}>{student.roll || "—"}</Text>
      </View>
    </Pressable>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ query }: { query: string }) {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🔍</Text>
      <Text style={styles.emptyTitle}>No students found</Text>
      {query ? (
        <Text style={styles.emptySubtitle}>
          No results for "{query}". Try a different name or roll number.
        </Text>
      ) : (
        <Text style={styles.emptySubtitle}>
          Adjust your section filter to see more profiles.
        </Text>
      )}
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function ProfilesPage() {
  const insets = useSafeAreaInsets();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSection, setSelectedSection] = useState<SectionFilter>("All");

  const {
    data: allStudents = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: queryKeys.students,
    queryFn: fetchStudents,
  });

  const filteredData = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return allStudents.filter((student) => {
      const matchesSearch =
        !q ||
        [
          student.fullName,
          student.nickname,
          student.email,
          student.roll,
          student.mobileNumber,
        ].some((f) => f?.toLowerCase().includes(q));
      const matchesSection =
        selectedSection === "All" ||
        getSectionFromRoll(student.roll) === selectedSection;
      return matchesSearch && matchesSection;
    });
  }, [allStudents, searchTerm, selectedSection]);

  const renderCard = useCallback(
    ({ item }: { item: Student }) => <ProfileCard student={item} />,
    [],
  );

  const keyExtractor = useCallback((item: Student) => item.id || item.roll, []);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Batch Directory</Text>
          <Text style={styles.headerSubtitle}>RUET · CSE · 2024</Text>
        </View>
        {!isLoading && (
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{allStudents.length}</Text>
          </View>
        )}
      </View>

      {/* ── Search ─────────────────────────────────────────────────────── */}
      <View style={styles.searchRow}>
        <View style={styles.searchInputWrapper}>
          {/* Search icon */}
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search name, roll, email…"
            placeholderTextColor={COLORS.textMuted}
            value={searchTerm}
            onChangeText={setSearchTerm}
            clearButtonMode="while-editing"
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
            accessibilityLabel="Search students"
          />
        </View>
      </View>

      {/* ── Section filter + stats ──────────────────────────────────────── */}
      <View style={styles.filterRow}>
        <View style={styles.pillRow}>
          {SECTIONS.map((s) => (
            <SectionPill
              key={s}
              label={s}
              active={selectedSection === s}
              onPress={() => setSelectedSection(s)}
            />
          ))}
        </View>
        <Text style={styles.statsText}>
          {filteredData.length}/{allStudents.length}
        </Text>
      </View>

      {/* ── Error banner ────────────────────────────────────────────────── */}
      {isError && (
        <Pressable style={styles.errorBanner} onPress={() => refetch()}>
          <Text style={styles.errorText}>Failed to load. Tap to retry.</Text>
        </Pressable>
      )}

      {/* ── Grid ────────────────────────────────────────────────────────── */}
      {isLoading ? (
        <View style={styles.skeletonGrid}>
          {Array.from({ length: 8 }).map((_, i) => (
            <View
              key={i}
              style={{
                flexDirection: "row",
                gap: SPACING.sm,
                paddingHorizontal: SPACING.md,
                marginBottom: SPACING.sm,
              }}
            >
              <View style={{ width: "50%" }}>
                <SkeletonCard />
              </View>
              <View style={{ width: "50%" }}>
                <SkeletonCard />
              </View>
            </View>
          ))}
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={keyExtractor}
          renderItem={renderCard}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + SPACING.lg },
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<EmptyState query={searchTerm} />}
          // Performance
          removeClippedSubviews
          maxToRenderPerBatch={12}
          windowSize={7}
          initialNumToRender={8}
        />
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.textSecondary,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  countBadge: {
    backgroundColor: COLORS.accentMuted,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: COLORS.accent + "30",
  },
  countBadgeText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.accent,
  },

  // Search
  searchRow: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingHorizontal: SPACING.md,
    height: 48,
  },
  searchIcon: {
    fontSize: 20,
    color: COLORS.textMuted,
    marginRight: SPACING.sm,
    lineHeight: 24,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    paddingVertical: 0,
  },

  // Filters
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  pillRow: {
    flexDirection: "row",
    gap: SPACING.md,
  },
  pill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    backgroundColor: "transparent",
    minWidth: 44,
    alignItems: "center",
  },
  pillActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  pillPressed: {
    opacity: 0.75,
  },
  pillText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  pillTextActive: {
    color: "#fff",
  },
  statsText: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.textMuted,
  },

  // Error
  errorBanner: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: "rgba(248,113,113,0.12)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(248,113,113,0.25)",
    alignItems: "center",
  },
  errorText: {
    fontSize: 13,
    color: COLORS.error,
    fontWeight: "500",
  },

  // Skeleton
  skeletonCard: {
    width: "100%",
    backgroundColor: COLORS.card,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: SPACING.md,
    alignItems: "center",
    // Shadow (Android elevation + iOS shadow)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  skeletonGrid: {
    flexDirection: "column",
    paddingTop: SPACING.xs,
  },
  skeletonAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.shimmer,
    marginBottom: SPACING.sm,
  },
  skeletonLine: {
    height: 12,
    width: "80%",
    borderRadius: 6,
    backgroundColor: COLORS.shimmer,
  },
  skeletonPill: {
    height: 22,
    width: "50%",
    borderRadius: 11,
    backgroundColor: COLORS.shimmer,
  },

  // Grid
  columnWrapper: {
    gap: SPACING.sm, // horizontal gap between the two cards
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm, // vertical gap between rows
  },
  listContent: {
    paddingTop: SPACING.xs,
    paddingHorizontal: 0, // padding is on columnWrapper, not here
  },

  card: {
    width: "50%",
    backgroundColor: COLORS.card,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: SPACING.md,
    alignItems: "center",
    // Shadow (Android elevation + iOS shadow)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  cardPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.975 }],
  },

  // Blood badge
  bloodBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(239,68,68,0.15)",
    borderRadius: 100,
    paddingHorizontal: 9,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.25)",
  },
  bloodBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#f87171",
    letterSpacing: 0.3,
  },

  // Avatar
  avatarWrapper: {
    marginHorizontal: "auto",
    position: "relative",
    marginBottom: SPACING.sm,
    marginTop: SPACING.xs,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 555,
  },
  avatarFallback: {
    width: 100,
    height: 100,
    borderRadius: 555,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  avatarRing: {
    position: "absolute",
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    width: 100 + 6,
    height: 100 + 6,
    borderRadius: 555 + 3,
    borderWidth: 1.5,
  },

  // Card text
  cardName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
    textAlign: "center",
    width: "100%",
    marginTop: 2,
  },
  cardNickname: {
    fontSize: 11,
    fontWeight: "500",
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 2,
    fontStyle: "italic",
  },
  rollChip: {
    marginTop: SPACING.sm,
    backgroundColor: COLORS.accentMuted,
    borderRadius: 80,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: COLORS.accent + "25",
  },
  rollChipText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.accent,
    letterSpacing: 0.3,
  },

  // Empty
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    paddingHorizontal: SPACING.xl,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },
});
