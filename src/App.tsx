
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SuperuserProvider } from "@/contexts/SuperuserContext";
import AdminRoute from "@/components/auth/AdminRoute";
import SuperuserRoute from "@/components/auth/SuperuserRoute";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";
import Index from "./pages/Index";
import LearnPage from "./pages/LearnPage";
import ShopPage from "./pages/ShopPage";
import CommunityPage from "./pages/CommunityPage";
import AccountPage from "./pages/AccountPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersManagement from "./pages/admin/UsersManagement";
import ProductsManagement from "./pages/admin/ProductsManagement";
import CoursesManagement from "./pages/admin/CoursesManagement";
import CommunityManagement from "./pages/admin/CommunityManagement";
import SettingsPage from "./pages/admin/SettingsPage";
import ProfilePage from "./pages/admin/ProfilePage";

// Superuser pages
import SuperuserLogin from "./pages/superuser/SuperuserLogin";
import SuperuserDashboard from "./pages/superuser/SuperuserDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SuperuserProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <OnboardingFlow />
            <Routes>
            {/* Main app routes */}
            <Route path="/" element={<Index />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:orderId" element={<OrderConfirmationPage />} />

            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><UsersManagement /></AdminRoute>} />
            <Route path="/admin/products" element={<AdminRoute><ProductsManagement /></AdminRoute>} />
            <Route path="/admin/courses" element={<AdminRoute><CoursesManagement /></AdminRoute>} />
            <Route path="/admin/community" element={<AdminRoute><CommunityManagement /></AdminRoute>} />
            <Route path="/admin/settings" element={<AdminRoute><SettingsPage /></AdminRoute>} />
            <Route path="/admin/profile" element={<AdminRoute><ProfilePage /></AdminRoute>} />

            {/* Superuser routes */}
            <Route path="/superuser/login" element={<SuperuserLogin />} />
            <Route path="/superuser" element={<SuperuserRoute><SuperuserDashboard /></SuperuserRoute>} />

            {/* Fallback route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </TooltipProvider>
      </SuperuserProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
