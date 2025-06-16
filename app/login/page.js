'use client';
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Eye, EyeOff } from 'lucide-react';
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";



const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter()
        const [email, setemail] = useState('')
            const [password, setpassword] = useState('')
            const [loading, setLoading] = useState(false);

            const handlelogin = async (e) => {
          e.preventDefault();
          setLoading(true);
          const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email,password}),
      });
      const data = await res.json();
      setLoading(false);
    if (data.token) {
      localStorage.setItem("token", data.token);
      console.log("Token:", localStorage.getItem("token"));
      router.push("/");
    } else {
      alert(data.error);
    }
    }
  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">
      <motion.div {...fadeUp} className="bg-[#1b1b1b] p-10 rounded-2xl w-full max-w-md shadow-lg">
        <h2 className="text-3xl font-semibold text-white text-center mb-6">Login to InsightVerse</h2>
        <form onSubmit={handlelogin} className="space-y-5">
          <div className="flex flex-col space-y-1">
            <label className="text-white text-sm">Email</label>
            <Input value={email}
            onChange={(e) => setemail(e.target.value)} placeholder="Enter your email" type="email" className="bg-[#2c2c2c] text-white border-none focus:ring-2 focus:ring-white" />
          </div>
          <div className="flex flex-col space-y-1 relative">
            <label className="text-white text-sm">Password</label>
            <Input
            value={password}
            onChange={(e) => setpassword(e.target.value)}
              placeholder="Enter your password"
              type={showPassword ? 'text' : 'password'}
              className="bg-[#2c2c2c] text-white border-none pr-10 focus:ring-2 focus:ring-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute bottom-2 right-3 text-gray-400 hover:text-white `}
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
          <Button className={`w-full  bg-white text-black rounded-full hover:bg-gray-300 ${
    loading ? 'opacity-50 cursor-not-allowed' : ''
  }`}>{loading ? 'Logging in...' : 'Log in'}</Button>
        </form>
        <p className="text-center text-sm text-gray-400 mt-4">
  Don’t have an account?{' '}
  <Link href="/signup" className="text-white underline">
    Sign up
  </Link>
</p>
<p className="text-sm text-center mt-2 text-[#94a3b8]">
          <Link href="/" className="text-cyan-400 hover:underline">
            ← Back to Home
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

export default Login
