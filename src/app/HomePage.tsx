"use client"; // remove this line if not using Expo Router's "use client" convention

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  Animated,
  Dimensions,
  StyleSheet,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const names = [
  "FATIN",
  "MUTTAQEEN",
  "MUGDHA",
  "SABID",
  "SUPRIO",
  "HASIBUR",
  "MOJIBUR",
  "SHAFAYET",
  "EMAM",
  "MOULY",
  "TANVIR",
  "MAHATHIR",
  "SIFAT",
  "DIPANNITA",
  "SADIA",
  "ABHI",
  "MAHIN",
  "DEEP",
  "MASUM",
  "SUMIT",
  "SHIHAB",
  "KHANDAKER",
  "MOHIDUL",
  "RAFI",
  "FAHMID",
  "UTSHA",
  "TANJIMA",
  "NAHIN",
  "AMIO",
  "SOMUDRO",
  "MUNTASIR",
  "ARNOB",
  "ELEM",
  "ISRAT",
  "AFNAN",
  "SHOYKOT",
  "MALIHA",
  "AHSAN",
  "NEHAL",
  "MAHINUL",
  "JIMAN",
  "MARWA",
  "TAHMIM",
  "DIBYA",
  "YASIR",
  "RASHEDUL",
  "TIUS",
  "SHAMI",
  "OMI",
  "SADMAN",
  "SUDIPTO",
  "ANONNA",
  "AZAN",
  "NIRJAS",
  "SUPANTHO",
  "KAYES",
  "PARTHA",
  "ARSHI",
  "ARIFUL",
  "RABBI",
  "OVIJIT",
  "SABBIR",
  "SEAM",
  "SAMIR",
  "TANBIR",
  "NAEEM",
  "ARPITA",
  "KABIR",
  "SAROAR",
  "JIM",
  "PRONOB",
  "MAHMODUL",
  "SAMI",
  "BOBY",
  "SAKIB",
  "ROMJAN",
  "MEHEDI",
  "MAHERAB",
  "ANUP",
  "TASNIMUL",
  "RIMA",
  "SHAHRIAR",
  "MUBINUR",
  "LIMA",
  "ABID",
  "HIRA",
  "RAHI",
  "DAUD",
  "ANIKA",
  "FARIHA",
  "SHADMAN",
  "RAHIDUL",
  "ABIR",
  "MONTAHA",
  "NAHID",
  "ASHIK",
  "AYMAN",
  "BRISTY",
  "MAHADI",
  "IMRUL",
  "PRANTO",
  "MUKIT",
  "MITHI",
  "ARIAN",
  "NUMAN",
  "ATHAI",
  "MUHIUDDIN",
  "TAUSIF",
  "SOURAV",
  "RIFAT",
  "AMY",
  "ISHRAK",
  "RAISA",
  "SHARIQUL",
  "MAHI",
  "NELOY",
  "URBOSHI",
  "AURPON",
  "ROHAN",
  "SAIMUS",
  "MUNNA",
  "FARDIN",
  "SHADHIN",
  "ZARIN",
  "TUSHER",
  "PRANTIK",
  "NIRJHAR",
  "WASIF",
  "SHAFAYAT",
  "SHEFAUL",
  "AFTAB",
  "TASFIA",
  "CHAITY",
  "NAVID",
  "YEASIR",
  "SUJOY",
  "REZA",
  "MAHIM",
  "AHNAF",
  "KULSUM",
  "ADNAN",
  "RAFIO",
  "SAJID",
  "AHIN",
  "BITTO",
  "PRITAM",
  "MADIHA",
  "RIJU",
  "ANTOR",
  "NIHAL",
  "AHAD",
  "KHUTBA",
  "FOUZIA",
  "FAHAD",
  "FAKID",
  "MAHMUD",
  "SINAN",
  "RAHUL",
  "SAID",
  "RABIB",
  "RAIHAN",
  "MIRAJUL",
  "MAHBUB",
  "SORNA",
  "WRIVU",
  "SHANTO",
  "OHANA",
  "MAMUN",
  "RATUL",
  "BAISHAKHY",
];

const COLORS = ["#7FFF00", "#00FFFF", "#FF69B4", "#FFD700", "#FF4500"];
const DRUM_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Drum-roll title animation rendered as controlled RN Text */
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
    <Text className="text-5xl font-bold my-2 text-white text-center font-mono">
      {displayText}
    </Text>
  );
}

/** Single animated name chip */
function NameChip({ item }: { item: PlacedName }) {
  useEffect(() => {
    Animated.parallel([
      Animated.timing(item.opacity, {
        toValue: 0.8,
        duration: 1000,
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

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------

export default function HomePage() {
  const router = useRouter();
  const [placedNames, setPlacedNames] = useState<PlacedName[]>([]);
  const [mappedCount, setMappedCount] = useState(0);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const buttonScale = useRef(new Animated.Value(1)).current;
  const idRef = useRef(0);

  // Pulsing "profiles" button animation
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(buttonScale, {
          toValue: 1.08,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(buttonScale, {
          toValue: 1,
          duration: 750,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [buttonScale]);

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
      const fontSize = getRandom(12, 24);
      // Estimate text width: ~0.65× fontSize per char is a decent RN mono approx
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
    <View className="flex-1 ">
      {/* Floating profiles button */}
      <Animated.View
        style={[
          styles.profilesButtonWrapper,
          { transform: [{ scale: buttonScale }] },
        ]}
      >
        <Pressable
          // onPress={() => router.push("./profiles")}
          style={styles.profilesButton}
          accessibilityLabel="Browse RUET CSE 24 student profiles"
        >
          <Text className="text-white text-2xl font-bold">Profiles</Text>
        </Pressable>
      </Animated.View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header section */}
        <View className="w-full text-[#fff] p-2.5 flex items-center">
          <Image
            source={require("../../assets/images/RuetLogo.png")}
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel="Rajshahi University of Engineering and Technology logo"
          />

          <DrumTitle />

          <Text
            style={styles.text}
            className="text-lg font-medium mt-1 text-white text-center"
          >
            Rajshahi University of Engineering and Technology CSE-2024 Batch
          </Text>

          <Text className="text-base mt-2.5 px-5 text-white text-center max-w-xl">
            <Text className="font-bold">RUET CSE 24</Text> is the student
            directory and batch archive for the Computer Science and Engineering
            2024 cohort of Rajshahi University of Engineering and Technology.
          </Text>
        </View>

        {/* "Powered by" label */}
        <Text className="text-white text-center text-base">Powered By ↓</Text>

        {/* Names cloud container */}
        <View
          className="mx-auto my-5 rounded-sm overflow-hidden w-full"
          style={styles.namesContainer}
          onLayout={onContainerLayout}
        >
          {placedNames.map((item) => (
            <NameChip key={item.id} item={item} />
          ))}
        </View>

        {/* Mapped count */}
        <Text className="mt-4 text-lg font-bold text-[#adff2f] text-center">
          Mapped: {mappedCount}
        </Text>

        <Text className="text-center text-gray-400 text-xs">
          * Refresh the page for updated appearance.
        </Text>

        {/* Footer */}
        <View className="my-2 items-center">
          <Text className="text-white text-xs font-semibold">
            All rights reserved by RUET_CSE_24
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles  (only what NativeWind can't express cleanly)
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  logo: {
    width: 150,
    height: 150,
  },
  namesContainer: {
    height: 600, // ~h-150 equivalent; adjust to taste
    position: "relative",
  },
  nameChip: {
    position: "absolute",
    fontWeight: "bold",
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
  },
  profilesButtonWrapper: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 999,
  },
  profilesButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 8,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
