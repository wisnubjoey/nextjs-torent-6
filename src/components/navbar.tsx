'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur border-b border-black/10">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-black">
          <span>Torent</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <Link href="/vehicles" className="text-sm font-medium text-zinc-700 hover:text-black">
            Vehicles
          </Link>
          <Link href="/contact-us" className="text-sm font-medium text-zinc-700 hover:text-black">
            Contact Us
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/sign-in" className="text-sm font-medium text-zinc-700 hover:text-black">
            Sign in
          </Link>
          <Link href="/sign-up" className="text-sm font-medium bg-black text-white px-4 py-2 rounded-md hover:bg-black/80 transition-colors">
            Sign up
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={open}
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-zinc-700 hover:text-black hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-black"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
              <path d="M6.225 4.811a1 1 0 0 1 1.414 0L12 9.172l4.361-4.361a1 1 0 1 1 1.414 1.414L13.414 10.586l4.361 4.361a1 1 0 0 1-1.414 1.414L12 12l-4.361 4.361a1 1 0 1 1-1.414-1.414l4.361-4.361-4.361-4.361a1 1 0 0 1 0-1.414Z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
              <path d="M3.75 6.75h16.5a.75.75 0 0 0 0-1.5H3.75a.75.75 0 0 0 0 1.5Zm0 6h16.5a.75.75 0 0 0 0-1.5H3.75a.75.75 0 0 0 0 1.5Zm0 6h16.5a.75.75 0 0 0 0-1.5H3.75a.75.75 0 0 0 0 1.5Z" />
            </svg>
          )}
        </button>
      </div>

      <div
        className={`md:hidden transition-all duration-200 ease-out ${open ? 'grid grid-rows-[1fr] opacity-100' : 'grid grid-rows-[0fr] opacity-0'} bg-white border-t border-black/10`}
      >
        <div className="overflow-hidden">
          <div className="px-4 sm:px-6 py-3 flex flex-col gap-3">
            <Link
              href="/vehicles"
              className="text-base font-medium text-zinc-800 hover:text-black"
              onClick={() => setOpen(false)}
            >
              Vehicles
            </Link>
            <Link
              href="/contact-us"
              className="text-base font-medium text-zinc-800 hover:text-black"
              onClick={() => setOpen(false)}
            >
              Contact Us
            </Link>
            <div className="h-px bg-black/5 my-1" />
            <Link
              href="/sign-in"
              className="text-base font-medium text-zinc-800 hover:text-black"
              onClick={() => setOpen(false)}
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="text-base font-medium text-zinc-800 hover:text-black"
              onClick={() => setOpen(false)}
            >
              Sign up
            </Link>
        
          </div>
        </div>
      </div>
    </nav>
  );
}
