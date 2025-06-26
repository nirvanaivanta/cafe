'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Dummy login check
    if (username === 'admin' && password === 'admin123') {
      // Optional: sessionStorage.setItem('isLoggedIn', 'true');
      router.push('/menu/admin');
    } else {
      setErrorMsg('Username atau password salah!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9E0BB] px-4">
      <div className="bg-white/80 backdrop-blur-md p-10 rounded-3xl shadow-lg w-full max-w-md border border-[#FFC26F]/40">
        <h1 className="text-3xl font-extrabold text-center mb-8 text-[#884A39] font-serif tracking-wide">
          Login Admin
        </h1>

        {errorMsg && (
          <p className="mb-4 text-red-600 text-sm text-center">{errorMsg}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-1 text-[#884A39]">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded border border-[#FFC26F]/60 text-[#884A39] focus:outline-none focus:ring-2 focus:ring-[#FFC26F]"
              placeholder="Masukkan username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-[#884A39]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded border border-[#FFC26F]/60 text-[#884A39] focus:outline-none focus:ring-2 focus:ring-[#FFC26F]"
              placeholder="Masukkan password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#884A39] text-white py-2 rounded-xl hover:bg-[#A45F44] transition"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}
