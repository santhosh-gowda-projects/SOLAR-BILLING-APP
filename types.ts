
export type UserRole = 'OWNER' | 'ADMIN' | 'TENANT_VIEWER' | 'GUEST';

export interface User {
  id: string;
  phone: string;
  name: string;
  role: UserRole;
}

export type PropertyType = 'RESIDENTIAL' | 'COMMERCIAL';

export interface Tenant {
  id: string;
  ownerId: string;
  name: string;
  phone: string;
  aadhaar: string;
  address: string;
  photoUrl: string;
  rentalAgreementUrl?: string;
  propertyType: PropertyType;
  houseId: string;
  meterNumber: string;
  baseRate: number;
  status: 'ACTIVE' | 'ARCHIVED';
  onboardedDate: string;
}

export interface Bill {
  id: string;
  tenantId: string;
  tenantName: string;
  billingMonth: string;
  previousReading: number;
  presentReading: number;
  unitsConsumed: number;
  ratePerUnit: number;
  taxAmount: number;
  totalAmount: number;
  status: 'PENDING' | 'PAID';
  generatedAt: string;
}

export interface Owner {
  id: string;
  name: string;
  phone: string;
  email?: string;
  aadhaar?: string;
  houseName?: string;
  address?: string;
  photoUrl?: string;
  buildingPhotos?: string[];
  rrNumber?: string;
  solarProjectCost?: number;
  tenantCount: number;
  totalRevenue: number;
  status?: 'ACTIVE' | 'SUSPENDED' | 'PENDING';
}
