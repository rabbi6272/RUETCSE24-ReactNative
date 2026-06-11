import { db } from "./FirebaseConfig";
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  DocumentData,
} from "firebase/firestore";

import { Student } from "../types/Student";

const USERS_COLLECTION = "users";

export async function createUser(
  userData: Omit<Student, "id" | "createdAt" | "updatedAt">,
): Promise<Student> {
  const now = Date.now();
  const cleanData = { ...userData, createdAt: now, updatedAt: now };
  const ref = await addDoc(collection(db, USERS_COLLECTION), cleanData);

  // Update the document to include its own ID
  await updateDoc(ref, { id: ref.id });

  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Failed to create user");
  return docToStudent(snap.data() as DocumentData, snap.id);
}

export async function getAllUsers(): Promise<Student[]> {
  const snaps = await getDocs(collection(db, USERS_COLLECTION));
  if (snaps.empty) return [];
  const users: Student[] = [];
  snaps.forEach((docSnap) => {
    users.push(docToStudent(docSnap.data() as DocumentData, docSnap.id));
  });
  return users;
}

export async function getUserByEmail(email: string): Promise<Student | null> {
  const ref = collection(db, USERS_COLLECTION);
  const q = query(ref, where("email", "==", email));
  const snaps = await getDocs(q);
  if (snaps.empty) return null;
  const first = snaps.docs[0];
  return docToStudent(first.data() as DocumentData, first.id);
}

export async function updateUser(
  id: string,
  updates: Partial<Omit<Student, "id" | "createdAt">>,
): Promise<Student | null> {
  if (!id) return null;

  const ref = doc(db, USERS_COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const payload = toUpdatePayload(updates);
  await updateDoc(ref, payload);
  const updatedSnap = await getDoc(ref);
  if (!updatedSnap.exists()) return null;
  return docToStudent(updatedSnap.data() as DocumentData, updatedSnap.id);
}

export async function deleteUser(id: string): Promise<boolean> {
  const ref = doc(db, USERS_COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return false;
  await deleteDoc(ref);
  return true;
}

function docToStudent(data: DocumentData, docId = ""): Student {
  return {
    id: stringOrEmpty(data.id) || docId,
    fullName: stringOrEmpty(data.fullName),
    nickname: stringOrEmpty(data.nickname),
    email: stringOrEmpty(data.email),
    pincode: stringOrEmpty(data.pincode),
    roll: stringOrEmpty(data.roll),
    bio: stringOrEmpty(data.bio),
    hobby: stringOrEmpty(data.hobby),
    fbProfile: stringOrEmpty(data.fbProfile),
    sec: stringOrEmpty(data.sec),
    bloodGroup: stringOrEmpty(data.bloodGroup),
    mobileNumber: stringOrEmpty(data.mobileNumber),
    profilePicture:
      data.profilePicture &&
      typeof data.profilePicture === "object" &&
      typeof data.profilePicture.publicId === "string" &&
      typeof data.profilePicture.url === "string"
        ? {
            publicId: data.profilePicture.publicId,
            url: data.profilePicture.url,
          }
        : {
            publicId:
              typeof data.profilePicPublicId === "string"
                ? data.profilePicPublicId
                : "",
            url:
              typeof data.profilePicUrl === "string" ? data.profilePicUrl : "",
          },
    createdAt: typeof data.createdAt === "number" ? data.createdAt : Date.now(),
    updatedAt: data.updatedAt,
  };
}

function toUpdatePayload(updates: Partial<Omit<Student, "id" | "createdAt">>) {
  const payload: Record<string, unknown> = {
    updatedAt: Date.now(),
  };

  addStringField(payload, updates, "fullName");
  addStringField(payload, updates, "nickname");
  addStringField(payload, updates, "email");
  addStringField(payload, updates, "pincode");
  addStringField(payload, updates, "roll");
  addStringField(payload, updates, "bio");
  addStringField(payload, updates, "hobby");
  addStringField(payload, updates, "fbProfile");
  addStringField(payload, updates, "sec");
  addStringField(payload, updates, "bloodGroup");
  addStringField(payload, updates, "mobileNumber");

  if (hasOwn(updates, "profilePicture")) {
    payload.profilePicture = {
      publicId: stringOrEmpty(updates.profilePicture?.publicId),
      url: stringOrEmpty(updates.profilePicture?.url),
    };
  }

  return payload;
}

function addStringField(
  payload: Record<string, unknown>,
  updates: Partial<Omit<Student, "id" | "createdAt">>,
  key: keyof Omit<Student, "id" | "createdAt" | "profilePicture" | "updatedAt">,
) {
  if (hasOwn(updates, key)) {
    payload[key] = stringOrEmpty(updates[key]);
  }
}

function hasOwn<T extends object>(value: T, key: PropertyKey): boolean {
  return Object.prototype.hasOwnProperty.call(value, key);
}

function stringOrEmpty(value: unknown): string {
  return typeof value === "string" ? value : "";
}
