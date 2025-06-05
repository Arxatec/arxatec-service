export interface AttorneyFee {
  id: number;
  lawyer_id: number;
  service_category_id: number;
  fee: number;
}

export interface WorkSchedule {
  id: number;
  lawyer_id: number;
  day: string;
  open_time: string;
  close_time: string;
}

export interface Location {
  fullAddress: string;
  latitude: number;
  longitude: number;
}

export interface Lawyer {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string;
  licenseNumber: string;
  gender: string;
  birthDate: string;
  specialty: string;
  experience: number;
  biography: string;
  linkedin: string;
  preferredClient: string;
  location: Location;
  communicationPreference: string;
  attorneyFees: {
    id: number;
    lawyer_id: number;
    service_category: string;
    fee: number;
  }[];
  workSchedules: WorkSchedule[];
}
