"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/lib/hooks/useAuth";

export default function LoginPage() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleLogin,
  } = useAuth();

  return (
    <div className="flex min-h-screen w-full font-sans">
      {/* Left Column: Brand Info - Purple Background */}
      <div className="hidden lg:flex w-[60%] flex-col justify-center bg-[#6200EE] p-16 text-white relative overflow-hidden">
        {/* Logo Top Left */}
        <div className="absolute top-8 left-8">
          <div className="relative w-32 h-10">
            <Image
              src="/logo.png"
              alt="Fisiohome"
              fill
              className="object-contain object-left brightness-0 invert"
            />
          </div>
        </div>

        <div className="max-w-md z-10 mt-6">
          <h1 className="text-3xl font-bold mb-4">Tentang Fisiohome</h1>
          <p className="text-base leading-relaxed opacity-90 mb-6">
            Fisiohome adalah layanan home visit fisioterapi yang membawa
            perawatan fisioterapi berkualitas langsung ke pintu rumah Anda.
            Dengan Fisiohome, Anda dapat menikmati perawatan fisioterapi yang
            nyaman dan personal tanpa harus pergi ke klinik atau rumah sakit.
          </p>
          {/* Pagination dots */}
          <div className="flex gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-white/40"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-white/40"></div>
          </div>
        </div>
      </div>

      {/* Right Column: Login Form - White Background */}
      <div className="flex flex-1 flex-col justify-center items-center bg-white p-8">
        {/* Mobile Logo */}
        <div className="lg:hidden mb-6 w-32 h-10 relative">
          <Image
            src="/logo.png"
            alt="Fisiohome"
            fill
            className="object-contain"
          />
        </div>

        <div className="w-full max-w-100 space-y-6 bg-white p-8 border border-slate-100 rounded-3xl shadow-xl shadow-slate-200/50">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-1.5">
              Log In
            </h2>
            <p className="text-sm text-slate-500">Silakan masukkan detail Anda</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert
                variant="destructive"
                className="bg-red-50 text-red-600 border-red-200"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-600 text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                required
                className="h-10 text-sm rounded-xl bg-slate-50 border-slate-200 focus:ring-2 focus:ring-[#6200EE] focus:border-[#6200EE] transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label
                  htmlFor="password"
                  className="text-slate-600 text-sm font-medium"
                >
                  Kata sandi
                </Label>
              </div>
              <Input
                id="password"
                type="password"
                required
                className="h-10 text-sm rounded-xl bg-slate-50 border-slate-200 focus:ring-2 focus:ring-[#6200EE] focus:border-[#6200EE] transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="rounded border-gray-300 text-[#6200EE] focus:ring-[#6200EE]"
                />
                <label htmlFor="remember" className="text-sm text-slate-500">
                  Ingat saya
                </label>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#6200EE] hover:bg-[#5000CC] text-white rounded-xl h-10 text-sm font-semibold shadow-lg shadow-purple-200 transition-all mt-4"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Masuk...
                </>
              ) : (
                "Masuk"
              )}
            </Button>

            <div className="text-center text-sm text-slate-500 mt-4">
              Copyright © 2026 Fisiohome. All rights reserved.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
