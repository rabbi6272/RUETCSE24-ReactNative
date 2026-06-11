// /**
//  * ProfilesScreen.tsx
//  * React Native (Expo Router + NativeWind + TanStack Query) conversion of
//  * the Next.js profiles page.tsx
//  *
//  * Assumptions / prerequisites:
//  *  - @tanstack/react-query is installed (works in RN unchanged)
//  *  - Your util/Database, util/queryKeys, and types/Student paths resolve
//  *    correctly from this file's location – adjust the imports below if needed.
//  *  - Sub-components (ProfilePageHeader, etc.) are converted separately;
//  *    stubs are provided at the bottom of this file so the screen compiles
//  *    out of the box. Replace them with your real RN components.
//  */

// import React, { useMemo, useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   FlatList,
//   ActivityIndicator,
//   Pressable,
//   StyleSheet,
// } from "react-native";
// import { useQuery } from "@tanstack/react-query";

// // ─── your existing utilities (unchanged, they're plain TS) ──────────────────
// import { getAllUsers } from "../../util/Database";
// import { queryKeys } from "../../util/queryKeys";
// import type { SectionFilter } from "../../types/Student";

// // ---------------------------------------------------------------------------
// // Data helpers  (identical logic to the web version)
// // ---------------------------------------------------------------------------

// async function fetchStudents() {
//   const students = await getAllUsers();
//   return students
//     .filter((s) => s.roll.includes("2403"))
//     .sort((a, b) => a.roll.localeCompare(b.roll));
// }

// function getSectionFromRoll(roll: string): SectionFilter | null {
//   const n = Number(roll);
//   if (n >= 2403001 && n <= 2403060) return "a";
//   if (n >= 2403061 && n <= 2403120) return "b";
//   if (n >= 2403121 && n <= 2403180) return "c";
//   return null;
// }

// // ---------------------------------------------------------------------------
// // Section filter pill
// // ---------------------------------------------------------------------------

// const SECTIONS: SectionFilter[] = ["All", "a", "b", "c"];

// function SectionPill({
//   label,
//   active,
//   onPress,
// }: {
//   label: SectionFilter;
//   active: boolean;
//   onPress: () => void;
// }) {
//   return (
//     <Pressable
//       onPress={onPress}
//       className={`px-4 py-1.5 rounded-full mr-2 border ${
//         active
//           ? "bg-blue-600 border-blue-600"
//           : "bg-transparent border-gray-500"
//       }`}
//     >
//       <Text
//         className={`text-sm font-semibold ${
//           active ? "text-white" : "text-gray-400"
//         }`}
//       >
//         {label === "All" ? "All" : `Section ${label.toUpperCase()}`}
//       </Text>
//     </Pressable>
//   );
// }

// // ---------------------------------------------------------------------------
// // Main screen
// // ---------------------------------------------------------------------------

export default function ProfilesScreen() {}
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedSection, setSelectedSection] = useState<SectionFilter>("All");

//   const {
//     data: allStudents = [],
//     isLoading: studentsLoading,
//     isError,
//   } = useQuery({
//     queryKey: queryKeys.students,
//     queryFn: fetchStudents,
//   });

//   const filteredData = useMemo(() => {
//     const q = searchTerm.trim().toLowerCase();
//     return allStudents.filter((student) => {
//       const matchesSearch =
//         !q ||
//         [
//           student.fullName,
//           student.nickname,
//           student.email,
//           student.roll,
//           student.mobileNumber,
//         ].some((f) => f?.toLowerCase().includes(q));

//       const matchesSection =
//         selectedSection === "All" ||
//         getSectionFromRoll(student.roll) === selectedSection;

//       return matchesSearch && matchesSection;
//     });
//   }, [allStudents, searchTerm, selectedSection]);

//   // ── render ────────────────────────────────────────────────────────────────
//   return (
//     <View className="flex-1 bg-[#1a2421]">
//       {/* Header */}
//       <ProfilePageHeader />

//       {/* Search + stats */}
//       <View className="px-4 pb-2">
//         {/* Search input */}
//         <TextInput
//           className="bg-gray-800 text-white rounded-xl px-4 py-2.5 mb-3"
//           placeholder="Search by name, roll, email…"
//           placeholderTextColor="#9ca3af"
//           value={searchTerm}
//           onChangeText={setSearchTerm}
//           clearButtonMode="while-editing"
//           autoCorrect={false}
//           autoCapitalize="none"
//         />

//         {/* Stats */}
//         <Text className="text-gray-400 text-sm mb-2">
//           Showing{" "}
//           <Text className="text-white font-semibold">{filteredData.length}</Text>{" "}
//           of{" "}
//           <Text className="text-white font-semibold">{allStudents.length}</Text>{" "}
//           students
//         </Text>

//         {/* Section filters */}
//         <View className="flex-row flex-wrap">
//           {SECTIONS.map((s) => (
//             <SectionPill
//               key={s}
//               label={s}
//               active={selectedSection === s}
//               onPress={() => setSelectedSection(s)}
//             />
//           ))}
//         </View>
//       </View>

//       {/* Error banner */}
//       {isError && (
//         <Text className="text-red-500 text-sm text-center mb-3 px-4">
//           Failed to load profiles. Please try again later.
//         </Text>
//       )}

//       {/* Profile grid */}
//       {studentsLoading ? (
//         <View className="flex-1 items-center justify-center">
//           <ActivityIndicator size="large" color="#3b82f6" />
//           <Text className="text-gray-400 mt-3 text-sm">
//             Loading profiles…
//           </Text>
//         </View>
//       ) : (
//         <FlatList
//           data={filteredData}
//           keyExtractor={(item) => item.roll}
//           numColumns={2}          // grid layout; change to 1 for a single-column list
//           columnWrapperStyle={styles.columnWrapper}
//           contentContainerStyle={styles.listContent}
//           renderItem={({ item }) => <ProfileCard student={item} />}
//           ListEmptyComponent={
//             <View className="items-center justify-center py-20">
//               <Text className="text-gray-400 text-base">
//                 No students match your search.
//               </Text>
//             </View>
//           }
//           showsVerticalScrollIndicator={false}
//         />
//       )}

//       {/* Footer */}
//       <ProfilePageFooter />
//     </View>
//   );
// }

// // ---------------------------------------------------------------------------
// // Stub sub-components
// // Replace these with your real converted ProfilePage* components.
// // ---------------------------------------------------------------------------

// function ProfilePageHeader() {
//   return (
//     <View className="px-4 pt-6 pb-3">
//       <Text className="text-white text-2xl font-bold">RUET CSE 24</Text>
//       <Text className="text-gray-400 text-sm">Student Directory</Text>
//     </View>
//   );
// }

// /** Replace with your real student type */
// type Student = Awaited<ReturnType<typeof fetchStudents>>[number];

// function ProfileCard({ student }: { student: Student }) {
//   return (
//     <View className="flex-1 bg-gray-800 rounded-xl m-1.5 p-3 items-center">
//       {/* Avatar placeholder */}
//       <View className="w-14 h-14 rounded-full bg-blue-600 items-center justify-center mb-2">
//         <Text className="text-white text-xl font-bold">
//           {(student.fullName ?? student.nickname ?? "?")[0].toUpperCase()}
//         </Text>
//       </View>

//       <Text
//         className="text-white text-sm font-semibold text-center"
//         numberOfLines={1}
//       >
//         {student.fullName ?? student.nickname}
//       </Text>
//       <Text className="text-gray-400 text-xs text-center" numberOfLines={1}>
//         {student.roll}
//       </Text>
//     </View>
//   );
// }

// function ProfilePageFooter() {
//   return (
//     <View className="py-4 items-center">
//       <Text className="text-gray-500 text-xs">
//         © RUET_CSE_24 — All rights reserved
//       </Text>
//     </View>
//   );
// }

// // ---------------------------------------------------------------------------
// // Styles
// // ---------------------------------------------------------------------------

// const styles = StyleSheet.create({
//   columnWrapper: {
//     paddingHorizontal: 12,
//   },
//   listContent: {
//     paddingBottom: 24,
//   },
// });
