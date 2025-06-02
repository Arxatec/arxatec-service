export interface Location {
  fullAddress: string;
  latitude: number;
  longitude: number;
}

export interface Client {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string;
  location: Location;
  occupation: string;
  ageRange: string;
  gender: "male" | "female";
  birthDate: string;
  budget: number;
  urgencyLevel: string;
  communicationPreference: string;
}
