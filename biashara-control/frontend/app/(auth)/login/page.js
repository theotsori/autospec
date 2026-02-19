'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    const formData = new FormData(e.currentTarget);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(formData.entries()))
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Login failed');
      return;
    }
    router.push('/dashboard');
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-md p-4">
      <div className="card mt-10">
        <h1 className="text-2xl font-bold">Login</h1>
        <form className="mt-4 space-y-3" onSubmit={onSubmit}>
          <input className="input" name="email" type="email" placeholder="Email" required />
          <input className="input" name="password" type="password" placeholder="Password" required />
          <button className="btn w-full bg-indigo-600">Login</button>
        </form>
        <a className="mt-3 block text-sm text-indigo-300" href="/signup">No account? Sign up</a>
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      </div>
    </main>
  );
}
