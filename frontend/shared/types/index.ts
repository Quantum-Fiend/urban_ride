export type VehicleType = 'ECONOMY' | 'COMFORT' | 'XL' | 'BLACK' | 'EV';

export type TripStatus =
  | 'IDLE'
  | 'REQUESTED'
  | 'MATCHING'
  | 'ACCEPTED'
  | 'ARRIVED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export type PaymentMethod = 'WALLET' | 'CREDIT_CARD' | 'UPI' | 'CASH';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: 'RIDER' | 'DRIVER' | 'ADMIN';
  walletBalance: number;
}

export interface Driver {
  id: number;
  userId: number;
  driverName: string;
  email: string;
  phoneNumber: string;
  vehicleModel: string;
  vehicleColor: string;
  licensePlate: string;
  vehicleType: VehicleType;
  status: 'OFFLINE' | 'AVAILABLE' | 'ON_TRIP' | 'SUSPENDED';
  currentLatitude: number;
  currentLongitude: number;
  rating: number;
  totalTrips: number;
  totalEarnings: number;
  isVerified: boolean;
}

export interface TierEstimate {
  tier: VehicleType;
  tierName: string;
  description: string;
  fare: number;
  baseFare: number;
  surgeMultiplier: number;
  etaMinutes: number;
  capacity: number;
}

export interface PricingEstimate {
  distanceKm: number;
  durationMinutes: number;
  tiers: TierEstimate[];
}

export interface Trip {
  id: number;
  riderId: number;
  riderName: string;
  riderPhone: string;
  driverId?: number;
  driverName?: string;
  driverPhone?: string;
  vehicleModel?: string;
  licensePlate?: string;
  driverLatitude?: number;
  driverLongitude?: number;
  pickupLatitude: number;
  pickupLongitude: number;
  dropoffLatitude: number;
  dropoffLongitude: number;
  pickupAddress: string;
  dropoffAddress: string;
  status: TripStatus;
  vehicleType: VehicleType;
  fare: number;
  surgeMultiplier: number;
  distanceKm: number;
  durationMinutes: number;
  otp: string;
  paymentMethod: PaymentMethod;
  paymentStatus: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
  requestedAt: string;
  acceptedAt?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface PlatformStats {
  totalUsers: number;
  totalDrivers: number;
  onlineDrivers: number;
  activeTrips: number;
  completedTrips: number;
  totalGrossRevenue: number;
  averageRating: number;
  surgeIndex: number;
  recentActivities: {
    eventType: string;
    description: string;
    timestamp: string;
    status: string;
  }[];
}
