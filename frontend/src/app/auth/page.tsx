"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";

export default function AuthPortal() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { data: session }: any = useSession();

  // --- INTERCEPT GOOGLE TOKENS & FORWARD TO DJANGO ---
  useEffect(() => {
    if (session?.accessToken) {
      handleGoogleBackendExchange(session.accessToken);
    }
  }, [session]);

  const handleGoogleBackendExchange = async (accessToken: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google-exchange/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: accessToken }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Google calibration match failed.");

      Cookies.set("access_token", data.token, { expires: 1 });
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const endpoint = isSignUp ? "/api/auth/register/" : "/api/token/"; // Direct access validation
    const payload = isSignUp ? formData : { username: formData.email, password: formData.password };

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || data.error || "Authentication failed.");

        const token = isSignUp ? data.token : data.access;
        Cookies.set("access_token", token, { expires: 1 });
        window.location.href = "/";
    } catch (err: any) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-6 selection:bg-neutral-100 selection:text-neutral-900">
      <div className="w-full max-w-[420px] flex flex-col space-y-8">
        
        <div className="flex flex-col items-center space-y-3">
          <div className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center">
            <div className="w-5 h-5 rounded-full bg-black" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-950">
              {isSignUp ? "Create your account" : "Welcome back"}
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              {isSignUp ? "Enter details to create your secure customer profile" : "Sign in to manage your e-commerce command matrix"}
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 border border-red-100 text-xs rounded-md text-center">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="popLayout">
              {isSignUp && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }}>
                  <label className="block text-xs font-medium text-neutral-700 uppercase tracking-wider mb-1.5">Full Name</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2.5 bg-white border border-neutral-200 text-neutral-900 text-sm rounded-md focus:outline-none focus:border-black transition-colors" placeholder="Alex Morgan" />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-xs font-medium text-neutral-700 uppercase tracking-wider mb-1.5">Email Address</label>
              <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full px-3 py-2.5 bg-white border border-neutral-200 text-neutral-900 text-sm rounded-md focus:outline-none focus:border-black transition-colors" placeholder="name@domain.com" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-medium text-neutral-700 uppercase tracking-wider">Password</label>
              </div>
              <input type="password" name="password" required value={formData.password} onChange={handleInputChange} className="w-full px-3 py-2.5 bg-white border border-neutral-200 text-neutral-900 text-sm rounded-md focus:outline-none focus:border-black transition-colors" placeholder="••••••••" />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-neutral-950 hover:bg-neutral-800 disabled:bg-neutral-400 text-white font-medium text-sm py-3 rounded-md transition-all duration-200 shadow-sm mt-2">
              {loading ? "Authenticating Platform Access..." : isSignUp ? "Sign Up" : "Sign In"}
            </button>
          </form>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-neutral-100"></div>
            <span className="flex-shrink mx-4 text-xs text-neutral-400 uppercase tracking-widest">or</span>
            <div className="flex-grow border-t border-neutral-100"></div>
          </div>

          <button type="button" onClick={() => signIn("google")} className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-neutral-200 hover:border-neutral-400 font-medium text-sm text-neutral-700 rounded-md transition-colors duration-200">
            <svg className="w-5 h-5" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <div className="text-center text-sm text-neutral-500">
          {isSignUp ? "Already have an account? " : "New to the platform? "}
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-neutral-950 font-medium underline underline-offset-4 transition-colors">
            {isSignUp ? "Sign In" : "Create Profile"}
          </button>
        </div>

      </div>
    </div>
  );
}