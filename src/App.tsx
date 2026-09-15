/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ErpProvider, useErp } from './context/ErpContext';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { RightPanel } from './components/common/RightPanel';
import { ToastContainer } from './components/common/ToastContainer';

// Views
import { DashboardView } from './components/views/DashboardView';
import { VehiclesView } from './components/views/VehiclesView';
import { DriversView } from './components/views/DriversView';
import { PaymentsView } from './components/views/PaymentsView';
import { AssignmentsView } from './components/views/AssignmentsView';
import { CustomersView } from './components/views/CustomersView';
import { RentalsView } from './components/views/RentalsView';
import { FinanceView } from './components/views/FinanceView';
import { MaintenanceView } from './components/views/MaintenanceView';
import { MileageHubView } from './components/views/MileageHubView';
import { FinesView } from './components/views/FinesView';
import { DocumentsView } from './components/views/DocumentsView';
import { ReportsView } from './components/views/ReportsView';
import { NotificationsView } from './components/views/NotificationsView';
import { HrPayrollView } from './components/views/HrPayrollView';
import { SettingsView } from './components/views/SettingsView';
import { SuperAdminView } from './components/views/SuperAdminView';
import { SubscriptionBillingView } from './components/views/SubscriptionBillingView';
import { TeamUsersView } from './components/views/TeamUsersView';
import { SupportCenterView } from './components/views/SupportCenterView';
import { DriverPortalView } from './components/views/DriverPortalView';
import { SaaSMarketingLanding } from './components/views/SaaSMarketingLanding';

// Modals
import { PaymentCheckpointModal } from './components/modals/PaymentCheckpointModal';
import { ReceiptModal } from './components/modals/ReceiptModal';
import { VehicleProfileModal } from './components/modals/VehicleProfileModal';
import { DriverProfileModal } from './components/modals/DriverProfileModal';
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';
import { QuickActionsModals } from './components/modals/QuickActionsModals';
import { OnboardingWizardModal } from './components/modals/OnboardingWizardModal';
import { PlanLimitUpgradeModal } from './components/modals/PlanLimitUpgradeModal';

const MainLayout: React.FC = () => {
  const { activeTab } = useErp();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'vehicles':
      case 'fleet':
        return <VehiclesView />;
      case 'drivers':
        return <DriversView />;
      case 'payments':
        return <PaymentsView />;
      case 'assignments':
        return <AssignmentsView />;
      case 'customers':
        return <CustomersView />;
      case 'rentals':
        return <RentalsView />;
      case 'finance':
      case 'expenses':
        return <FinanceView />;
      case 'maintenance':
        return <MaintenanceView />;
      case 'mileage':
        return <MileageHubView />;
      case 'fines':
        return <FinesView />;
      case 'documents':
        return <DocumentsView />;
      case 'reports':
        return <ReportsView />;
      case 'notifications':
        return <NotificationsView />;
      case 'hr':
      case 'payroll':
        return <HrPayrollView />;
      case 'settings':
        return <SettingsView />;
      case 'superadmin':
        return <SuperAdminView />;
      case 'billing':
      case 'subscription':
        return <SubscriptionBillingView />;
      case 'team':
      case 'users':
        return <TeamUsersView />;
      case 'support':
      case 'tickets':
        return <SupportCenterView />;
      case 'driver_portal':
        return <DriverPortalView />;
      case 'landing':
        return <SaaSMarketingLanding />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans text-slate-800 antialiased selection:bg-amber-500 selection:text-white">
      {/* Left Navigation Sidebar */}
      <Sidebar isMobileOpen={isMobileSidebarOpen} setIsMobileOpen={setIsMobileSidebarOpen} />

      {/* Main Center Stage */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <Header onOpenMobileMenu={() => setIsMobileSidebarOpen(true)} />

        {/* Scrollable Workspace View */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
          <div className="mx-auto max-w-7xl">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Right Intelligence & Quick Context Panel */}
      <RightPanel />

      {/* Toast Notification Container */}
      <ToastContainer />

      {/* System-Wide Modals */}
      <PaymentCheckpointModal />
      <ReceiptModal />
      <VehicleProfileModal />
      <DriverProfileModal />
      <GlobalSearchModal />
      <QuickActionsModals />
      <OnboardingWizardModal />
      <PlanLimitUpgradeModal />
    </div>
  );
};

export default function App() {
  return (
    <ErpProvider>
      <MainLayout />
    </ErpProvider>
  );
}
