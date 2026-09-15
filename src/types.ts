export type UserRole = 
  | 'owner' 
  | 'manager' 
  | 'accountant' 
  | 'fleet_manager' 
  | 'hr'
  | 'super_admin'
  | 'company_admin'
  | 'booking_manager'
  | 'finance_manager'
  | 'operations_manager'
  | 'fleet_coordinator'
  | 'driver'
  | 'read_only';

export type SupportTicketCategory = 'technical' | 'billing' | 'feature_request' | 'general' | 'onboarding' | 'fleet_limit';
export type SupportTicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export type PlateType = 'limousine' | 'private' | 'commercial';

export type VehicleStatus = 
  | 'available' 
  | 'assigned' 
  | 'rental' 
  | 'maintenance' 
  | 'accident' 
  | 'inactive' 
  | 'sold';

export type DriverStatus = 'active' | 'on_leave' | 'suspended' | 'terminated';

export type PaymentFrequency = 'every_15_days' | 'monthly' | 'weekly';

export type PaymentCyclePeriod = 'cycle_1' | 'cycle_2' | 'custom'; // cycle 1 = 1-15, cycle 2 = 16-end of month

export type PaymentStatus = 'paid' | 'partial' | 'overdue' | 'upcoming';

export type PaymentMethod = 'cash' | 'qnb_transfer' | 'card' | 'cheque' | 'doha_bank';

export type ExpenseCategory = 'office_admin' | 'employees' | 'fleet' | 'operations' | 'other';

export interface Vehicle {
  id: string;
  tenantId?: string;
  make: string;
  model: string;
  year: number;
  color: string;
  plateNumber: string; // e.g., "LIM 1234" or "QAT 5678"
  plateType: PlateType;
  vin: string;
  currentMileage: number;
  monthlyRent: number; // in QAR, e.g. 4500
  rentPer15Days: number; // e.g. 2250
  status: VehicleStatus;
  currentDriverId?: string;
  currentDriverName?: string;
  insuranceExpiry: string;
  registrationExpiry: string; // Istimara
  inspectionExpiry: string;
  operatingCardExpiry: string;
  imageUrl?: string;
  fuelType: 'petrol' | 'hybrid' | 'electric' | 'diesel';
  purchaseDate: string;
  purchasePrice: number;
  lastServiceMileage?: number;
}

export interface Driver {
  id: string;
  tenantId?: string;
  fullName: string;
  photoUrl?: string;
  mobile: string;
  qid: string; // Qatar ID (11 digits)
  nationality: string;
  position: 'Driver';
  joiningDate: string;
  status: DriverStatus;
  assignedVehicleId?: string;
  assignedVehiclePlate?: string;
  monthlyRent: number;
  paymentFrequency: PaymentFrequency;
  drivingLicenseNo: string;
  drivingLicenseExpiry: string;
  qidExpiry: string;
  contractExpiry: string;
  bankName?: string;
  iban?: string;
  totalCollected: number;
  outstandingBalance: number;
  rating: number;
}

export interface Employee {
  id: string;
  tenantId?: string;
  fullName: string;
  photoUrl?: string;
  mobile: string;
  email: string;
  qid: string;
  position: 'Manager' | 'Accountant' | 'Fleet Manager' | 'HR' | 'Office Staff';
  role: UserRole;
  joiningDate: string;
  basicSalary: number;
  housingAllowance: number;
  transportAllowance: number;
  otherAllowances: number;
  bankName: string;
  iban: string;
  qidExpiry: string;
  contractExpiry: string;
  status: 'active' | 'inactive';
}

export interface VehicleAssignment {
  id: string;
  tenantId?: string;
  vehicleId: string;
  vehicleName: string;
  plateNumber: string;
  driverId: string;
  driverName: string;
  startDate: string;
  endDate?: string;
  startingMileage: number;
  endingMileage?: number;
  totalKmDriven?: number;
  monthlyRent: number;
  paymentAmountPer15Days: number;
  status: 'active' | 'completed' | 'terminated';
  handoverCondition?: string;
  contractNumber: string;
  notes?: string;
  closedBy?: string;
  closeReason?: string;
}

export interface DriverPayment {
  id: string;
  tenantId?: string;
  receiptNumber?: string; // e.g., "RCP-2026-089"
  driverId: string;
  driverName: string;
  vehicleId: string;
  plateNumber?: string;
  vehiclePlate?: string;
  vehicleName?: string;
  periodLabel: string; // e.g., "01 Sep – 15 Sep 2026"
  cycle?: PaymentCyclePeriod;
  dueDate?: string;
  date?: string;
  paymentDate?: string;
  amountDue: number; // in QAR
  amountPaid: number;
  outstandingBalance?: number;
  status: PaymentStatus | 'overdue' | 'partial' | 'paid';
  paymentMethod?: PaymentMethod;
  recordedBy?: string;
  collectedBy?: string;
  notes?: string;
  voucherNumber?: string;
  warningNotice?: string;
  overrideReason?: string;
  // Linked Mileage Checkpoint fields
  previousMileage: number;
  currentMileage: number;
  kmDriven?: number;
  mileageRecordId?: string;
  transactionId?: string;
  odometerPhotoUrl?: string;
}

export interface MileageRecord {
  id: string;
  tenantId?: string;
  vehicleId: string;
  plateNumber: string;
  driverId: string;
  driverName: string;
  recordDate?: string;
  date?: string;
  paymentCycleLabel?: string;
  startingOdometer?: number;
  endingOdometer?: number;
  previousMileage?: number;
  currentMileage?: number;
  kmDriven?: number;
  totalKmDriven?: number;
  source?: 'checkpoint' | 'manual' | 'inspection';
  paymentId?: string;
  recordedBy: string;
  verificationStatus?: 'verified' | 'flagged' | 'pending';
  odometerPhotoUrl?: string;
  notes?: string;
  warningNotice?: string;
  associatedPaymentId?: string;
}

export interface Expense {
  id: string;
  tenantId?: string;
  expenseNumber: string;
  category: ExpenseCategory | string;
  subcategory: string;
  date: string;
  amount: number;
  paymentAccount: string; // "QNB Main Account", "Petty Cash"
  vendor: string;
  description: string;
  vehicleId?: string;
  vehiclePlate?: string;
  employeeId?: string;
  employeeName?: string;
  isRecurring: boolean;
  recurringFrequency?: 'monthly' | 'quarterly' | 'annually';
  receiptAttachment?: string;
  status: 'paid' | 'pending';
  recordedBy: string;
}

export interface Income {
  id: string;
  tenantId?: string;
  date: string;
  category: 'driver_rent' | 'customer_rental' | 'limousine_chauffeur' | 'other';
  amount: number;
  account: string;
  reference: string;
  description: string;
  driverId?: string;
  customerId?: string;
  vehicleId?: string;
}

export interface FinancialAccount {
  id: string;
  tenantId?: string;
  name: string; // "QNB Corporate Main", "Commercial Bank of Qatar", "Petty Cash"
  accountNumber: string;
  bankName?: string;
  balance: number;
  type: 'bank' | 'cash';
  currency: string;
}

export interface Transaction {
  id: string;
  tenantId?: string;
  date: string;
  type: 'income' | 'expense' | 'transfer';
  category: string;
  amount: number;
  account: string;
  reference: string;
  description: string;
  balanceAfter?: number;
  relatedEntity?: string;
}

export interface Customer {
  id: string;
  tenantId?: string;
  name: string;
  companyName?: string;
  type?: 'individual' | 'corporate';
  contactPerson?: string;
  mobile?: string;
  phone?: string;
  email: string;
  qidOrCr?: string; // Qatar ID or Commercial Registration
  crNumber?: string;
  taxNumber?: string;
  rating?: number;
  status?: 'active' | 'inactive';
  totalRentals: number;
  outstandingBalance: number;
  address: string;
}

export interface RentalContract {
  id: string;
  tenantId?: string;
  contractNumber: string;
  customerId: string;
  customerName: string;
  driverAssignedId?: string;
  driverName?: string;
  vehicleId: string;
  vehicleName: string;
  plateNumber: string;
  startDate: string;
  endDate: string;
  dailyRate?: number;
  dailyOrMonthlyRate?: number;
  totalRentalAmount: number;
  depositAmount: number;
  mileageLimitPerDay?: number;
  startingMileage?: number;
  endingMileage?: number;
  driverIncluded?: boolean;
  assignedDriverName?: string;
  paymentStatus: 'paid' | 'partial' | 'pending';
  contractStatus?: 'active' | 'completed' | 'cancelled';
  status?: 'active' | 'completed' | 'cancelled';
  termsAndConditions?: string;
  notes?: string;
}

export interface MaintenanceRecord {
  id: string;
  tenantId?: string;
  vehicleId: string;
  vehicleName?: string;
  plateNumber: string;
  date: string;
  mileageAtService?: number;
  serviceType: 'Oil & Filter' | 'Brake Pads' | 'AC Compressor' | 'Tires Replacement' | 'Major 50k Service' | 'Suspension & Alignment' | 'General Inspection' | string;
  garage: string;
  partsCost?: number;
  laborCost?: number;
  totalCost: number;
  nextServiceKm?: number;
  nextServiceDate?: string;
  invoiceNumber?: string;
  status?: 'completed' | 'in_progress' | 'scheduled';
  notes?: string;
}

export interface TrafficFine {
  id: string;
  tenantId?: string;
  fineNumber?: string;
  vehicleId: string;
  plateNumber: string;
  driverId: string;
  driverName: string;
  date: string;
  violation?: string; // "Radar Speeding +20km/h", "Red Light", "Illegal Parking Corniche"
  location?: string;
  amount: number; // QAR
  status: 'paid_by_company' | 'paid_by_driver' | 'deducted_from_driver' | 'pending';
  responsiblePerson?: 'driver' | 'company';
  notes?: string;
}

export interface AccidentRecord {
  id: string;
  tenantId?: string;
  reportNumber: string;
  vehicleId: string;
  plateNumber: string;
  driverId: string;
  driverName: string;
  date: string;
  location: string;
  description: string;
  policeReportNumber: string;
  insuranceClaimNumber?: string;
  repairCost: number;
  insuranceCoveredAmount: number;
  driverLiableAmount: number;
  status: 'under_investigation' | 'at_garage' | 'repaired' | 'settled';
  photosCount: number;
}

export interface CompanyDocument {
  id: string;
  tenantId?: string;
  title: string;
  type: 'vehicle_registration' | 'vehicle_insurance' | 'limousine_card' | 'driver_qid' | 'driver_license' | 'commercial_registration' | 'contract';
  entityType: 'vehicle' | 'driver' | 'employee' | 'company';
  entityId?: string;
  entityName?: string;
  documentNumber: string;
  issueDate: string;
  expiryDate: string;
  fileSize?: string;
  fileType?: string;
  status: 'valid' | 'expiring_soon' | 'expired';
}

export interface PayrollRecord {
  id: string;
  tenantId?: string;
  month: string; // e.g. "August 2026"
  employeeId: string;
  employeeName: string;
  position: string;
  basicSalary: number;
  housingAllowance: number;
  transportAllowance: number;
  bonus: number;
  deduction: number;
  netSalary: number;
  paymentStatus: 'paid' | 'pending';
  paymentDate?: string;
  wpsBatchNumber?: string;
}

export interface SystemNotification {
  id: string;
  type: 'insurance_expiry' | 'license_expiry' | 'payment_overdue' | 'maintenance_due' | 'contract_ending' | 'payment_received' | 'mileage_alert';
  severity: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  date: string;
  relatedId?: string;
  relatedType?: string;
  isRead: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: 'create' | 'update' | 'delete' | 'checkpoint' | 'override' | 'close_assignment';
  entity: string;
  entityId: string;
  details: string;
  previousValue?: string;
  newValue?: string;
}

export interface CompanySettings {
  companyName: string;
  companyNameArabic: string;
  crNumber: string;
  taxNumber: string;
  address: string;
  phone: string;
  email: string;
  currency: string;
  defaultPaymentCycle: '1_to_15_and_16_to_end' | 'custom';
  cycle1StartDay: number;
  cycle1EndDay: number;
  cycle2StartDay: number;
  abnormalMileageThresholdKm: number; // e.g. 3500 km in 15 days
}

// ---------------------------------------------------------------------------
// SAAS MULTI-TENANT ARCHITECTURE TYPES
// ---------------------------------------------------------------------------

export type SubscriptionPlanId = 'starter' | 'business' | 'professional' | 'enterprise';

export interface PlanFeatures {
  advancedFinance: boolean;
  contracts: boolean;
  documentRadar: boolean;
  trafficViolations: boolean;
  apiAccess: boolean;
  customBranding: boolean;
  unlimitedHistory: boolean;
  exportReports: boolean;
  prioritySupport: boolean;
}

export interface SubscriptionPlan {
  id: SubscriptionPlanId;
  name: string;
  badge?: string;
  description: string;
  monthlyPriceUSD: number;
  annualPriceUSD: number;
  maxUsers: number;
  maxVehicles: number;
  maxDrivers: number;
  features: PlanFeatures;
  isPopular?: boolean;
}

export type OrganizationStatus = 'active' | 'trial' | 'suspended' | 'cancelled';

export interface Organization {
  id: string;
  name: string;
  legalName?: string;
  slug?: string;
  industry: 'limousine' | 'chauffeur' | 'car_rental' | 'fleet_logistics' | 'transport';
  logoUrl?: string;
  primaryColor?: string;
  country: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  currency: string; // "QAR", "USD", "EUR", "AED", "SAR", "GBP"
  currencySymbol: string; // "QR", "$", "€", "AED", "SAR", "£"
  timezone: string;
  dateFormat?: string;
  status: OrganizationStatus;
  planId: SubscriptionPlanId;
  isTrial: boolean;
  trialStartDate?: string;
  trialEndDate?: string;
  trialEndsAt?: string;
  trialDaysRemaining?: number;
  subscriptionStartDate?: string;
  currentBillingPeriodStart?: string;
  currentBillingPeriodEnd?: string;
  billingInterval?: 'monthly' | 'annual';
  taxId?: string;
  crNumber?: string;
  invoiceHeader?: string;
  invoiceFooter?: string;
  invoicePrefix?: string;
  nextInvoiceNumber?: number;
  ownerName?: string;
  ownerEmail: string;
  createdAt: string;
  updatedAt?: string;
  notes?: string;
}

export interface TenantUserMembership {
  organizationId: string;
  organizationName: string;
  role: UserRole;
  isPrimary?: boolean;
}

export interface TenantUser {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  photoUrl?: string;
  isSuperAdmin: boolean;
  role: UserRole;
  organizationId?: string; // Active tenant
  memberships: TenantUserMembership[];
  status: 'active' | 'suspended' | 'pending';
  assignedDriverId?: string; // If role is 'driver'
  createdAt: string;
  lastLogin?: string;
  lastLoginAt?: string;
}

export interface SupportTicketMessage {
  id: string;
  ticketId?: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  message: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  organizationId: string;
  organizationName: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  category: SupportTicketCategory | string;
  priority: SupportTicketPriority | string;
  status: 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  messages: SupportTicketMessage[];
}

export interface TenantInvitation {
  id: string;
  organizationId: string;
  organizationName: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: 'pending' | 'accepted' | 'expired';
  invitedBy: string;
  invitedAt: string;
  expiresAt: string;
  token: string;
}

export interface SaasPlatformAnalytics {
  mrrUSD: number;
  totalTenants: number;
  activeTenants: number;
  trialTenants: number;
  suspendedTenants: number;
  totalVehiclesMonitored: number;
  totalActiveDrivers: number;
  totalBookingsProcessed: number;
  churnRatePercent: number;
  revenueGrowthMoMPercent: number;
}

export interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  organizationId: string;
  organizationName?: string;
  planId?: string;
  amount: number;
  currency: string;
  planName: string;
  period: string;
  issueDate?: string;
  dueDate?: string;
  paidAt: string;
  paymentMethod: string;
  status: 'paid' | 'pending' | 'failed';
  downloadUrl?: string;
}

