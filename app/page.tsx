"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppProvider, useApp } from "@/lib/app-context";
import { UserDashboard } from "@/components/user-dashboard";
import { AdminPanel } from "@/components/admin-panel";
import { LoginForm } from "@/components/login-form";
import { Button } from "@/components/ui/button";

function ZapIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function AppContent() {
  const { isAdmin } = useApp();
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  useEffect(() => {
    const handleShowAdminLogin = () => setShowAdminLogin(true);
    window.addEventListener('show-admin-login', handleShowAdminLogin);
    return () => window.removeEventListener('show-admin-login', handleShowAdminLogin);
  }, []);

  if (isAdmin) {
    return <AdminPanel />;
  }

  if (showAdminLogin) {
    return (
      <div className="min-h-screen bg-background bg-grid flex flex-col">
        {/* Ambient glow effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <motion.div
              className="mx-auto mb-4"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow-cyan mx-auto">
                <ZapIcon className="w-10 h-10 text-primary-foreground" />
              </div>
            </motion.div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">PowerSync</h1>
            <p className="text-muted-foreground">Load Shedding Management System</p>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key="admin"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-md"
            >
              <LoginForm isAdmin onSuccess={() => setShowAdminLogin(false)} />
              <Button
                variant="ghost"
                onClick={() => setShowAdminLogin(false)}
                className="w-full mt-4"
              >
                Back to Dashboard
              </Button>
            </motion.div>
          </AnimatePresence>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full"
          >
            {[
              { title: "Real-time Tracking", desc: "Live outage status updates" },
              { title: "Smart Scheduling", desc: "Plan around power cuts" },
              { title: "Region Filtering", desc: "View your area only" },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="text-center p-4 rounded-xl glass border-border/30"
              >
                <h3 className="font-semibold text-sm">{feature.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 text-center py-4 text-sm text-muted-foreground">
          PowerSync - Stay Powered, Stay Informed
        </footer>
      </div>
    );
  }

  return <UserDashboard />;
}

export default function Home() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
