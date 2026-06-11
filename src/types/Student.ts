export interface Student {
  id: string;
  fullName: string;
  nickname: string;
  email: string;
  pincode: string;
  roll: string;
  bio?: string;
  bloodGroup?: string;
  fbProfile?: string;
  mobileNumber?: string;
  hobby?: string;
  profilePicture?: {
    publicId: string;
    url: string;
  };
  sec?: string;
  createdAt: number;
  updatedAt?: number;
}

export type SectionFilter = "All" | "a" | "b" | "c";
