import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/hooks/useCart";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Registration from "./pages/Registration";
import Marketplace from "./pages/Marketplace";
import Cart from "./pages/Cart";
import UserProfile from "./pages/UserProfile";
import SupplierDashboard from "./pages/SupplierDashboard";
import SupplierOrders from "./pages/SupplierOrders";
import SupplierReports from "./pages/SupplierReports";
import SupplierProducts from "./pages/SupplierProducts";
import Orders from "./pages/Orders";
import PendingApproval from "./pages/PendingApproval";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/registration" element={<Registration />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/pending-approval" element={<PendingApproval />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/dashboard" element={<SupplierDashboard />} />
              <Route path="/supplier/products" element={<SupplierProducts />} />
              <Route path="/supplier/orders" element={<SupplierOrders />} />
              <Route path="/supplier/reports" element={<SupplierReports />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
