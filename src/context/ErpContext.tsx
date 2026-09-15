import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Vehicle,
  Driver,
  Employee,
  VehicleAssignment,
  DriverPayment,
  MileageRecord,
  Expense,
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
  CompanySettings,
  UserRole,
  PaymentMethod,
  VehicleStatus,
  Organization,
  OrganizationStatus,
  SubscriptionPlan,
  SubscriptionPlanId,
  TenantUser,
  SupportTicket,
  SupportTicketCategory,
  SupportTicketPriority,
  InvoiceRecord,
  SaasPlatformAnalytics
} from '../types';
import {
  initialVehicles,
  initialDrivers,
  initialEmployees,
  initialAssignments,
  initialDriverPayments,
  initialMileageRecords,
  initialExpenses,
  initialAccounts,
  initialTransactions,
  initialCustomers,
  initialRentalContracts,
  initialMaintenanceRecords,
  initialTrafficFines,
  initialAccidents,
  initialDocuments,
  initialPayroll,
  initialNotifications,
  initialAuditLogs,
  initialSettings
} from '../data/initialData';
import {
  initialSubscriptionPlans,
  initialOrganizations,
  initialTenantUsers,
  initialSupportTickets,
  initialInvoiceRecords,
  initialPlatformAnalytics,
  demoEliteVehicles,
  demoEliteDrivers,
  demoElitePayments
} from '../data/saasInitialData';

const LOCAL_STORAGE_KEY = 'FLEETFLOW_SAAS_V3';

export type ErpTheme = 'bright' | 'gold' | 'emerald' | 'azure' | 'coral';

const roleTitlesMap: Record<UserRole, string> = {
  super_admin: 'Platform Super Admin',
  company_admin: 'Company Administrator',
  operations_manager: 'Operations Manager',
  booking_manager: 'Bookings & Reservations Manager',
  finance_manager: 'Finance & Billing Director',
  accountant: 'Chief Accountant',
  fleet_coordinator: 'Fleet Coordinator',
  driver: 'Chauffeur / Driver',
  owner: 'Business Owner',
  manager: 'General Manager',
  fleet_manager: 'Fleet Operations Manager',
  hr: 'HR Officer',
  read_only: 'Auditor (Read Only)'
};

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface ErpContextType {
  // Theme
  theme: ErpTheme;
  setTheme: (theme: ErpTheme) => void;

  // Navigation & Role
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;

  // SaaS Multi-Tenancy & User Management
  organizations: Organization[];
  currentTenantId: string;
  currentTenant: Organization;
  tenants: Organization[];
  users: TenantUser[];
  currentUser: TenantUser;
  plans: SubscriptionPlan[];
  supportTickets: SupportTicket[];
  invoices: InvoiceRecord[];
  platformAnalytics: SaasPlatformAnalytics;

  // SaaS Actions
  switchTenant: (tenantId: string) => void;
  switchUser: (userId: string) => void;
  registerOrganization: (params: {
    name: string;
    legalName?: string;
    industry: 'limousine' | 'chauffeur' | 'car_rental' | 'fleet_logistics' | 'transport';
    country: string;
    city: string;
    address: string;
    phone: string;
    email: string;
    currency: string;
    timezone: string;
    planId: SubscriptionPlanId;
    ownerName: string;
    ownerEmail: string;
  }) => { success: boolean; organization?: Organization; error?: string };
  updateCurrentTenant: (updates: Partial<Organization>) => void;
  updateOrganization: (orgId: string, updates: Partial<Organization>) => void;
  toggleTenantStatus: (orgId: string, status: OrganizationStatus) => void;
  changeTenantPlan: (orgId: string, planId: SubscriptionPlanId) => void;
  deleteTenant: (orgId: string) => void;
  updateSubscriptionPlan: (planId: SubscriptionPlanId, updates: Partial<SubscriptionPlan>) => void;
  inviteTenantUser: (params: { email: string; fullName: string; role: UserRole }) => { success: boolean; error?: string };
  removeTenantUser: (userId: string) => void;
  createSupportTicket: (params: { subject: string; category: SupportTicketCategory; priority: SupportTicketPriority; initialMessage: string }) => void;
  replySupportTicket: (ticketId: string, message: string) => void;
  updateTicketStatus: (ticketId: string, status: SupportTicket['status']) => void;

  // SaaS Quota Checks & Modals
  canAddVehicle: () => boolean;
  canAddDriver: () => boolean;
  canAddUser: () => boolean;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  isPlanLimitModalOpen: boolean;
  setIsPlanLimitModalOpen: (open: boolean) => void;
  planLimitResourceType: 'vehicles' | 'drivers' | 'users' | null;
  setPlanLimitResourceType: (type: 'vehicles' | 'drivers' | 'users' | null) => void;

  // Toasts
  toasts: ToastNotification[];
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;

  // Scoped Data Collections (Per Current Tenant)
  vehicles: Vehicle[];
  drivers: Driver[];
  employees: Employee[];
  assignments: VehicleAssignment[];
  payments: DriverPayment[];
  mileageRecords: MileageRecord[];
  expenses: Expense[];
  accounts: FinancialAccount[];
  transactions: Transaction[];
  ledger: Transaction[];
  customers: Customer[];
  rentals: RentalContract[];
  maintenance: MaintenanceRecord[];
  fines: TrafficFine[];
  accidents: AccidentRecord[];
  documents: CompanyDocument[];
  payroll: PayrollRecord[];
  notifications: SystemNotification[];
  auditLogs: AuditLog[];
  settings: CompanySettings;

  // Modals & Inspection UI
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  isCheckpointModalOpen: boolean;
  setCheckpointModalOpen: (open: boolean) => void;
  setPaymentCheckpointModal: (params: { isOpen: boolean; driverId?: string; vehicleId?: string }) => void;
  selectedDriverForCheckpoint: Driver | null;
  setSelectedDriverForCheckpoint: (driver: Driver | null) => void;
  selectedReceipt: DriverPayment | null;
  setSelectedReceipt: (payment: DriverPayment | null) => void;
  selectedVehicleProfileId: string | null;
  setSelectedVehicleProfileId: (id: string | null) => void;
  selectedDriverProfileId: string | null;
  setSelectedDriverProfileId: (id: string | null) => void;
  quickActionModal: string | null;
  setQuickActionModal: (action: string | null) => void;

  // Core Business Operations
  recordPaymentCheckpoint: (params: {
    driverId: string;
    vehicleId: string;
    periodLabel: string;
    previousMileage: number;
    currentMileage: number;
    amountDue: number;
    amountPaid: number;
    paymentMethod: PaymentMethod;
    notes?: string;
    odometerPhotoUrl?: string;
    overrideReason?: string;
  }) => { success: boolean; error?: string; payment?: DriverPayment };

  assignVehicleToDriver: (params: {
    vehicleId: string;
    driverId: string;
    monthlyRent: number;
    startDate: string;
    contractNumber?: string;
    notes?: string;
  }) => { success: boolean; error?: string };

  closeVehicleAssignment: (params: {
    assignmentId: string;
    endDate: string;
    endingMileage: number;
    handoverCondition: string;
    notes?: string;
  }) => { success: boolean; error?: string };

  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
  updateVehicleStatus?: (id: string, status: VehicleStatus) => void;
  addDriver: (driver: Omit<Driver, 'id' | 'totalCollected' | 'outstandingBalance'>) => void;
  updateDriver: (id: string, updates: Partial<Driver>) => void;
  addExpense: (expense: Omit<Expense, 'id' | 'expenseNumber'>) => void;
  addMaintenanceRecord: (record: Omit<MaintenanceRecord, 'id'>) => void;
  addTrafficFine: (fine: Omit<TrafficFine, 'id'>) => void;
  settleTrafficFine: (fineId: string, deductionMethod: 'driver_next_cycle' | 'company_paid') => void;
  addCustomer: (customer: Omit<Customer, 'id' | 'totalRentals' | 'outstandingBalance'>) => void;
  addRentalContract: (contract: Omit<RentalContract, 'id'>) => void;
  addDocument: (doc: Omit<CompanyDocument, 'id'>) => void;
  renewDocument: (id: string, newExpiryDate: string) => void;
  updateSettings: (updates: Partial<CompanySettings>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetToDefaultData: () => void;
  resetDatabase: () => void;
}

const ErpContext = createContext<ErpContextType | undefined>(undefined);

export const ErpProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state: defaults to bright
  const [theme, setThemeState] = useState<ErpTheme>(() => {
    try {
      const saved = localStorage.getItem('PRINCE_THEME');
      return (saved as ErpTheme) || 'bright';
    } catch {
      return 'bright';
    }
  });

  const setTheme = (newTheme: ErpTheme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('PRINCE_THEME', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
      document.documentElement.classList.add('bright');
      document.documentElement.classList.remove('dark');
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.add('bright');
    document.documentElement.classList.remove('dark');
  }, [theme]);

  // Navigation & Role
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [currentRole, setCurrentRole] = useState<UserRole>('owner');

  // SaaS Multi-Tenancy & Platform State
  const [organizations, setOrganizations] = useState<Organization[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_orgs`);
      return saved ? JSON.parse(saved) : initialOrganizations;
    } catch {
      return initialOrganizations;
    }
  });

  const [currentTenantId, setCurrentTenantId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_active_tenant`);
      return saved || 'tenant_prince_limousine';
    } catch {
      return 'tenant_prince_limousine';
    }
  });

  const [users, setUsers] = useState<TenantUser[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_users`);
      return saved ? JSON.parse(saved) : initialTenantUsers;
    } catch {
      return initialTenantUsers;
    }
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_active_user`);
      return saved || 'user_superadmin';
    } catch {
      return 'user_superadmin';
    }
  });

  const [plans, setPlans] = useState<SubscriptionPlan[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_plans`);
      return saved ? JSON.parse(saved) : initialSubscriptionPlans;
    } catch {
      return initialSubscriptionPlans;
    }
  });

  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_tickets`);
      return saved ? JSON.parse(saved) : initialSupportTickets;
    } catch {
      return initialSupportTickets;
    }
  });

  const [invoices, setInvoices] = useState<InvoiceRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_invoices`);
      return saved ? JSON.parse(saved) : initialInvoiceRecords;
    } catch {
      return initialInvoiceRecords;
    }
  });

  const [platformAnalytics] = useState<SaasPlatformAnalytics>(initialPlatformAnalytics);

  // SaaS Dialog States
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isPlanLimitModalOpen, setIsPlanLimitModalOpen] = useState<boolean>(false);
  const [planLimitResourceType, setPlanLimitResourceType] = useState<'vehicles' | 'drivers' | 'users' | null>(null);

  // Compute Current Tenant & User
  const currentTenant = useMemo(() => {
    return organizations.find(o => o.id === currentTenantId) || organizations[0];
  }, [organizations, currentTenantId]);

  const currentUser = useMemo(() => {
    return users.find(u => u.id === currentUserId) || users[0];
  }, [users, currentUserId]);

  const tenants = useMemo(() => {
    if (currentUser.isSuperAdmin) {
      return organizations;
    }
    return organizations.filter(o => currentUser.memberships.some(m => m.organizationId === o.id));
  }, [organizations, currentUser]);

  // Modals
  const [isSearchOpen, setSearchOpen] = useState<boolean>(false);
  const [isCheckpointModalOpen, setCheckpointModalOpen] = useState<boolean>(false);
  const [selectedDriverForCheckpoint, setSelectedDriverForCheckpoint] = useState<Driver | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<DriverPayment | null>(null);
  const [selectedVehicleProfileId, setSelectedVehicleProfileId] = useState<string | null>(null);
  const [selectedDriverProfileId, setSelectedDriverProfileId] = useState<string | null>(null);
  const [quickActionModal, setQuickActionModal] = useState<string | null>(null);

  // In-app Toast Notifications
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Raw Global Entity Collections
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_all_vehicles`);
      if (saved) return JSON.parse(saved);
      const combined = [
        ...initialVehicles.map(v => ({ ...v, tenantId: v.tenantId || 'tenant_prince_limousine' })),
        ...demoEliteVehicles.map(v => ({ ...v, tenantId: 'tenant_demo_elite' }))
      ];
      return combined;
    } catch {
      return [
        ...initialVehicles.map(v => ({ ...v, tenantId: v.tenantId || 'tenant_prince_limousine' })),
        ...demoEliteVehicles.map(v => ({ ...v, tenantId: 'tenant_demo_elite' }))
      ];
    }
  });

  const [allDrivers, setAllDrivers] = useState<Driver[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_all_drivers`);
      if (saved) return JSON.parse(saved);
      const combined = [
        ...initialDrivers.map(d => ({ ...d, tenantId: d.tenantId || 'tenant_prince_limousine' })),
        ...demoEliteDrivers.map(d => ({ ...d, tenantId: 'tenant_demo_elite' }))
      ];
      return combined;
    } catch {
      return [
        ...initialDrivers.map(d => ({ ...d, tenantId: d.tenantId || 'tenant_prince_limousine' })),
        ...demoEliteDrivers.map(d => ({ ...d, tenantId: 'tenant_demo_elite' }))
      ];
    }
  });

  const [employees] = useState<Employee[]>(initialEmployees);

  const [allAssignments, setAllAssignments] = useState<VehicleAssignment[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_all_assignments`);
      return saved ? JSON.parse(saved) : initialAssignments.map(a => ({ ...a, tenantId: 'tenant_prince_limousine' }));
    } catch {
      return initialAssignments.map(a => ({ ...a, tenantId: 'tenant_prince_limousine' }));
    }
  });

  const [allPayments, setAllPayments] = useState<DriverPayment[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_all_payments`);
      if (saved) return JSON.parse(saved);
      return [
        ...initialDriverPayments.map(p => ({ ...p, tenantId: 'tenant_prince_limousine' })),
        ...demoElitePayments.map(p => ({ ...p, tenantId: 'tenant_demo_elite' }))
      ];
    } catch {
      return [
        ...initialDriverPayments.map(p => ({ ...p, tenantId: 'tenant_prince_limousine' })),
        ...demoElitePayments.map(p => ({ ...p, tenantId: 'tenant_demo_elite' }))
      ];
    }
  });

  const [allMileageRecords, setAllMileageRecords] = useState<MileageRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_all_mileage`);
      return saved ? JSON.parse(saved) : initialMileageRecords.map(m => ({ ...m, tenantId: 'tenant_prince_limousine' }));
    } catch {
      return initialMileageRecords.map(m => ({ ...m, tenantId: 'tenant_prince_limousine' }));
    }
  });

  const [allExpenses, setAllExpenses] = useState<Expense[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_all_expenses`);
      return saved ? JSON.parse(saved) : initialExpenses.map(e => ({ ...e, tenantId: 'tenant_prince_limousine' }));
    } catch {
      return initialExpenses.map(e => ({ ...e, tenantId: 'tenant_prince_limousine' }));
    }
  });

  const [allAccounts, setAllAccounts] = useState<FinancialAccount[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_all_accounts`);
      return saved ? JSON.parse(saved) : initialAccounts.map(a => ({ ...a, tenantId: 'tenant_prince_limousine' }));
    } catch {
      return initialAccounts.map(a => ({ ...a, tenantId: 'tenant_prince_limousine' }));
    }
  });

  const [allTransactions, setAllTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_all_transactions`);
      return saved ? JSON.parse(saved) : initialTransactions.map(t => ({ ...t, tenantId: 'tenant_prince_limousine' }));
    } catch {
      return initialTransactions.map(t => ({ ...t, tenantId: 'tenant_prince_limousine' }));
    }
  });

  const [allCustomers, setAllCustomers] = useState<Customer[]>(() => {
    return initialCustomers.map(c => ({ ...c, tenantId: 'tenant_prince_limousine' }));
  });

  const [allRentals, setAllRentals] = useState<RentalContract[]>(() => {
    return initialRentalContracts.map(r => ({ ...r, tenantId: 'tenant_prince_limousine' }));
  });

  const [allMaintenance, setAllMaintenance] = useState<MaintenanceRecord[]>(() => {
    return initialMaintenanceRecords.map(m => ({ ...m, tenantId: 'tenant_prince_limousine' }));
  });

  const [allFines, setAllFines] = useState<TrafficFine[]>(() => {
    return initialTrafficFines.map(f => ({ ...f, tenantId: 'tenant_prince_limousine' }));
  });

  const [allAccidents] = useState<AccidentRecord[]>(() => {
    return initialAccidents.map(a => ({ ...a, tenantId: 'tenant_prince_limousine' }));
  });

  const [allDocuments, setAllDocuments] = useState<CompanyDocument[]>(() => {
    return initialDocuments.map(d => ({ ...d, tenantId: 'tenant_prince_limousine' }));
  });

  const [allPayroll] = useState<PayrollRecord[]>(() => {
    return initialPayroll.map(p => ({ ...p, tenantId: 'tenant_prince_limousine' }));
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>(initialNotifications);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [settings, setSettings] = useState<CompanySettings>(initialSettings);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_orgs`, JSON.stringify(organizations));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_active_tenant`, currentTenantId);
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_users`, JSON.stringify(users));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_active_user`, currentUserId);
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_plans`, JSON.stringify(plans));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_tickets`, JSON.stringify(supportTickets));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_invoices`, JSON.stringify(invoices));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_all_vehicles`, JSON.stringify(allVehicles));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_all_drivers`, JSON.stringify(allDrivers));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_all_payments`, JSON.stringify(allPayments));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_all_assignments`, JSON.stringify(allAssignments));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_all_mileage`, JSON.stringify(allMileageRecords));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_all_expenses`, JSON.stringify(allExpenses));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_all_accounts`, JSON.stringify(allAccounts));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_all_transactions`, JSON.stringify(allTransactions));
    } catch (e) {
      console.error('Failed to sync SaaS state to localStorage', e);
    }
  }, [
    organizations,
    currentTenantId,
    users,
    currentUserId,
    plans,
    supportTickets,
    invoices,
    allVehicles,
    allDrivers,
    allPayments,
    allAssignments,
    allMileageRecords,
    allExpenses,
    allAccounts,
    allTransactions
  ]);

  // TENANT-SCOPED DERIVED COLLECTIONS
  const vehicles = useMemo(() => {
    return allVehicles.filter(v => (v.tenantId || 'tenant_prince_limousine') === currentTenant.id);
  }, [allVehicles, currentTenant.id]);

  const drivers = useMemo(() => {
    return allDrivers.filter(d => (d.tenantId || 'tenant_prince_limousine') === currentTenant.id);
  }, [allDrivers, currentTenant.id]);

  const assignments = useMemo(() => {
    return allAssignments.filter(a => (a.tenantId || 'tenant_prince_limousine') === currentTenant.id);
  }, [allAssignments, currentTenant.id]);

  const payments = useMemo(() => {
    return allPayments.filter(p => (p.tenantId || 'tenant_prince_limousine') === currentTenant.id);
  }, [allPayments, currentTenant.id]);

  const mileageRecords = useMemo(() => {
    return allMileageRecords.filter(m => (m.tenantId || 'tenant_prince_limousine') === currentTenant.id);
  }, [allMileageRecords, currentTenant.id]);

  const expenses = useMemo(() => {
    return allExpenses.filter(e => (e.tenantId || 'tenant_prince_limousine') === currentTenant.id);
  }, [allExpenses, currentTenant.id]);

  const accounts = useMemo(() => {
    return allAccounts.filter(a => (a.tenantId || 'tenant_prince_limousine') === currentTenant.id);
  }, [allAccounts, currentTenant.id]);

  const transactions = useMemo(() => {
    return allTransactions.filter(t => (t.tenantId || 'tenant_prince_limousine') === currentTenant.id);
  }, [allTransactions, currentTenant.id]);

  const customers = useMemo(() => {
    return allCustomers.filter(c => (c.tenantId || 'tenant_prince_limousine') === currentTenant.id);
  }, [allCustomers, currentTenant.id]);

  const rentals = useMemo(() => {
    return allRentals.filter(r => (r.tenantId || 'tenant_prince_limousine') === currentTenant.id);
  }, [allRentals, currentTenant.id]);

  const maintenance = useMemo(() => {
    return allMaintenance.filter(m => (m.tenantId || 'tenant_prince_limousine') === currentTenant.id);
  }, [allMaintenance, currentTenant.id]);

  const fines = useMemo(() => {
    return allFines.filter(f => (f.tenantId || 'tenant_prince_limousine') === currentTenant.id);
  }, [allFines, currentTenant.id]);

  const accidents = useMemo(() => {
    return allAccidents.filter(a => (a.tenantId || 'tenant_prince_limousine') === currentTenant.id);
  }, [allAccidents, currentTenant.id]);

  const documents = useMemo(() => {
    return allDocuments.filter(d => (d.tenantId || 'tenant_prince_limousine') === currentTenant.id);
  }, [allDocuments, currentTenant.id]);

  const payroll = useMemo(() => {
    return allPayroll.filter(p => (p.tenantId || 'tenant_prince_limousine') === currentTenant.id);
  }, [allPayroll, currentTenant.id]);

  // Quota & Plan limits
  const currentPlan = useMemo(() => {
    return plans.find(p => p.id === currentTenant.planId) || plans[0];
  }, [plans, currentTenant.planId]);

  const canAddVehicle = () => {
    return vehicles.length < currentPlan.maxVehicles;
  };

  const canAddDriver = () => {
    return drivers.length < currentPlan.maxDrivers;
  };

  const canAddUser = () => {
    const tenantUserCount = users.filter(u => u.memberships.some(m => m.organizationId === currentTenant.id)).length;
    return tenantUserCount < currentPlan.maxUsers;
  };

  // SAAS METHODS
  const switchTenant = (tenantId: string) => {
    const target = organizations.find(o => o.id === tenantId);
    if (!target) return;
    setCurrentTenantId(tenantId);
    setSelectedDriverForCheckpoint(null);
    setSelectedDriverProfileId(null);
    setSelectedVehicleProfileId(null);
    showToast(`Active organization switched to ${target.name} (${target.currency})`, 'info');
  };

  const switchUser = (userId: string) => {
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return;
    setCurrentUserId(userId);

    // Switch active organization to user's first organization if valid
    if (targetUser.memberships.length > 0) {
      const firstOrgId = targetUser.memberships[0].organizationId;
      setCurrentTenantId(firstOrgId);
      setCurrentRole(targetUser.memberships[0].role);
    } else if (targetUser.isSuperAdmin) {
      setCurrentRole('super_admin');
    }

    if (targetUser.role === 'driver') {
      setActiveTab('driver_portal');
    }

    showToast(`Logged in as ${targetUser.fullName} (${roleTitlesMap[targetUser.role] || targetUser.role})`, 'success');
  };

  const registerOrganization = (params: {
    name: string;
    legalName?: string;
    industry: 'limousine' | 'chauffeur' | 'car_rental' | 'fleet_logistics' | 'transport';
    country: string;
    city: string;
    address: string;
    phone: string;
    email: string;
    currency: string;
    timezone: string;
    planId: SubscriptionPlanId;
    ownerName: string;
    ownerEmail: string;
  }) => {
    const orgId = `tenant_${params.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now().toString(36)}`;
    const currencySymbols: Record<string, string> = {
      QAR: 'QR',
      USD: '$',
      AED: 'AED',
      SAR: 'SAR',
      EUR: '€',
      GBP: '£'
    };

    const newOrg: Organization = {
      id: orgId,
      name: params.name,
      legalName: params.legalName || `${params.name} LLC`,
      industry: params.industry,
      status: 'trial',
      planId: params.planId,
      isTrial: true,
      trialEndsAt: '2026-09-30',
      trialDaysRemaining: 14,
      country: params.country,
      city: params.city,
      address: params.address,
      phone: params.phone,
      email: params.email,
      currency: params.currency,
      currencySymbol: currencySymbols[params.currency] || params.currency,
      timezone: params.timezone,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ownerName: params.ownerName,
      ownerEmail: params.ownerEmail,
      primaryColor: '#d97706',
      invoicePrefix: `${params.name.substring(0, 3).toUpperCase()}-INV`,
      nextInvoiceNumber: 1001,
      currentBillingPeriodStart: '2026-09-15',
      currentBillingPeriodEnd: '2026-10-15'
    };

    const newAdminUser: TenantUser = {
      id: `user_${Date.now()}`,
      email: params.ownerEmail,
      fullName: params.ownerName,
      role: 'company_admin',
      status: 'active',
      isSuperAdmin: false,
      memberships: [
        {
          organizationId: orgId,
          organizationName: params.name,
          role: 'company_admin'
        }
      ],
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    // Default primary bank account for this new organization
    const newAccount: FinancialAccount = {
      id: `acc-${Date.now()}`,
      name: `${params.name} Primary Operating Account`,
      accountNumber: `${params.currency}-001-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'bank',
      balance: 10000,
      currency: params.currency,
      tenantId: orgId
    };

    setOrganizations(prev => [newOrg, ...prev]);
    setUsers(prev => [newAdminUser, ...prev]);
    setAllAccounts(prev => [newAccount, ...prev]);
    setCurrentTenantId(orgId);
    setCurrentUserId(newAdminUser.id);
    setCurrentRole('company_admin');

    // Generate trial subscription invoice
    const newInvoice: InvoiceRecord = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-2026-TRIAL-${Math.floor(100 + Math.random() * 900)}`,
      organizationId: orgId,
      organizationName: params.name,
      planId: params.planId,
      planName: plans.find(p => p.id === params.planId)?.name || 'Business Plan',
      period: '14-Day Free Trial (Full Enterprise Quotas)',
      amount: 0,
      currency: 'USD',
      status: 'paid',
      issueDate: '2026-09-15',
      dueDate: '2026-09-15',
      paidAt: '2026-09-15',
      paymentMethod: 'Credit Card (Trial Authorization)'
    };
    setInvoices(prev => [newInvoice, ...prev]);

    return { success: true, organization: newOrg };
  };

  const updateCurrentTenant = (updates: Partial<Organization>) => {
    setOrganizations(prev =>
      prev.map(o => (o.id === currentTenant.id ? { ...o, ...updates, updatedAt: new Date().toISOString() } : o))
    );
    showToast('Company profile & preferences updated', 'success');
  };

  const updateOrganization = (orgId: string, updates: Partial<Organization>) => {
    setOrganizations(prev =>
      prev.map(o => (o.id === orgId ? { ...o, ...updates, updatedAt: new Date().toISOString() } : o))
    );
  };

  const toggleTenantStatus = (orgId: string, status: OrganizationStatus) => {
    setOrganizations(prev =>
      prev.map(o => (o.id === orgId ? { ...o, status, updatedAt: new Date().toISOString() } : o))
    );
    showToast(`Organization status changed to ${status}`, 'info');
  };

  const changeTenantPlan = (orgId: string, planId: SubscriptionPlanId) => {
    setOrganizations(prev =>
      prev.map(o => (o.id === orgId ? { ...o, planId, updatedAt: new Date().toISOString() } : o))
    );
    const planObj = plans.find(p => p.id === planId);
    showToast(`Subscription plan updated to ${planObj?.name || planId}`, 'success');
  };

  const deleteTenant = (orgId: string) => {
    if (organizations.length <= 1) {
      showToast('Cannot delete the only remaining organization.', 'error');
      return;
    }
    setOrganizations(prev => prev.filter(o => o.id !== orgId));
    if (currentTenantId === orgId) {
      const fallback = organizations.find(o => o.id !== orgId);
      if (fallback) setCurrentTenantId(fallback.id);
    }
    showToast('Organization removed from platform.', 'info');
  };

  const updateSubscriptionPlan = (planId: SubscriptionPlanId, updates: Partial<SubscriptionPlan>) => {
    setPlans(prev =>
      prev.map(p => (p.id === planId ? { ...p, ...updates } : p))
    );
  };

  const inviteTenantUser = (params: { email: string; fullName: string; role: UserRole }) => {
    if (!canAddUser()) {
      setPlanLimitResourceType('users');
      setIsPlanLimitModalOpen(true);
      return { success: false, error: 'User quota reached. Please upgrade your plan.' };
    }

    const newUser: TenantUser = {
      id: `user_${Date.now()}`,
      email: params.email,
      fullName: params.fullName,
      role: params.role,
      status: 'active',
      isSuperAdmin: false,
      memberships: [
        {
          organizationId: currentTenant.id,
          organizationName: currentTenant.name,
          role: params.role
        }
      ],
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    setUsers(prev => [newUser, ...prev]);
    return { success: true };
  };

  const removeTenantUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const createSupportTicket = (params: {
    subject: string;
    category: SupportTicketCategory;
    priority: SupportTicketPriority;
    initialMessage: string;
  }) => {
    const newTicket: SupportTicket = {
      id: `tick-${Date.now()}`,
      organizationId: currentTenant.id,
      organizationName: currentTenant.name,
      userId: currentUser.id,
      userName: currentUser.fullName,
      userEmail: currentUser.email,
      subject: params.subject,
      category: params.category,
      priority: params.priority,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderId: currentUser.id,
          senderName: currentUser.fullName,
          senderRole: currentUser.role,
          message: params.initialMessage,
          timestamp: new Date().toISOString()
        }
      ]
    };

    setSupportTickets(prev => [newTicket, ...prev]);
  };

  const replySupportTicket = (ticketId: string, message: string) => {
    setSupportTickets(prev =>
      prev.map(t => {
        if (t.id !== ticketId) return t;
        return {
          ...t,
          updatedAt: new Date().toISOString(),
          status: currentUser.isSuperAdmin ? 'waiting' : 'open',
          messages: [
            ...t.messages,
            {
              id: `msg-${Date.now()}`,
              senderId: currentUser.id,
              senderName: currentUser.fullName,
              senderRole: currentUser.role,
              message,
              timestamp: new Date().toISOString()
            }
          ]
        };
      })
    );
  };

  const updateTicketStatus = (ticketId: string, status: SupportTicket['status']) => {
    setSupportTickets(prev =>
      prev.map(t => (t.id === ticketId ? { ...t, status, updatedAt: new Date().toISOString() } : t))
    );
  };

  const setPaymentCheckpointModal = (params: { isOpen: boolean; driverId?: string; vehicleId?: string }) => {
    setCheckpointModalOpen(params.isOpen);
    if (params.driverId) {
      const d = drivers.find(drv => drv.id === params.driverId);
      if (d) setSelectedDriverForCheckpoint(d);
    }
  };

  // CORE WORKFLOW: 15-day payment + mileage checkpoint
  const recordPaymentCheckpoint = ({
    driverId,
    vehicleId,
    periodLabel,
    previousMileage,
    currentMileage,
    amountDue,
    amountPaid,
    paymentMethod,
    notes,
    odometerPhotoUrl,
    overrideReason
  }: {
    driverId: string;
    vehicleId: string;
    periodLabel: string;
    previousMileage: number;
    currentMileage: number;
    amountDue: number;
    amountPaid: number;
    paymentMethod: PaymentMethod;
    notes?: string;
    odometerPhotoUrl?: string;
    overrideReason?: string;
  }) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    const driver = drivers.find(d => d.id === driverId);

    if (!vehicle || !driver) {
      return { success: false, error: 'Vehicle or Driver not found.' };
    }

    // Mileage continuous continuity check
    if (currentMileage < previousMileage) {
      return {
        success: false,
        error: `Odometer reading (${currentMileage} KM) cannot be lower than previous checkpoint (${previousMileage} KM).`
      };
    }

    const kmDriven = currentMileage - previousMileage;
    const paymentId = `pmt-${Date.now()}`;
    const dateStr = new Date().toISOString().split('T')[0];
    const voucherNumber = `${currentTenant.invoicePrefix || 'VCH'}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const isPartial = amountPaid < amountDue;
    const isOverdue = amountPaid === 0;
    const paymentStatus = isOverdue ? 'overdue' : isPartial ? 'partial' : 'paid';

    let warningNotice: string | undefined = undefined;
    if (kmDriven > 3500) {
      warningNotice = `Excessive mileage recorded: ${kmDriven.toLocaleString()} KM driven in 15 days (${Math.round(kmDriven / 15)} KM/day). Recommended fleet inspection scheduled.`;
    }

    // 1. Create Payment Record
    const newPayment: DriverPayment = {
      id: paymentId,
      tenantId: currentTenant.id,
      driverId,
      driverName: driver.fullName,
      vehicleId,
      vehiclePlate: vehicle.plateNumber,
      amountDue,
      amountPaid,
      periodLabel,
      date: dateStr,
      status: paymentStatus,
      paymentMethod,
      voucherNumber,
      previousMileage,
      currentMileage,
      warningNotice,
      overrideReason,
      odometerPhotoUrl,
      notes,
      collectedBy: roleTitlesMap[currentRole] || 'Operations Admin'
    };

    setAllPayments(prev => [newPayment, ...prev]);

    // 2. Create Mileage Record
    const newMileageRecord: MileageRecord = {
      id: `mil-${Date.now()}`,
      tenantId: currentTenant.id,
      vehicleId,
      plateNumber: vehicle.plateNumber,
      driverId,
      driverName: driver.fullName,
      date: dateStr,
      previousMileage,
      currentMileage,
      kmDriven,
      source: 'checkpoint',
      paymentId,
      recordedBy: roleTitlesMap[currentRole] || 'Operations Admin',
      odometerPhotoUrl
    };

    setAllMileageRecords(prev => [newMileageRecord, ...prev]);

    // 3. Update Vehicle Current Verified Mileage
    setAllVehicles(prev =>
      prev.map(v =>
        v.id === vehicleId
          ? {
              ...v,
              currentMileage: Math.max(v.currentMileage, currentMileage),
              lastServiceMileage: v.lastServiceMileage || 0
            }
          : v
      )
    );

    // 4. Update Driver Financials
    const unpaidAmount = Math.max(0, amountDue - amountPaid);
    setAllDrivers(prev =>
      prev.map(d =>
        d.id === driverId
          ? {
              ...d,
              totalCollected: d.totalCollected + amountPaid,
              outstandingBalance: Math.max(0, d.outstandingBalance + unpaidAmount)
            }
          : d
      )
    );

    // 5. Update Financial Ledger
    if (amountPaid > 0) {
      const newTransaction: Transaction = {
        id: `txn-${Date.now()}`,
        tenantId: currentTenant.id,
        date: dateStr,
        type: 'income',
        category: 'Driver 15-Day Rent',
        amount: amountPaid,
        account: accounts[0]?.name || 'Primary Operating Account',
        reference: voucherNumber,
        description: `15-Day rent payment collected from ${driver.fullName} (${vehicle.plateNumber}) for ${periodLabel}`
      };

      setAllTransactions(prev => [newTransaction, ...prev]);

      // Adjust Account Balance
      setAllAccounts(prev =>
        prev.map((acc, index) =>
          index === 0
            ? { ...acc, balance: acc.balance + amountPaid }
            : acc
        )
      );
    }

    // 6. Update Assignment Continuous Mileage
    setAllAssignments(prev =>
      prev.map(a =>
        a.vehicleId === vehicleId && a.status === 'active'
          ? {
              ...a,
              totalKmDriven: Math.max(0, currentMileage - a.startingMileage)
            }
          : a
      )
    );

    // 7. Add Audit Log
    const newAuditLog: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      userId: currentUser.id,
      userName: currentUser.fullName,
      action: 'checkpoint',
      entity: 'DriverPayment',
      entityId: paymentId,
      details: `Recorded 15-day payment of ${currentTenant.currency} ${amountPaid.toLocaleString()} and continuous odometer reading of ${currentMileage.toLocaleString()} KM (+${kmDriven.toLocaleString()} KM) for ${vehicle.plateNumber}.`
    };
    setAuditLogs(prev => [newAuditLog, ...prev]);

    // 8. Add Notification
    const newNotif: SystemNotification = {
      id: `notif-${Date.now()}`,
      type: warningNotice ? 'mileage_alert' : 'payment_received',
      severity: warningNotice ? 'warning' : 'success',
      title: warningNotice ? 'Mileage Threshold Alert' : '15-Day Payment Checkpoint Saved',
      message: warningNotice || `Recorded ${currentTenant.currency} ${amountPaid.toLocaleString()} payment & ${kmDriven.toLocaleString()} KM reading from ${driver.fullName} (${vehicle.plateNumber}).`,
      date: dateStr,
      relatedId: paymentId,
      relatedType: 'payment',
      isRead: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    return { success: true, payment: newPayment };
  };

  // CORE WORKFLOW: Vehicle assignment with continuous odometer handover
  const assignVehicleToDriver = ({
    vehicleId,
    driverId,
    monthlyRent,
    startDate,
    contractNumber,
    notes
  }: {
    vehicleId: string;
    driverId: string;
    monthlyRent: number;
    startDate: string;
    contractNumber?: string;
    notes?: string;
  }) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    const driver = drivers.find(d => d.id === driverId);

    if (!vehicle || !driver) {
      return { success: false, error: 'Vehicle or Driver not found.' };
    }

    // Close any previous active assignment for this vehicle
    const existingAsg = assignments.find(a => a.vehicleId === vehicleId && a.status === 'active');
    if (existingAsg) {
      closeVehicleAssignment({
        assignmentId: existingAsg.id,
        endDate: startDate,
        endingMileage: vehicle.currentMileage,
        handoverCondition: 'Vehicle reassigned to new driver',
        notes: 'Automatic closure due to reassignment'
      });
    }

    const startingMileage = vehicle.currentMileage;

    const newAssignment: VehicleAssignment = {
      id: `asg-${Date.now()}`,
      tenantId: currentTenant.id,
      vehicleId,
      vehicleName: `${vehicle.make} ${vehicle.model}`,
      plateNumber: vehicle.plateNumber,
      driverId,
      driverName: driver.fullName,
      startDate,
      startingMileage,
      monthlyRent,
      paymentAmountPer15Days: monthlyRent / 2,
      status: 'active',
      contractNumber: contractNumber || `CNT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      notes
    };

    setAllAssignments(prev => [newAssignment, ...prev]);

    // Update Vehicle
    setAllVehicles(prev =>
      prev.map(v =>
        v.id === vehicleId
          ? {
              ...v,
              status: 'assigned',
              currentDriverId: driverId,
              currentDriverName: driver.fullName,
              monthlyRent,
              rentPer15Days: monthlyRent / 2
            }
          : v
      )
    );

    // Update Driver
    setAllDrivers(prev =>
      prev.map(d =>
        d.id === driverId
          ? {
              ...d,
              status: 'active',
              assignedVehicleId: vehicleId,
              assignedVehiclePlate: vehicle.plateNumber,
              monthlyRent
            }
          : d
      )
    );

    // Audit log
    setAuditLogs(prev => [
      {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        userId: currentUser.id,
        userName: currentUser.fullName,
        action: 'create',
        entity: 'VehicleAssignment',
        entityId: newAssignment.id,
        details: `Assigned ${vehicle.plateNumber} to ${driver.fullName}. Starting Odometer: ${startingMileage.toLocaleString()} KM.`
      },
      ...prev
    ]);

    return { success: true };
  };

  // Close assignment
  const closeVehicleAssignment = ({
    assignmentId,
    endDate,
    endingMileage,
    handoverCondition,
    notes
  }: {
    assignmentId: string;
    endDate: string;
    endingMileage: number;
    handoverCondition: string;
    notes?: string;
  }) => {
    const asg = assignments.find(a => a.id === assignmentId);
    if (!asg) return { success: false, error: 'Assignment not found.' };

    const totalKm = Math.max(0, endingMileage - asg.startingMileage);

    // Update assignment
    setAllAssignments(prev =>
      prev.map(a =>
        a.id === assignmentId
          ? {
              ...a,
              endDate,
              endingMileage,
              totalKmDriven: totalKm,
              status: 'completed',
              handoverCondition,
              notes: notes || a.notes,
              closedBy: roleTitlesMap[currentRole] || 'Operations Admin'
            }
          : a
      )
    );

    // Update vehicle to Available and latest verified odometer
    setAllVehicles(prev =>
      prev.map(v =>
        v.id === asg.vehicleId
          ? {
              ...v,
              status: 'available',
              currentDriverId: undefined,
              currentDriverName: undefined,
              currentMileage: endingMileage
            }
          : v
      )
    );

    // Update driver
    setAllDrivers(prev =>
      prev.map(d =>
        d.id === asg.driverId
          ? {
              ...d,
              assignedVehicleId: undefined,
              assignedVehiclePlate: undefined
            }
          : d
      )
    );

    return { success: true };
  };

  // Add Vehicle with Plan Quota Check
  const addVehicle = (vehData: Omit<Vehicle, 'id'>) => {
    if (!canAddVehicle()) {
      setPlanLimitResourceType('vehicles');
      setIsPlanLimitModalOpen(true);
      showToast(`Vehicle limit of ${currentPlan.maxVehicles} reached on the ${currentPlan.name} plan. Please upgrade to expand capacity.`, 'warning');
      return;
    }

    const newVehicle: Vehicle = {
      ...vehData,
      id: `veh-${Date.now()}`,
      tenantId: currentTenant.id
    };

    setAllVehicles(prev => [newVehicle, ...prev]);

    setAuditLogs(prev => [
      {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        userId: currentUser.id,
        userName: currentUser.fullName,
        action: 'create',
        entity: 'Vehicle',
        entityId: newVehicle.id,
        details: `Added new vehicle: ${newVehicle.make} ${newVehicle.model} (${newVehicle.plateNumber}).`
      },
      ...prev
    ]);
  };

  const updateVehicle = (id: string, updates: Partial<Vehicle>) => {
    setAllVehicles(prev => prev.map(v => (v.id === id ? { ...v, ...updates } : v)));
  };

  // Add Driver with Plan Quota Check
  const addDriver = (drvData: Omit<Driver, 'id' | 'totalCollected' | 'outstandingBalance'>) => {
    if (!canAddDriver()) {
      setPlanLimitResourceType('drivers');
      setIsPlanLimitModalOpen(true);
      showToast(`Driver limit of ${currentPlan.maxDrivers} reached on the ${currentPlan.name} plan. Please upgrade.`, 'warning');
      return;
    }

    const newDriver: Driver = {
      ...drvData,
      id: `drv-${Date.now()}`,
      tenantId: currentTenant.id,
      totalCollected: 0,
      outstandingBalance: 0
    };

    setAllDrivers(prev => [newDriver, ...prev]);

    setAuditLogs(prev => [
      {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        userId: currentUser.id,
        userName: currentUser.fullName,
        action: 'create',
        entity: 'Driver',
        entityId: newDriver.id,
        details: `Registered driver: ${newDriver.fullName} (QID: ${newDriver.qid}).`
      },
      ...prev
    ]);
  };

  const updateDriver = (id: string, updates: Partial<Driver>) => {
    setAllDrivers(prev => prev.map(d => (d.id === id ? { ...d, ...updates } : d)));
  };

  // Add Expense
  const addExpense = (expData: Omit<Expense, 'id' | 'expenseNumber'>) => {
    const expNum = `EXP-${new Date().getFullYear()}-${String(expenses.length + 1).padStart(3, '0')}`;
    const newExp: Expense = {
      ...expData,
      id: `exp-${Date.now()}`,
      tenantId: currentTenant.id,
      expenseNumber: expNum
    };

    setAllExpenses(prev => [newExp, ...prev]);

    const newTxn: Transaction = {
      id: `txn-${Date.now()}`,
      tenantId: currentTenant.id,
      date: newExp.date,
      type: 'expense',
      category: newExp.subcategory,
      amount: newExp.amount,
      account: newExp.paymentAccount,
      reference: expNum,
      description: newExp.description
    };
    setAllTransactions(prev => [newTxn, ...prev]);

    setAllAccounts(prev =>
      prev.map(acc =>
        acc.name === newExp.paymentAccount
          ? { ...acc, balance: acc.balance - newExp.amount }
          : acc
      )
    );
  };

  // Add Maintenance Record
  const addMaintenanceRecord = (record: Omit<MaintenanceRecord, 'id'>) => {
    const newRecord: MaintenanceRecord = {
      ...record,
      id: `maint-${Date.now()}`,
      tenantId: currentTenant.id
    };
    setAllMaintenance(prev => [newRecord, ...prev]);

    addExpense({
      category: 'fleet',
      subcategory: 'Maintenance & Repairs',
      date: newRecord.date,
      amount: newRecord.totalCost,
      paymentAccount: accounts[0]?.name || 'Primary Operating Account',
      vendor: newRecord.garage,
      description: `${newRecord.serviceType} for ${newRecord.plateNumber}`,
      vehicleId: newRecord.vehicleId,
      vehiclePlate: newRecord.plateNumber,
      isRecurring: false,
      status: 'paid',
      recordedBy: roleTitlesMap[currentRole] || 'General Manager'
    });
  };

  // Add Traffic Fine
  const addTrafficFine = (fine: Omit<TrafficFine, 'id'>) => {
    const newFine: TrafficFine = {
      ...fine,
      id: `fine-${Date.now()}`,
      tenantId: currentTenant.id
    };
    setAllFines(prev => [newFine, ...prev]);
    showToast(`Traffic fine ${currentTenant.currency} ${newFine.amount.toLocaleString()} logged for ${newFine.plateNumber}`, 'warning');
  };

  // Settle Traffic Fine
  const settleTrafficFine = (fineId: string, deductionMethod: 'driver_next_cycle' | 'company_paid') => {
    const fine = fines.find(f => f.id === fineId);
    if (!fine) return;

    if (deductionMethod === 'driver_next_cycle') {
      setAllDrivers(prev =>
        prev.map(d =>
          d.id === fine.driverId
            ? { ...d, outstandingBalance: d.outstandingBalance + fine.amount }
            : d
        )
      );
      setAllFines(prev =>
        prev.map(f =>
          f.id === fineId
            ? { ...f, status: 'deducted_from_driver' }
            : f
        )
      );
      showToast(`Fine ${currentTenant.currency} ${fine.amount.toLocaleString()} applied to ${fine.driverName}'s next 15-day cycle!`, 'success');
    } else {
      setAllFines(prev =>
        prev.map(f =>
          f.id === fineId
            ? { ...f, status: 'paid_by_company' }
            : f
        )
      );
      showToast(`Fine ${currentTenant.currency} ${fine.amount.toLocaleString()} settled by company.`, 'info');
    }
  };

  // Add Customer
  const addCustomer = (customer: Omit<Customer, 'id' | 'totalRentals' | 'outstandingBalance'>) => {
    const newCustomer: Customer = {
      ...customer,
      id: `cust-${Date.now()}`,
      tenantId: currentTenant.id,
      totalRentals: 0,
      outstandingBalance: 0
    };
    setAllCustomers(prev => [newCustomer, ...prev]);
    showToast(`Customer ${newCustomer.name} registered successfully!`, 'success');
  };

  // Add Rental
  const addRentalContract = (contract: Omit<RentalContract, 'id'>) => {
    const newContract: RentalContract = {
      ...contract,
      id: `rent-${Date.now()}`,
      tenantId: currentTenant.id
    };
    setAllRentals(prev => [newContract, ...prev]);
    showToast(`Rental contract ${newContract.contractNumber} created!`, 'success');
  };

  // Add Document
  const addDocument = (doc: Omit<CompanyDocument, 'id'>) => {
    const newDoc: CompanyDocument = {
      ...doc,
      id: `doc-${Date.now()}`,
      tenantId: currentTenant.id
    };
    setAllDocuments(prev => [newDoc, ...prev]);
    showToast(`Document ${newDoc.title} uploaded!`, 'success');
  };

  // Renew Document
  const renewDocument = (id: string, newExpiryDate: string) => {
    setAllDocuments(prev =>
      prev.map(doc =>
        doc.id === id
          ? { ...doc, expiryDate: newExpiryDate, status: 'valid' }
          : doc
      )
    );
    showToast(`Document successfully renewed until ${newExpiryDate}!`, 'success');
  };

  const updateVehicleStatus = (id: string, status: VehicleStatus) => {
    updateVehicle(id, { status });
  };

  const updateSettings = (updates: Partial<CompanySettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const resetToDefaultData = () => {
    setOrganizations(initialOrganizations);
    setCurrentTenantId('tenant_prince_limousine');
    setUsers(initialTenantUsers);
    setCurrentUserId('user_superadmin');
    setPlans(initialSubscriptionPlans);
    setSupportTickets(initialSupportTickets);
    setInvoices(initialInvoiceRecords);

    setAllVehicles([
      ...initialVehicles.map(v => ({ ...v, tenantId: 'tenant_prince_limousine' })),
      ...demoEliteVehicles.map(v => ({ ...v, tenantId: 'tenant_demo_elite' }))
    ]);
    setAllDrivers([
      ...initialDrivers.map(d => ({ ...d, tenantId: 'tenant_prince_limousine' })),
      ...demoEliteDrivers.map(d => ({ ...d, tenantId: 'tenant_demo_elite' }))
    ]);
    setAllPayments([
      ...initialDriverPayments.map(p => ({ ...p, tenantId: 'tenant_prince_limousine' })),
      ...demoElitePayments.map(p => ({ ...p, tenantId: 'tenant_demo_elite' }))
    ]);
    setAllAssignments(initialAssignments.map(a => ({ ...a, tenantId: 'tenant_prince_limousine' })));
    setAllMileageRecords(initialMileageRecords.map(m => ({ ...m, tenantId: 'tenant_prince_limousine' })));
    setAllExpenses(initialExpenses.map(e => ({ ...e, tenantId: 'tenant_prince_limousine' })));
    setAllAccounts(initialAccounts.map(a => ({ ...a, tenantId: 'tenant_prince_limousine' })));
    setAllTransactions(initialTransactions.map(t => ({ ...t, tenantId: 'tenant_prince_limousine' })));
    setAllCustomers(initialCustomers.map(c => ({ ...c, tenantId: 'tenant_prince_limousine' })));
    setAllRentals(initialRentalContracts.map(r => ({ ...r, tenantId: 'tenant_prince_limousine' })));
    setAllMaintenance(initialMaintenanceRecords.map(m => ({ ...m, tenantId: 'tenant_prince_limousine' })));
    setAllFines(initialTrafficFines.map(f => ({ ...f, tenantId: 'tenant_prince_limousine' })));
    setAllDocuments(initialDocuments.map(d => ({ ...d, tenantId: 'tenant_prince_limousine' })));
    setNotifications(initialNotifications);
    setAuditLogs(initialAuditLogs);
    setSettings(initialSettings);
    localStorage.clear();
    showToast('Platform reset to clean default multi-tenant state.', 'info');
  };

  return (
    <ErpContext.Provider
      value={{
        theme,
        setTheme,
        activeTab,
        setActiveTab,
        currentRole,
        setCurrentRole,
        organizations,
        currentTenantId,
        currentTenant,
        tenants,
        users,
        currentUser,
        plans,
        supportTickets,
        invoices,
        platformAnalytics,
        switchTenant,
        switchUser,
        registerOrganization,
        updateCurrentTenant,
        updateOrganization,
        toggleTenantStatus,
        changeTenantPlan,
        deleteTenant,
        updateSubscriptionPlan,
        inviteTenantUser,
        removeTenantUser,
        createSupportTicket,
        replySupportTicket,
        updateTicketStatus,
        canAddVehicle,
        canAddDriver,
        canAddUser,
        isOnboardingOpen,
        setIsOnboardingOpen,
        isPlanLimitModalOpen,
        setIsPlanLimitModalOpen,
        planLimitResourceType,
        setPlanLimitResourceType,
        toasts,
        showToast,
        removeToast,
        vehicles,
        drivers,
        employees,
        assignments,
        payments,
        mileageRecords,
        expenses,
        accounts,
        transactions,
        ledger: transactions,
        customers,
        rentals,
        maintenance,
        fines,
        accidents,
        documents,
        payroll,
        notifications,
        auditLogs,
        settings,
        isSearchOpen,
        setSearchOpen,
        isCheckpointModalOpen,
        setCheckpointModalOpen,
        setPaymentCheckpointModal,
        selectedDriverForCheckpoint,
        setSelectedDriverForCheckpoint,
        selectedReceipt,
        setSelectedReceipt,
        selectedVehicleProfileId,
        setSelectedVehicleProfileId,
        selectedDriverProfileId,
        setSelectedDriverProfileId,
        quickActionModal,
        setQuickActionModal,
        recordPaymentCheckpoint,
        assignVehicleToDriver,
        closeVehicleAssignment,
        addVehicle,
        updateVehicle,
        updateVehicleStatus,
        addDriver,
        updateDriver,
        addExpense,
        addMaintenanceRecord,
        addTrafficFine,
        settleTrafficFine,
        addCustomer,
        addRentalContract,
        addDocument,
        renewDocument,
        updateSettings,
        markNotificationRead,
        markAllNotificationsRead,
        resetToDefaultData,
        resetDatabase: resetToDefaultData
      }}
    >
      {children}
    </ErpContext.Provider>
  );
};

export const useErp = () => {
  const context = useContext(ErpContext);
  if (!context) {
    throw new Error('useErp must be used within an ErpProvider');
  }
  return context;
};
