import {
  SubscriptionPlan,
  Organization,
  TenantUser,
  SupportTicket,
  SaasPlatformAnalytics,
  InvoiceRecord,
  Vehicle,
  Driver,
  DriverPayment,
  MileageRecord,
  Customer,
  RentalContract,
  Expense
} from '../types';

export const initialSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    badge: 'Growth Tier',
    description: 'Perfect for boutique limousine and car rental startups managing small fleets.',
    monthlyPriceUSD: 149,
    annualPriceUSD: 119,
    maxUsers: 5,
    maxVehicles: 10,
    maxDrivers: 10,
    features: {
      advancedFinance: false,
      contracts: true,
      documentRadar: true,
      trafficViolations: true,
      apiAccess: false,
      customBranding: false,
      unlimitedHistory: false,
      exportReports: true,
      prioritySupport: false
    }
  },
  {
    id: 'business',
    name: 'Business Pro',
    badge: 'Most Popular',
    description: 'The standard operations suite for established fleets, luxury chauffeur services, and rental agencies.',
    monthlyPriceUSD: 299,
    annualPriceUSD: 239,
    maxUsers: 20,
    maxVehicles: 50,
    maxDrivers: 50,
    isPopular: true,
    features: {
      advancedFinance: true,
      contracts: true,
      documentRadar: true,
      trafficViolations: true,
      apiAccess: false,
      customBranding: true,
      unlimitedHistory: true,
      exportReports: true,
      prioritySupport: true
    }
  },
  {
    id: 'professional',
    name: 'Professional Fleet',
    badge: 'Enterprise Grade',
    description: 'High-volume transportation operators with multi-city fleets, automation, and API access.',
    monthlyPriceUSD: 599,
    annualPriceUSD: 479,
    maxUsers: 100,
    maxVehicles: 250,
    maxDrivers: 250,
    features: {
      advancedFinance: true,
      contracts: true,
      documentRadar: true,
      trafficViolations: true,
      apiAccess: true,
      customBranding: true,
      unlimitedHistory: true,
      exportReports: true,
      prioritySupport: true
    }
  },
  {
    id: 'enterprise',
    name: 'Enterprise Scale',
    badge: 'Custom Cloud',
    description: 'Dedicated infrastructure, custom SLAs, white-label mobile driver apps, and ERP data pipelines.',
    monthlyPriceUSD: 1499,
    annualPriceUSD: 1199,
    maxUsers: 9999,
    maxVehicles: 9999,
    maxDrivers: 9999,
    features: {
      advancedFinance: true,
      contracts: true,
      documentRadar: true,
      trafficViolations: true,
      apiAccess: true,
      customBranding: true,
      unlimitedHistory: true,
      exportReports: true,
      prioritySupport: true
    }
  }
];

export const initialOrganizations: Organization[] = [
  {
    id: 'tenant_prince_limousine',
    name: 'Prince Limousine W.L.L.',
    legalName: 'Prince Limousine & Luxury Passenger Transport W.L.L.',
    slug: 'prince-limousine',
    industry: 'limousine',
    primaryColor: '#d97706', // amber-600
    country: 'Qatar',
    city: 'Doha',
    address: 'Building 44, C-Ring Road, Doha, State of Qatar',
    phone: '+974 4488 1234',
    email: 'ops@princelimo.qa',
    website: 'https://princelimo.qa',
    currency: 'QAR',
    currencySymbol: 'QR',
    timezone: 'Asia/Qatar',
    dateFormat: 'DD/MM/YYYY',
    status: 'active',
    planId: 'business',
    isTrial: false,
    subscriptionStartDate: '2025-01-01',
    currentBillingPeriodEnd: '2027-01-01',
    billingInterval: 'annual',
    taxId: 'QA-TAX-982312',
    crNumber: '109283/2',
    invoiceHeader: 'Prince Limousine W.L.L. — Luxury Chauffeur & Fleet Management',
    invoiceFooter: 'Registered with Ministry of Commerce & Transport Qatar. All rights reserved.',
    createdAt: '2025-01-01T08:00:00Z',
    ownerEmail: 'admin@princelimo.qa',
    notes: 'Primary Qatar Limousine Organization with full Istimara & 15-day rent cycles'
  },
  {
    id: 'tenant_demo_elite',
    name: 'Demo Elite Chauffeur',
    legalName: 'Elite Chauffeur & VIP Executive Travel Inc.',
    slug: 'demo-elite-chauffeur',
    industry: 'chauffeur',
    primaryColor: '#2563eb', // blue-600
    country: 'United States',
    city: 'New York',
    address: '550 Madison Ave, New York, NY 10022',
    phone: '+1 (212) 555-0199',
    email: 'admin@elitelimo.com',
    website: 'https://elitelimo.com',
    currency: 'USD',
    currencySymbol: '$',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    status: 'trial',
    planId: 'starter',
    isTrial: true,
    trialStartDate: '2026-09-08',
    trialEndDate: '2026-09-22',
    trialDaysRemaining: 7,
    subscriptionStartDate: '2026-09-08',
    currentBillingPeriodEnd: '2026-09-22',
    billingInterval: 'monthly',
    taxId: 'US-EIN-12-893120',
    invoiceHeader: 'Elite Chauffeur NYC — Premium Executive Transport',
    invoiceFooter: 'Official SaaS Demo Organization. For demonstration and trial testing only.',
    createdAt: '2026-09-08T10:00:00Z',
    ownerEmail: 'admin@elitelimo.com',
    notes: 'Demo fleet pre-configured with realistic US dollar limousine data'
  },
  {
    id: 'tenant_gulf_transport',
    name: 'Gulf Transport & Rental',
    legalName: 'Gulf Fleet Solutions LLC',
    slug: 'gulf-transport',
    industry: 'car_rental',
    primaryColor: '#059669', // emerald-600
    country: 'United Arab Emirates',
    city: 'Dubai',
    address: 'Sheikh Zayed Road, Al Barsha 1, Dubai, UAE',
    phone: '+971 4 399 8877',
    email: 'manager@gulftransport.ae',
    website: 'https://gulftransport.ae',
    currency: 'AED',
    currencySymbol: 'AED',
    timezone: 'Asia/Dubai',
    dateFormat: 'DD/MM/YYYY',
    status: 'active',
    planId: 'professional',
    isTrial: false,
    subscriptionStartDate: '2025-06-15',
    currentBillingPeriodEnd: '2027-06-15',
    billingInterval: 'annual',
    taxId: 'AE-TRN-10029381200003',
    invoiceHeader: 'Gulf Transport LLC — Corporate & Airport VIP Transfer',
    invoiceFooter: 'Licensed by RTA Dubai. Thank you for your partnership.',
    createdAt: '2025-06-15T09:00:00Z',
    ownerEmail: 'manager@gulftransport.ae'
  }
];

export const initialTenantUsers: TenantUser[] = [
  {
    id: 'user_superadmin',
    email: 'superadmin@fleetflow.io',
    fullName: 'Alexander Sterling',
    isSuperAdmin: true,
    role: 'super_admin',
    organizationId: 'tenant_prince_limousine',
    memberships: [
      { organizationId: 'tenant_prince_limousine', organizationName: 'Prince Limousine W.L.L.', role: 'super_admin', isPrimary: true },
      { organizationId: 'tenant_demo_elite', organizationName: 'Demo Elite Chauffeur', role: 'super_admin', isPrimary: false },
      { organizationId: 'tenant_gulf_transport', organizationName: 'Gulf Transport & Rental', role: 'super_admin', isPrimary: false }
    ],
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: '2026-09-15T08:30:00Z'
  },
  {
    id: 'user_prince_admin',
    email: 'admin@princelimo.qa',
    fullName: 'Sheikh Fahad Al-Kuwari',
    isSuperAdmin: false,
    role: 'company_admin',
    organizationId: 'tenant_prince_limousine',
    memberships: [
      { organizationId: 'tenant_prince_limousine', organizationName: 'Prince Limousine W.L.L.', role: 'company_admin', isPrimary: true }
    ],
    status: 'active',
    createdAt: '2025-01-01T08:00:00Z',
    lastLogin: '2026-09-15T07:15:00Z'
  },
  {
    id: 'user_prince_driver',
    email: 'tariq@princelimo.qa',
    fullName: 'Tariq Mehmood',
    isSuperAdmin: false,
    role: 'driver',
    organizationId: 'tenant_prince_limousine',
    assignedDriverId: 'drv-001',
    memberships: [
      { organizationId: 'tenant_prince_limousine', organizationName: 'Prince Limousine W.L.L.', role: 'driver', isPrimary: true }
    ],
    status: 'active',
    createdAt: '2025-03-01T08:00:00Z',
    lastLogin: '2026-09-14T19:20:00Z'
  },
  {
    id: 'user_elite_admin',
    email: 'admin@elitelimo.com',
    fullName: 'Jonathan Hayes',
    isSuperAdmin: false,
    role: 'company_admin',
    organizationId: 'tenant_demo_elite',
    memberships: [
      { organizationId: 'tenant_demo_elite', organizationName: 'Demo Elite Chauffeur', role: 'company_admin', isPrimary: true }
    ],
    status: 'active',
    createdAt: '2026-09-08T10:00:00Z',
    lastLogin: '2026-09-15T09:00:00Z'
  }
];

export const initialSupportTickets: SupportTicket[] = [
  {
    id: 'ticket-101',
    organizationId: 'tenant_prince_limousine',
    organizationName: 'Prince Limousine W.L.L.',
    userId: 'user_prince_admin',
    userName: 'Sheikh Fahad Al-Kuwari',
    userEmail: 'admin@princelimo.qa',
    subject: 'Request for WhatsApp automated driver reminder integration',
    category: 'feature_request',
    priority: 'medium',
    status: 'in_progress',
    createdAt: '2026-09-10T11:20:00Z',
    updatedAt: '2026-09-12T14:45:00Z',
    messages: [
      {
        id: 'msg-1',
        ticketId: 'ticket-101',
        senderId: 'user_prince_admin',
        senderName: 'Sheikh Fahad Al-Kuwari',
        senderRole: 'user',
        message: 'Hello, we would love to send automated WhatsApp reminders to drivers 3 days before their 15-day rent cycle is due.',
        timestamp: '2026-09-10T11:20:00Z'
      },
      {
        id: 'msg-2',
        ticketId: 'ticket-101',
        senderId: 'user_superadmin',
        senderName: 'FleetFlow Support (Alexander)',
        senderRole: 'super_admin',
        message: 'Thank you Sheikh Fahad. The WhatsApp gateway architecture is currently available on the Professional tier. We have queued this integration for your account.',
        timestamp: '2026-09-12T14:45:00Z'
      }
    ]
  },
  {
    id: 'ticket-102',
    organizationId: 'tenant_demo_elite',
    organizationName: 'Demo Elite Chauffeur',
    userId: 'user_elite_admin',
    userName: 'Jonathan Hayes',
    userEmail: 'admin@elitelimo.com',
    subject: 'Question regarding custom tax ID formatting on monthly invoice templates',
    category: 'billing',
    priority: 'low',
    status: 'open',
    createdAt: '2026-09-14T16:00:00Z',
    updatedAt: '2026-09-14T16:00:00Z',
    messages: [
      {
        id: 'msg-3',
        ticketId: 'ticket-102',
        senderId: 'user_elite_admin',
        senderName: 'Jonathan Hayes',
        senderRole: 'user',
        message: 'We are testing our US EIN format on the corporate rental contract modal. Is there a field to include state sales tax rate?',
        timestamp: '2026-09-14T16:00:00Z'
      }
    ]
  }
];

export const initialPlatformAnalytics: SaasPlatformAnalytics = {
  mrrUSD: 38450,
  totalTenants: 28,
  activeTenants: 24,
  trialTenants: 3,
  suspendedTenants: 1,
  totalVehiclesMonitored: 468,
  totalActiveDrivers: 422,
  totalBookingsProcessed: 19840,
  churnRatePercent: 0.6,
  revenueGrowthMoMPercent: 21.4
};

export const initialInvoiceRecords: InvoiceRecord[] = [
  {
    id: 'inv-ff-2026-001',
    invoiceNumber: 'INV-FF-8921',
    organizationId: 'tenant_prince_limousine',
    amount: 2868,
    currency: 'USD',
    planName: 'Business Pro (Annual)',
    period: 'Jan 2026 – Jan 2027',
    paidAt: '2026-01-01T10:00:00Z',
    paymentMethod: 'Corporate Visa (ending in 8841)',
    status: 'paid'
  },
  {
    id: 'inv-ff-2026-002',
    invoiceNumber: 'INV-FF-7612',
    organizationId: 'tenant_gulf_transport',
    amount: 5748,
    currency: 'USD',
    planName: 'Professional Fleet (Annual)',
    period: 'Jun 2025 – Jun 2026',
    paidAt: '2025-06-15T12:30:00Z',
    paymentMethod: 'MasterCard (ending in 3099)',
    status: 'paid'
  }
];

// Pre-seeded Demo Data for Demo Elite Chauffeur (tenant_demo_elite)
export const demoEliteVehicles: Vehicle[] = [
  {
    id: 'elite-veh-1',
    make: 'Mercedes-Benz',
    model: 'S-Class S 580 4MATIC',
    year: 2024,
    color: 'Obsidian Black Metallic',
    plateNumber: 'NY-ELITE-01',
    plateType: 'limousine',
    vin: 'WDD2230761A998811',
    currentMileage: 18450,
    monthlyRent: 3800,
    rentPer15Days: 1900,
    status: 'assigned',
    currentDriverId: 'elite-drv-1',
    currentDriverName: 'David Miller',
    insuranceExpiry: '2027-03-31',
    registrationExpiry: '2027-04-15',
    inspectionExpiry: '2027-02-28',
    operatingCardExpiry: '2027-06-30',
    fuelType: 'petrol',
    purchaseDate: '2024-03-10',
    purchasePrice: 128000
  },
  {
    id: 'elite-veh-2',
    make: 'Cadillac',
    model: 'Escalade ESV Luxury',
    year: 2024,
    color: 'Crystal White Tricoat',
    plateNumber: 'NY-ELITE-02',
    plateType: 'limousine',
    vin: '1GYS4HKL7PR209182',
    currentMileage: 24300,
    monthlyRent: 4200,
    rentPer15Days: 2100,
    status: 'assigned',
    currentDriverId: 'elite-drv-2',
    currentDriverName: 'Carlos Rodriguez',
    insuranceExpiry: '2027-01-20',
    registrationExpiry: '2027-02-10',
    inspectionExpiry: '2026-12-15',
    operatingCardExpiry: '2027-05-30',
    fuelType: 'petrol',
    purchaseDate: '2024-01-15',
    purchasePrice: 114000
  },
  {
    id: 'elite-veh-3',
    make: 'BMW',
    model: '760i xDrive Sedan',
    year: 2023,
    color: 'Carbon Black',
    plateNumber: 'NY-ELITE-03',
    plateType: 'limousine',
    vin: 'WBA33EJ06PCA44910',
    currentMileage: 36100,
    monthlyRent: 3500,
    rentPer15Days: 1750,
    status: 'assigned',
    currentDriverId: 'elite-drv-3',
    currentDriverName: 'Marcus Vance',
    insuranceExpiry: '2026-11-30',
    registrationExpiry: '2026-12-05',
    inspectionExpiry: '2026-11-15',
    operatingCardExpiry: '2027-04-30',
    fuelType: 'petrol',
    purchaseDate: '2023-08-20',
    purchasePrice: 119000
  },
  {
    id: 'elite-veh-4',
    make: 'Lincoln',
    model: 'Navigator L Reserve',
    year: 2024,
    color: 'Infinite Black',
    plateNumber: 'NY-ELITE-04',
    plateType: 'limousine',
    vin: '5LMJJ3LT7REL19283',
    currentMileage: 14200,
    monthlyRent: 3900,
    rentPer15Days: 1950,
    status: 'available',
    insuranceExpiry: '2027-05-15',
    registrationExpiry: '2027-06-01',
    inspectionExpiry: '2027-04-10',
    operatingCardExpiry: '2027-07-31',
    fuelType: 'petrol',
    purchaseDate: '2024-05-02',
    purchasePrice: 108000
  }
];

export const demoEliteDrivers: Driver[] = [
  {
    id: 'elite-drv-1',
    fullName: 'David Miller',
    mobile: '+1 (917) 555-8831',
    qid: 'DL-NY-98217381',
    nationality: 'United States',
    position: 'Driver',
    joiningDate: '2024-04-01',
    status: 'active',
    assignedVehicleId: 'elite-veh-1',
    assignedVehiclePlate: 'NY-ELITE-01',
    monthlyRent: 3800,
    paymentFrequency: 'every_15_days',
    drivingLicenseNo: 'NY-CHAUFFEUR-8821',
    drivingLicenseExpiry: '2028-04-10',
    qidExpiry: '2028-04-10',
    contractExpiry: '2027-04-01',
    totalCollected: 22800,
    outstandingBalance: 0,
    rating: 4.95
  },
  {
    id: 'elite-drv-2',
    fullName: 'Carlos Rodriguez',
    mobile: '+1 (646) 555-3392',
    qid: 'DL-NY-44810291',
    nationality: 'United States',
    position: 'Driver',
    joiningDate: '2024-02-15',
    status: 'active',
    assignedVehicleId: 'elite-veh-2',
    assignedVehiclePlate: 'NY-ELITE-02',
    monthlyRent: 4200,
    paymentFrequency: 'every_15_days',
    drivingLicenseNo: 'NY-CHAUFFEUR-1029',
    drivingLicenseExpiry: '2027-10-18',
    qidExpiry: '2027-10-18',
    contractExpiry: '2027-02-15',
    totalCollected: 29400,
    outstandingBalance: 450,
    rating: 4.9
  },
  {
    id: 'elite-drv-3',
    fullName: 'Marcus Vance',
    mobile: '+1 (347) 555-9014',
    qid: 'DL-NY-77291048',
    nationality: 'United States',
    position: 'Driver',
    joiningDate: '2023-09-01',
    status: 'active',
    assignedVehicleId: 'elite-veh-3',
    assignedVehiclePlate: 'NY-ELITE-03',
    monthlyRent: 3500,
    paymentFrequency: 'every_15_days',
    drivingLicenseNo: 'NY-CHAUFFEUR-7729',
    drivingLicenseExpiry: '2027-08-25',
    qidExpiry: '2027-08-25',
    contractExpiry: '2026-09-01',
    totalCollected: 42000,
    outstandingBalance: 0,
    rating: 4.88
  }
];

export const demoElitePayments: DriverPayment[] = [
  {
    id: 'pay-elite-001',
    receiptNumber: 'RCP-NYC-001',
    driverId: 'elite-drv-1',
    driverName: 'David Miller',
    vehicleId: 'elite-veh-1',
    plateNumber: 'NY-ELITE-01',
    vehicleName: 'Mercedes-Benz S 580',
    periodLabel: '01 Sep – 15 Sep 2026',
    cycle: 'cycle_1',
    dueDate: '2026-09-15',
    paymentDate: '2026-09-14',
    amountDue: 1900,
    amountPaid: 1900,
    outstandingBalance: 0,
    status: 'paid',
    paymentMethod: 'card',
    recordedBy: 'Jonathan Hayes',
    previousMileage: 16800,
    currentMileage: 18450,
    kmDriven: 1650,
    notes: 'Airport VIP transfers and Manhattan corporate accounts'
  },
  {
    id: 'pay-elite-002',
    receiptNumber: 'RCP-NYC-002',
    driverId: 'elite-drv-2',
    driverName: 'Carlos Rodriguez',
    vehicleId: 'elite-veh-2',
    plateNumber: 'NY-ELITE-02',
    vehicleName: 'Cadillac Escalade ESV',
    periodLabel: '01 Sep – 15 Sep 2026',
    cycle: 'cycle_1',
    dueDate: '2026-09-15',
    paymentDate: '2026-09-15',
    amountDue: 2100,
    amountPaid: 1650,
    outstandingBalance: 450,
    status: 'partial',
    paymentMethod: 'cash',
    recordedBy: 'Jonathan Hayes',
    previousMileage: 22400,
    currentMileage: 24300,
    kmDriven: 1900,
    notes: 'Remaining $450 to be paid on 18th Sep'
  }
];

export const demoEliteCustomers: Customer[] = [
  {
    id: 'cust-elite-1',
    name: 'Manhattan Financial Partners',
    companyName: 'MFP Capital Management',
    contactPerson: 'Sarah Jenkins (VP Ops)',
    phone: '+1 (212) 555-4400',
    email: 'travel@mfpcapital.com',
    address: 'Rockefeller Center, 45 Rockefeller Plaza, New York, NY',
    crNumber: 'DEL-CORP-9921',
    taxNumber: 'US-EIN-44-102938',
    totalRentals: 14,
    outstandingBalance: 0,
    rating: 5.0,
    status: 'active'
  },
  {
    id: 'cust-elite-2',
    name: 'Apex Entertainment Group',
    companyName: 'Apex Talent & Touring',
    contactPerson: 'Derek Ross',
    phone: '+1 (917) 555-6677',
    email: 'logistics@apexgroup.com',
    address: 'Broadway & 48th St, New York, NY',
    totalRentals: 6,
    outstandingBalance: 1200,
    rating: 4.9,
    status: 'active'
  }
];

export const demoEliteRentals: RentalContract[] = [
  {
    id: 'rent-elite-1',
    contractNumber: 'VIP-NYC-2026-01',
    customerId: 'cust-elite-1',
    customerName: 'Manhattan Financial Partners',
    vehicleId: 'elite-veh-1',
    vehicleName: 'Mercedes-Benz S 580',
    plateNumber: 'NY-ELITE-01',
    driverAssignedId: 'elite-drv-1',
    driverName: 'David Miller',
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    dailyRate: 650,
    totalRentalAmount: 19500,
    depositAmount: 3000,
    paymentStatus: 'paid',
    status: 'active',
    termsAndConditions: 'Executive chauffeur standby 24/7 with JFK, EWR, LGA airport clearances.'
  }
];

export const demoEliteExpenses: Expense[] = [
  {
    id: 'exp-elite-1',
    expenseNumber: 'EXP-NYC-101',
    category: 'fleet',
    subcategory: 'Fuel & Fleet Detailing',
    date: '2026-09-12',
    amount: 850,
    paymentAccount: 'Chase Commercial Checking',
    vendor: 'Manhattan Auto Detail & Mobil 1',
    description: 'Bi-weekly ceramic detailing & premium fuel passes for S-Class & Escalade',
    isRecurring: false,
    status: 'paid',
    recordedBy: 'Jonathan Hayes'
  },
  {
    id: 'exp-elite-2',
    expenseNumber: 'EXP-NYC-102',
    category: 'office_admin',
    subcategory: 'Fleet Insurance Policy',
    date: '2026-09-01',
    amount: 2400,
    paymentAccount: 'Chase Commercial Checking',
    vendor: 'Travelers Commercial Auto Insurance',
    description: 'Monthly commercial limousine fleet liability insurance',
    isRecurring: true,
    recurringFrequency: 'monthly',
    status: 'paid',
    recordedBy: 'Jonathan Hayes'
  }
];
