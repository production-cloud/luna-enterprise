import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "./pages/NotFound.tsx";
import { LunaLayout } from "./luna/Layout";
import { RequireAuth } from "./luna/RequireAuth";
import Login from "./luna/pages/Login";
import Overview from "./luna/pages/Overview";
import Cycle from "./luna/pages/Cycle";
import Biomarkers from "./luna/pages/Biomarkers";
import Lifestyle from "./luna/pages/Lifestyle";
import Insights from "./luna/pages/Insights";
import Partner from "./luna/pages/Partner";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<RequireAuth />}>
            <Route element={<LunaLayout />}>
              <Route path="/" element={<Overview />} />
              <Route path="/cycle" element={<Cycle />} />
              <Route path="/biomarkers" element={<Biomarkers />} />
              <Route path="/lifestyle" element={<Lifestyle />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/partner" element={<Partner />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
