export interface Location {
  country: string;
  state: string;
  city: string;
  latitude: number;
  longitude: number;
  fullAddress: string;
  postalCode: string;
}

export interface Client {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  profileImage: string;
  birthDate: string;
  gender: string;
  budgetRange: string;
  urgencyLevel: string;
  requirementType: string;
  communicationChannel: string;
  receiveNotifications: boolean;
  notificationChannels: string;
  location: Location;
}
