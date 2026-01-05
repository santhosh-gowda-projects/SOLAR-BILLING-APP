
import React from 'react';
import { Sun, Users, Receipt, Settings, PieChart, ShieldCheck, Building2, Home } from 'lucide-react';
import { Tenant, Owner, Bill } from './types';

export const COLORS = {
  primary: '#f59e0b',
  secondary: '#d97706',
  accent: '#0369a1',
  success: '#10b981',
  danger: '#ef4444',
  warning: '#facc15'
};

export const MOCK_OWNERS: Owner[] = [
  { id: 'o1', name: 'Rajesh Kumar', phone: '9876543210', tenantCount: 5, totalRevenue: 45000 },
  { id: 'o2', name: 'Anjali Sharma', phone: '9123456789', tenantCount: 3, totalRevenue: 28000 },
];

export const MOCK_TENANTS: Tenant[] = [
  {
    id: 'T-8821',
    ownerId: 'o1',
    name: 'Suresh Raina',
    phone: '9988776655',
    aadhaar: 'XXXX XXXX 1234',
    address: 'Flat 4B, Sunshine Apartments, Bengaluru, KA',
    photoUrl: 'https://picsum.photos/seed/suresh/200/200',
    propertyType: 'RESIDENTIAL',
    houseId: 'FLAT-4B',
    meterNumber: 'MTR-101-ABC',
    baseRate: 8.5,
    status: 'ACTIVE',
    onboardedDate: '2023-01-15',
  },
  {
    id: 'T-9910',
    ownerId: 'o1',
    name: 'Meena Gupta',
    phone: '9911223344',
    aadhaar: 'XXXX XXXX 5678',
    address: 'Shop 12, Ground Floor, Galaxy Mall, Bengaluru, KA',
    photoUrl: 'https://picsum.photos/seed/meena/200/200',
    propertyType: 'COMMERCIAL',
    houseId: 'SHOP-12',
    meterNumber: 'MTR-102-XYZ',
    baseRate: 12.0,
    status: 'ACTIVE',
    onboardedDate: '2023-02-10',
  }
];

export const MOCK_BILLS: Bill[] = [
  {
    id: 'b1',
    tenantId: 'T-8821',
    tenantName: 'Suresh Raina',
    billingMonth: 'October 2023',
    previousReading: 1250,
    presentReading: 1345,
    unitsConsumed: 95,
    ratePerUnit: 8.5,
    taxAmount: 80.75,
    totalAmount: 888.25,
    status: 'PAID',
    generatedAt: '2023-11-01',
  },
  {
    id: 'b2',
    tenantId: 'T-8821',
    tenantName: 'Suresh Raina',
    billingMonth: 'November 2023',
    previousReading: 1345,
    presentReading: 1460,
    unitsConsumed: 115,
    ratePerUnit: 8.5,
    taxAmount: 97.75,
    totalAmount: 1075.25,
    status: 'PENDING',
    generatedAt: '2023-12-01',
  }
];

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: PieChart },
  { id: 'tenants', label: 'Tenants', icon: Users },
  { id: 'billing', label: 'Generate Bill', icon: Receipt },
  { id: 'history', label: 'History', icon: Sun },
  { id: 'pricing', label: 'Pricing', icon: Settings },
];

export const ADMIN_NAV_ITEMS = [
  { id: 'admin-dashboard', label: 'System Overview', icon: ShieldCheck },
  { id: 'owner-management', label: 'Manage Owners', icon: Building2 },
];
