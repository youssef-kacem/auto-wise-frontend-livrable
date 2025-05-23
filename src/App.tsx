import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CarList from "./pages/CarList";
import CarDetail from "./pages/CarDetail";
import Profile from "./pages/Profile";
import Messages from "./pages/Messages";
import Payment from "./pages/Payment";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import About from "./pages/About";
import BookingProcess from "./pages/BookingProcess";
import BookingConfirmation from "./pages/BookingConfirmation";
import BookingSuccessPage from "./pages/BookingSuccessPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCars from "./pages/admin/AdminCars";
import AdminUserManagement from "./pages/admin/UserManagement";
import AdminReservations from "./pages/admin/AdminReservations";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminIoT from "./pages/admin/AdminIoT";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Pages publiques */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cars" element={<CarList />} />
            <Route path="/cars/:id" element={<CarDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/driver" element={<Services />} />
            <Route path="/services/insurance" element={<Services />} />
            <Route path="/services/rental" element={<Services />} />
            <Route path="/services/long-term" element={<Services />} />

            {/* Pages utilisateur */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/payment/:id" element={<Payment />} />
            <Route path="/booking" element={<BookingProcess />} />
            <Route path="/booking-confirmation" element={<BookingConfirmation />} />
            <Route path="/booking-success/:id" element={<BookingSuccessPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Routes Admin */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUserManagement />} />
            <Route path="/admin/cars" element={<AdminCars />} />
            <Route path="/admin/reservations" element={<AdminReservations />} />
            <Route path="/admin/messages" element={<AdminMessages />} />
            <Route path="/admin/iot" element={<AdminIoT />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            
            {/* Route 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
