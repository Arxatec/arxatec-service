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
  gender: "male" | "female";
  birthDate: string;
  budget: string;
  urgencyLevel: string;
  communicationPreference: string;
}
