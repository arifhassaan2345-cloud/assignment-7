"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/sign-in/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login ব্যর্থ হয়েছে");
      }

      setMessage("Login সফল হয়েছে!");
      window.location.href = "/";
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "একটি সমস্যা হয়েছে"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md space-y-5 rounded-2xl bg-white p-8 shadow-lg"
      >
        <h1 className="text-center text-3xl font-bold">Login</h1>
        <p className="text-center text-gray-500">Welcome back to Bazar Dor</p>

        <div>
          <label className="mb-1 block">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border p-3"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="mb-1 block">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border p-3"
            placeholder="Enter your password"
          />
        </div>

        {message && <p role="status" className="text-sm text-red-600">{message}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-green-700 p-3 font-semibold text-white hover:bg-green-800 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm">
          Don't have an account? <a href="/register" className="font-semibold text-green-700">Register</a>
        </p>
      </form>
    </main>
  );
}