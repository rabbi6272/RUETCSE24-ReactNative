import { SafeAreaView } from "react-native-safe-area-context";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Animated,
  StyleSheet,
  Platform,
  useColorScheme,
} from "react-native";

import { names } from "@/constants/names";
interface PlacedName {
  id: number;
  name: string;
  color: string;
  fontSize: number;
  x: number;
  y: number;
  opacity: Animated.Value;
  scale: Animated.Value;
}

const COLORS = ["#7FFF00", "#00FFFF", "#FF69B4", "#FFD700", "#FF4500"];
const DRUM_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-";

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getRandom(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function DrumTitle() {
  const [displayText, setDisplayText] = useState("CSE-24");
  const targetText = "CSE-24";

  useEffect(() => {
    const drumLength = DRUM_CHARS.length;

    const wheels = targetText.split("").map((char, index) => ({
      target: char,
      startOffset: Math.floor(Math.random() * drumLength),
      spins: 9 + index * 2 + Math.floor(Math.random() * 3),
    }));

    let frame = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    const tick = () => {
      const nextText = wheels
        .map((wheel, index) => {
          if (wheel.target === " ") return " ";
          const localFrame = frame - index * 3;
          if (localFrame < 0) return DRUM_CHARS[wheel.startOffset % drumLength];
          if (localFrame >= wheel.spins) return wheel.target;
          return DRUM_CHARS[(wheel.startOffset + localFrame) % drumLength];
        })
        .join("");

      setDisplayText(nextText);

      const finished = wheels.every((wheel, index) => {
        if (wheel.target === " ") return true;
        return frame - index * 3 >= wheel.spins;
      });

      if (finished) {
        setDisplayText(targetText);
        return;
      }

      frame += 1;
      timeoutId = setTimeout(tick, 50);
    };

    timeoutId = setTimeout(tick, 220);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <Text
      className="my-1 text-center font-lato"
      style={{
        fontSize: 28,
        color: "#e5e7eb",
        letterSpacing: 1.5,
        fontFamily: "Lato",
        fontWeight: "700",
      }}
      accessibilityLabel="Animated title"
    >
      {displayText}
    </Text>
  );
}

function NameChip({ item }: { item: PlacedName }) {
  useEffect(() => {
    Animated.parallel([
      Animated.timing(item.opacity, {
        toValue: 0.8,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.spring(item.scale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, [item]);

  return (
    <Animated.Text
      style={[
        styles.nameChip,
        {
          color: item.color,
          fontSize: item.fontSize,
          left: item.x,
          top: item.y,
          opacity: item.opacity,
          transform: [{ scale: item.scale }],
        },
      ]}
    >
      {item.name}
    </Animated.Text>
  );
}

// const colorScheme = useColorScheme();

export default function HomeScreen() {
  const [placedNames, setPlacedNames] = useState<PlacedName[]>([]);
  const [mappedCount, setMappedCount] = useState(0);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const idRef = useRef(0);

  // Build placed names once we know the container size
  const buildNames = useCallback((width: number, height: number) => {
    if (width === 0 || height === 0) return;

    const shuffled = shuffleArray(names);
    // Simple non-overlapping placement using a cell grid (approx 8px cells)
    const CELL = 8;
    const cols = Math.ceil(width / CELL);
    const rows = Math.ceil(height / CELL);
    const occupied = new Uint8Array(cols * rows);

    const isOccupied = (x: number, y: number, w: number, h: number) => {
      const x0 = Math.floor(x / CELL);
      const y0 = Math.floor(y / CELL);
      const x1 = Math.min(Math.ceil((x + w) / CELL), cols - 1);
      const y1 = Math.min(Math.ceil((y + h) / CELL), rows - 1);
      for (let c = x0; c <= x1; c++)
        for (let r = y0; r <= y1; r++) if (occupied[r * cols + c]) return true;
      return false;
    };

    const markOccupied = (x: number, y: number, w: number, h: number) => {
      const x0 = Math.floor(x / CELL);
      const y0 = Math.floor(y / CELL);
      const x1 = Math.min(Math.ceil((x + w) / CELL), cols - 1);
      const y1 = Math.min(Math.ceil((y + h) / CELL), rows - 1);
      for (let c = x0; c <= x1; c++)
        for (let r = y0; r <= y1; r++) occupied[r * cols + c] = 1;
    };

    const results: PlacedName[] = [];
    let count = 0;

    shuffled.forEach((name) => {
      const fontSize = getRandom(12, 18);
      const estW = name.length * fontSize * 0.65;
      const estH = fontSize * 1.3;

      let placed = false;
      for (let attempt = 0; attempt < 300; attempt++) {
        const x = getRandom(10, Math.max(10, width - estW - 10));
        const y = getRandom(10, Math.max(10, height - estH - 10));
        if (!isOccupied(x, y, estW, estH)) {
          markOccupied(x, y, estW, estH);
          results.push({
            id: idRef.current++,
            name: name.toUpperCase(),
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            fontSize,
            x,
            y,
            opacity: new Animated.Value(0),
            scale: new Animated.Value(0.5),
          });
          count++;
          placed = true;
          break;
        }
      }
      // If no room found, skip (mirrors original behaviour)
      void placed;
    });

    setPlacedNames(results);
    setMappedCount(count);
  }, []);

  const onContainerLayout = useCallback(
    (e: { nativeEvent: { layout: { width: number; height: number } } }) => {
      const { width, height } = e.nativeEvent.layout;
      if (width !== containerSize.width || height !== containerSize.height) {
        setContainerSize({ width, height });
        buildNames(width, height);
      }
    },
    [containerSize, buildNames],
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#090909" }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1">
          {/* Header section */}
          <View
            style={{
              paddingHorizontal: 5,
              paddingTop: 8,
              alignItems: "center",
            }}
          >
            <Image
              source={require("@/assets/images/RuetLogo.png")}
              style={styles.logo}
              resizeMode="contain"
              accessibilityLabel="Rajshahi University of Engineering and Technology logo"
            />

            <DrumTitle />

            <Text
              style={{
                fontSize: 20,
                color: "#d1d5db",
                lineHeight: 22,
                textAlign: "center",
                fontWeight: "600",
              }}
              accessibilityLabel="University and batch information"
            >
              Rajshahi University of Engineering and Technology
            </Text>

            <Text
              style={{
                color: "#d1d5db",
                fontFamily: "Lato",
                textAlign: "justify",
                paddingHorizontal: 15,
                paddingTop: 10,
              }}
              accessibilityLabel="Description"
            >
              <Text style={{ fontWeight: "bold" }}>RUET CSE 24</Text> is the
              student directory and batch archive for the Computer Science and
              Engineering 2024 cohort of Rajshahi University of Engineering and
              Technology.
            </Text>
          </View>

          {/* "Powered by" label */}
          <Text
            style={{ color: "#6b7280", textAlign: "center", marginTop: 15 }}
          >
            Powered By ↓
          </Text>


          <View
            className="mx-auto my-5 overflow-hidden w-full"
            style={styles.namesContainer}
            onLayout={onContainerLayout}
          >
            {placedNames.map((item) => (
              <NameChip key={item.id} item={item} />
            ))}
          </View>


          <View style={{ alignItems: "center", gap: 4 }}>
            {/* Mapped count */}
            <Text
              style={{ color: "#3b82f6", fontWeight: "700", fontSize: 16 }}
            >
              Mapped: {mappedCount}/180
            </Text>
            <Text
              style={{ color: "#9ca3af" }}
            >
              * Refresh the page for updated appearance.
            </Text>
            {/* Footer */}
            <Text
              style={{ color: "#d1d5db" }}
            >
              All rights reserved by RUET_CSE_24
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  logo: {
    width: 150,
    height: 150,
  },
  namesContainer: {
    height: 1000,
    position: "relative",
  },
  nameChip: {
    position: "absolute",
    fontWeight: "semibold",
    fontFamily: "Lato",
  },
});
