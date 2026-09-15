import {
  Vehicle,
  Driver,
  Employee,
  VehicleAssignment,
  DriverPayment,
  MileageRecord,
  Expense,
  Income,
  FinancialAccount,
  Transaction,
  Customer,
  RentalContract,
  MaintenanceRecord,
  TrafficFine,
  AccidentRecord,
  CompanyDocument,
  PayrollRecord,
  SystemNotification,
  AuditLog,
  CompanySettings
} from '../types';

export const initialSettings: CompanySettings = {
  companyName: 'Prince Limousine W.L.L.',
  companyNameArabic: 'شركة برنس ليموزين ذ.م.م',
  crNumber: '148291/01',
  taxNumber: 'QA89214710',
  address: 'Building 42, C-Ring Road, Doha, State of Qatar',
  phone: '+974 4488 9900',
  email: 'operations@princelimousine.qa',
  currency: 'QAR',
  defaultPaymentCycle: '1_to_15_and_16_to_end',
  cycle1StartDay: 1,
  cycle1EndDay: 15,
  cycle2StartDay: 16,
  abnormalMileageThresholdKm: 3500,
};

export const initialAccounts: FinancialAccount[] = [
  {
    id: 'acc-1',
    name: 'QNB Corporate Main (0012-8849)',
    bankName: 'Qatar National Bank (QNB)',
    accountNumber: 'QA02 QNBA 0000 0012 8849 0101',
    balance: 0,
    type: 'bank',
    currency: 'QAR'
  },
  {
    id: 'acc-2',
    name: 'CBQ Operations Account',
    bankName: 'Commercial Bank of Qatar',
    accountNumber: 'QA44 CBQA 0000 4491 2289 02',
    balance: 0,
    type: 'bank',
    currency: 'QAR'
  },
  {
    id: 'acc-3',
    name: 'Head Office Petty Cash',
    bankName: 'Cash Vault',
    accountNumber: 'CASH-VAULT-DOHA',
    balance: 0,
    type: 'cash',
    currency: 'QAR'
  }
];

// Clean fresh arrays - ready for user entry
export const initialVehicles: Vehicle[] = [];

export const initialDrivers: Driver[] = [];

export const initialEmployees: Employee[] = [
  {
    id: 'emp-1',
    fullName: 'Business Owner',
    mobile: '+974 5500 0001',
    email: 'owner@princelimousine.qa',
    qid: '28058600001',
    position: 'Manager',
    role: 'owner',
    joiningDate: '2026-01-01',
    basicSalary: 0,
    housingAllowance: 0,
    transportAllowance: 0,
    otherAllowances: 0,
    bankName: 'QNB Private Banking',
    iban: 'QA01QNBA00000000010101',
    qidExpiry: '2029-01-01',
    contractExpiry: '2029-01-01',
    status: 'active'
  },
  {
    id: 'emp-2',
    fullName: 'Fleet Operations Manager',
    mobile: '+974 5542 9012',
    email: 'fleet@princelimousine.qa',
    qid: '28558604918',
    position: 'Fleet Manager',
    role: 'fleet_manager',
    joiningDate: '2026-01-01',
    basicSalary: 0,
    housingAllowance: 0,
    transportAllowance: 0,
    otherAllowances: 0,
    bankName: 'CBQ',
    iban: 'QA22CBQA000049182301',
    qidExpiry: '2027-08-14',
    contractExpiry: '2027-03-15',
    status: 'active'
  },
  {
    id: 'emp-3',
    fullName: 'Chief Accountant',
    mobile: '+974 6610 8821',
    email: 'accounts@princelimousine.qa',
    qid: '28758602910',
    position: 'Accountant',
    role: 'accountant',
    joiningDate: '2026-01-01',
    basicSalary: 0,
    housingAllowance: 0,
    transportAllowance: 0,
    otherAllowances: 0,
    bankName: 'Doha Bank',
    iban: 'QA99DHBK000019284102',
    qidExpiry: '2027-05-19',
    contractExpiry: '2027-06-01',
    status: 'active'
  },
  {
    id: 'emp-4',
    fullName: 'HR Officer',
    mobile: '+974 3391 2049',
    email: 'hr@princelimousine.qa',
    qid: '29158601829',
    position: 'HR',
    role: 'hr',
    joiningDate: '2026-01-01',
    basicSalary: 0,
    housingAllowance: 0,
    transportAllowance: 0,
    otherAllowances: 0,
    bankName: 'QNB',
    iban: 'QA44QNBA000039182402',
    qidExpiry: '2027-09-30',
    contractExpiry: '2027-02-01',
    status: 'active'
  }
];

export const initialAssignments: VehicleAssignment[] = [];
export const initialDriverPayments: DriverPayment[] = [];
export const initialMileageRecords: MileageRecord[] = [];
export const initialExpenses: Expense[] = [];
export const initialTransactions: Transaction[] = [];
export const initialCustomers: Customer[] = [];
export const initialRentalContracts: RentalContract[] = [];
export const initialMaintenanceRecords: MaintenanceRecord[] = [];
export const initialTrafficFines: TrafficFine[] = [];
export const initialAccidents: AccidentRecord[] = [];
export const initialDocuments: CompanyDocument[] = [];
export const initialPayroll: PayrollRecord[] = [];
export const initialNotifications: SystemNotification[] = [];
export const initialAuditLogs: AuditLog[] = [];
