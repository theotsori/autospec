'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function OnboardingPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      businessName: formData.get('businessName'),
      businessType: formData.get('businessType'),
      startingCash: Number(formData.get('startingCash') || 0),
      mpesaFloat: Number(formData.get('mpesaFloat') || 0),
      products: [1, 2, 3]
        .map((i) => ({
          name: formData.get(`productName${i}`),
          unitCost: Number(formData.get(`productCost${i}`) || 0),
          quantity: Number(formData.get(`productQty${i}`) || 0)
        }))
        .filter((p) => p.name)
    };

    const res = await fetch('/api/onboarding', { method: 'POST', body: JSON.stringify(payload) });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Could not save onboarding');
      return;
    }
    router.push('/dashboard');
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-md p-4">
      <div className="card mt-6">
        <h1 className="text-xl font-bold">Business setup</h1>
        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <input className="input" name="businessName" placeholder="Business name" required />
          <select className="input" name="businessType" required>
            <option>Salon</option><option>Kiosk</option><option>Barbershop</option><option>Boutique</option>
          </select>
          <input className="input" type="number" name="startingCash" placeholder="Starting cash" required />
          <input className="input" type="number" name="mpesaFloat" placeholder="Mpesa float" required />
          {[1,2,3].map((n)=><div key={n} className="grid grid-cols-3 gap-2"><input className="input col-span-2" name={`productName${n}`} placeholder={`Product ${n} (optional)`}/><input className="input" type="number" name={`productQty${n}`} placeholder="Qty"/><input className="input" type="number" name={`productCost${n}`} placeholder="Cost"/></div>)}
          <button className="btn w-full bg-indigo-600">Finish setup</button>
        </form>
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      </div>
    </main>
  );
}
