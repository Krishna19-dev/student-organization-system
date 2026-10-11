import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Public Pages
import HomePage from "@/app/page";
import AboutPage from "@/app/about/page";
import AnnouncementsPage from "@/app/announcements/page";
import ApplicationStatusPage from "@/app/application-status/page";
import EventsPage from "@/app/events/page";
import EventDetailPage from "@/pages/events/EventDetailPage";
import CheckoutTicketPage from "@/pages/events/CheckoutTicketPage";
import ShopPage from "@/pages/shop/ShopPage";
import ProductDetailPage from "@/pages/shop/ProductDetailPage";
import MembershipPage from "@/app/membership/page";
import LoginPage from "@/app/login/page";
import SignupPage from "@/pages/auth/SignupPage";
import JoinPayPage from "@/pages/auth/JoinPayPage";
import MemberVerifyPage from "@/pages/public/MemberVerifyPage";

// Member Portal Pages (/me/*)
import MemberDashboardPage from "@/pages/member/MemberDashboardPage";
import DigitalCardPage from "@/pages/member/DigitalCardPage";
import MemberPlanPage from "@/pages/member/MemberPlanPage";
import MyTicketsPage from "@/pages/member/MyTicketsPage";
import MyOrdersPage from "@/pages/member/MyOrdersPage";

// Treasurer Portal Pages (/finance/*)
import FinanceDashboardPage from "@/pages/finance/FinanceDashboardPage";
import FinanceLedgerPage from "@/pages/finance/FinanceLedgerPage";
import FinanceClaimsPage from "@/pages/finance/FinanceClaimsPage";
import FinanceClaimReviewPage from "@/pages/finance/FinanceClaimReviewPage";
import FinanceEventPnlPage from "@/pages/finance/FinanceEventPnlPage";
import FinanceFundraiserProceedsPage from "@/pages/finance/FinanceFundraiserProceedsPage";

// President & Operations Pages (/admin/* - all VP operations consolidated under President)
import AdminPage from "@/app/admin/page";
import AdminEventsPage from "@/pages/admin/AdminEventsPage";
import AdminEventFormPage from "@/pages/admin/AdminEventFormPage";
import AdminEventTasksPage from "@/pages/admin/AdminEventTasksPage";
import AdminEventReportPage from "@/pages/admin/AdminEventReportPage";
import AdminNewAnnouncementPage from "@/pages/admin/AdminNewAnnouncementPage";
import AdminFundraisersPage from "@/pages/admin/AdminFundraisersPage";
import AdminVolunteersPage from "@/pages/admin/AdminVolunteersPage";
import AdminOrdersPage from "@/pages/admin/AdminOrdersPage";
import AdminDeliverablesPage from "@/pages/admin/AdminDeliverablesPage";
import AdminMembersPage from "@/pages/admin/AdminMembersPage";
import AdminRolesPage from "@/pages/admin/AdminRolesPage";
import AdminProductsPage from "@/pages/admin/AdminProductsPage";
import AdminSponsorsPage from "@/pages/admin/AdminSponsorsPage";
import AdminAuditPage from "@/pages/admin/AdminAuditPage";
import AdminHandoverPage from "@/pages/admin/AdminHandoverPage";
import AdminMemberVerificationPage from "@/pages/admin/AdminMemberVerificationPage";

// Volunteer Desk
import VolunteerPage from "@/app/volunteer/page";

// 404 Not Found
import NotFoundPage from "@/app/not-found";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-page text-body antialiased">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          {/* =========================================
              1. Guest (Public Site)
             ========================================= */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/announcements" element={<AnnouncementsPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shop/:id" element={<ProductDetailPage />} />
          <Route path="/membership" element={<MembershipPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/join/pay" element={<JoinPayPage />} />
          <Route path="/checkout/ticket/:id" element={<CheckoutTicketPage />} />
          <Route path="/application-status" element={<ApplicationStatusPage />} />
          <Route path="/verify/:token" element={<MemberVerifyPage />} />

          {/* =========================================
              2. Member Portal (/me/*)
             ========================================= */}
          <Route path="/me" element={<MemberDashboardPage />} />
          <Route path="/me/card" element={<DigitalCardPage />} />
          <Route path="/me/digital-card" element={<DigitalCardPage />} />
          <Route path="/me/membership" element={<MemberPlanPage />} />
          <Route path="/me/tickets" element={<MyTicketsPage />} />
          <Route path="/me/orders" element={<MyOrdersPage />} />

          {/* =========================================
              3. Treasurer / Treasury Portal (/finance/*)
             ========================================= */}
          <Route path="/finance" element={<FinanceDashboardPage />} />
          <Route path="/finance/ledger" element={<FinanceLedgerPage />} />
          <Route path="/finance/claims" element={<FinanceClaimsPage />} />
          <Route path="/finance/claims/:id" element={<FinanceClaimReviewPage />} />
          <Route path="/finance/events/:id" element={<FinanceEventPnlPage />} />
          <Route path="/finance/fundraisers/:id" element={<FinanceFundraiserProceedsPage />} />

          {/* =========================================
              4. President / Admin Portal (/admin/*)
              Incorporating all VP and Executive Operations
             ========================================= */}
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/members" element={<AdminMembersPage />} />
          <Route path="/admin/member-verification" element={<AdminMemberVerificationPage />} />
          <Route path="/admin/roles" element={<AdminRolesPage />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/products/:id" element={<AdminProductsPage />} />
          <Route path="/admin/sponsors" element={<AdminSponsorsPage />} />
          <Route path="/admin/sponsors/:id" element={<AdminSponsorsPage />} />
          <Route path="/admin/audit" element={<AdminAuditPage />} />
          <Route path="/admin/handover" element={<AdminHandoverPage />} />

          {/* Consolidated Operations (Transferred from VP to President) */}
          <Route path="/admin/events" element={<AdminEventsPage />} />
          <Route path="/admin/events/new" element={<AdminEventFormPage />} />
          <Route path="/admin/events/:id/edit" element={<AdminEventFormPage />} />
          <Route path="/admin/events/:id/tasks" element={<AdminEventTasksPage />} />
          <Route path="/admin/events/:id/report" element={<AdminEventReportPage />} />
          <Route path="/admin/announcements/new" element={<AdminNewAnnouncementPage />} />
          <Route path="/admin/fundraisers" element={<AdminFundraisersPage />} />
          <Route path="/admin/fundraisers/:id" element={<AdminFundraisersPage />} />
          <Route path="/admin/volunteers" element={<AdminVolunteersPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/deliverables" element={<AdminDeliverablesPage />} />

          {/* Volunteer Desk */}
          <Route path="/volunteer" element={<VolunteerPage />} />

          {/* =========================================
              5. Backward-Compatible Aliases & Redirects
             ========================================= */}
          <Route path="/merch" element={<Navigate to="/shop" replace />} />
          <Route path="/register" element={<Navigate to="/signup" replace />} />
          <Route path="/pay" element={<Navigate to="/join/pay" replace />} />
          <Route path="/member" element={<Navigate to="/me" replace />} />
          <Route path="/profile" element={<Navigate to="/me" replace />} />
          <Route path="/guest" element={<Navigate to="/me" replace />} />
          <Route path="/treasurer" element={<Navigate to="/finance" replace />} />
          <Route path="/events-manager" element={<Navigate to="/admin/events" replace />} />
          <Route path="/vp" element={<Navigate to="/admin" replace />} />
          <Route path="/vp/*" element={<Navigate to="/admin" replace />} />

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
