import { create } from "zustand";
import type { Student } from "../types/Student";

interface StudentStore {
  studentInfo: Student;
  setStudentInfo: (student: Student) => void;
  clearStudent: () => void;
  allStudents: Student[];
  setAllStudents: (students: Student[]) => void;
  addStudent: (student: Student) => void;
  updateStudent: (id: string, student: Student) => void;
  deleteStudent: (id: string) => void;
}

export const useStudentStore = create<StudentStore>((set: any) => {
  return {
    studentInfo: {
      id: "",
      fullName: "",
      nickname: "",
      email: "",
      hobby: "",
      fbProfile: "",
      bio: "",
      pincode: "",
      sec: "",
      profilePicture: {
        publicId: "",
        url: "",
      },
      createdAt: Date.now(),
      roll: "",
      bloodGroup: "",
      mobileNumber: "",
    },
    setStudentInfo: (student: Student) => set({ studentInfo: student }),
    clearStudent: () =>
      set({
        studentInfo: {
          id: "",
          fullName: "",
          nickname: "",
          email: "",
          hobby: "",
          fbProfile: "",
          bio: "",
          pincode: "",
          sec: "",
          profilePicture: {
            publicId: "",
            url: "",
          },
          createdAt: Date.now(),
          roll: "",
          bloodGroup: "",
          mobileNumber: "",
        },
      }),
    allStudents: [],
    setAllStudents: (students: Student[]) => set({ allStudents: students }),
    addStudent: (student: Student) =>
      set((state: StudentStore) => ({
        allStudents: [...state.allStudents, student],
      })),
    updateStudent: (id: string, student: Student) =>
      set((state: StudentStore) => ({
        allStudents: state.allStudents.map((s) => (s.id === id ? student : s)),
      })),
    deleteStudent: (id: string) =>
      set((state: StudentStore) => ({
        allStudents: state.allStudents.filter((s) => s.id !== id),
      })),
  };
});
