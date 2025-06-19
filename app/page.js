"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-3xl font-bold mb-4">FinScope B2B Hackathon Project 🚀</h1>
      <p className="mb-8">Selamat datang! Pilih fitur di bawah ini untuk mulai.</p>

      <div className="flex flex-col gap-4">
        <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-center">
          Login
        </Link>
        <Link href="/dashboard" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-center">
          Dashboard
        </Link>
        <Link href="/admin" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg text-center">
          Admin Panel
        </Link>
      </div>
    </main>
  );
}
