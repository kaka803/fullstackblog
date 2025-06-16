'use client';
import React, { useState } from "react";
import Link from "next/link";
import { LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

export default function Navbar({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    onLogout();
    router.push('/login');
    window.location.reload();
  };

  return (
    <nav className="bg-[#121212] shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="text-white text-2xl font-bold cursor-pointer select-none hover:text-gray-300 transition">
            Hassnain Writes
          </div>
        </Link>

        {/* Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white focus:outline-none"
          aria-label="Toggle Menu"
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Navigation Links */}
        <ul
  className={`navbar-ul flex transition-all duration-500 ease-in-out transform
    flex-col justify-center min-h-screen md:min-h-0 gap-5 items-center
    md:flex-row md:flex md:items-center md:space-x-8
    absolute md:static top-full left-0 w-full md:w-auto
    bg-[#121212] md:bg-transparent px-6 md:px-0 py-4 md:py-0
    border-t border-gray-700 md:border-0
    ${isOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}
    md:opacity-100 md:scale-100 md:pointer-events-auto
  `}
>
          {[
            { label: "Home", path: "/" },
            { label: "Categories", path: "/Categories" },
            { label: "All Blogs", path: "/blogs" },
            { label: "User Blogs", path: "/userblogs" },
            { label: "Dashboard", path: "/dashboard" },
          ].map(({ label, path }) => (
            <Link key={label} href={path}>
              <li className="cursor-pointer text-white hover:text-gray-400 transition duration-300 py-2 md:py-0">
                {label}
              </li>
            </Link>
          ))}

          {/* Mobile Auth Buttons */}
          {isOpen && (
            <div className="flex items-center flex-col space-y-3 md:hidden mt-4 w-full">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 focus:outline-none text-white">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-black">
                          {user?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span>{user.name}</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#1f1f1f] text-white border border-gray-700 w-56 mt-2">
                    <DropdownMenuLabel>
                      <div className="text-sm">{user.name}</div>
                      <div className="text-xs text-gray-400">{user.email}</div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem className="hover:bg-gray-700">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-400 hover:bg-gray-700 cursor-pointer"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link href="/login">
                    <button className="w-full px-5 py-2 rounded-full border border-white text-white hover:bg-white hover:text-black transition duration-300 font-semibold">
                      Login
                    </button>
                  </Link>
                  <Link href="/signup">
                    <button className="w-full mt-2 px-5 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-pink-600 hover:to-purple-600 text-white font-semibold transition duration-500 transform hover:scale-105">
                      Sign Up
                    </button>
                  </Link>
                </>
              )}
            </div>
          )}
        </ul>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2 focus:outline-none">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-black">
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-white">{user.name}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#1f1f1f] text-white border border-gray-700 w-56 mt-2">
                <DropdownMenuLabel>
                  <div className="text-sm">{user.name}</div>
                  <div className="text-xs text-gray-400">{user.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem className="hover:bg-gray-700">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-400 hover:bg-gray-700 cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-3">
              <Link href="/login">
                <button className="px-5 py-2 rounded-full border border-white text-white hover:bg-white hover:text-black transition duration-300 font-semibold">
                  Login
                </button>
              </Link>
              <Link href="/signup">
                <button className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-pink-600 hover:to-purple-600 text-white font-semibold transition duration-500 transform hover:scale-105">
                  Sign Up
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
