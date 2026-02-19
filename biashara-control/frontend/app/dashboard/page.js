'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import QuickEntryForm from '@/components/QuickEntryForm';
import StatCard from '@/components/StatCard';

function StatusBanner({ profit }) {
  const tone = profit > 0 ? 'bg-emerald-800 border-emerald-500' : profit === 0 ? 'bg-yellow-800 border-yellow-500' : 'bg-red-900 border-red-500';
  const msg = profit > 0 ? 'You made money today 👍' : profit === 0 ? 'You are close to zero profit' : 'You are losing money today ⚠️';
  return <section className={`card border-2 ${tone}`}><p className="text-lg font-semibold">{msg}</p><p className="text-4xl font-extrabold">KES {Math.round(profit).toLocaleString()}</p></section>;
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState(null);

  const load = async () => {
    const res = await fetch('/api/dashboard');
    if (res.status === 401) {
      router.push('/login');
      return;
    }
    setData(await res.json());
  };

  useEffect(() => { load(); }, []);

  if (!data) return <main className="mx-auto w-full max-w-md p-4">Loading...</main>;

  return (
    <main className="mx-auto w-full max-w-md space-y-3 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">{data.businessName || 'My Business'}</h1>
        <button className="btn bg-slate-700" onClick={async()=>{await fetch('/api/auth/logout',{method:'POST'});router.push('/login');}}>Logout</button>
      </div>

      <StatusBanner profit={data.metrics.profit} />

      <div className="grid grid-cols-2 gap-2">
        <StatCard label="Cash balance" value={data.balances.cash} />
        <StatCard label="Mpesa balance" value={data.balances.mpesa} />
        <StatCard label="Money owed" value={data.balances.owedToMe} />
        <StatCard label="Stock value" value={data.balances.stockValue} />
      </div>

      <button className="btn w-full bg-green-700" onClick={async()=>{await fetch('/api/mpesa/simulate',{method:'POST'});load();}}>Simulate Mpesa Transaction</button>

      <QuickEntryForm
        title="Record Sale"
        endpoint="/api/sales"
        onDone={load}
        fields={[
          { name: 'amount', type: 'number', placeholder: 'Amount' },
          { name: 'paymentMethod', type: 'select', options: ['cash', 'mpesa'] },
          { name: 'productId', type: 'text', placeholder: 'Optional product ID', required: false },
          { name: 'quantity', type: 'number', placeholder: 'Quantity sold', required: false }
        ]}
      />

      <QuickEntryForm
        title="Record Expense"
        endpoint="/api/expenses"
        onDone={load}
        fields={[
          { name: 'amount', type: 'number', placeholder: 'Amount' },
          { name: 'category', type: 'text', placeholder: 'Category' },
          { name: 'paymentMethod', type: 'select', options: ['cash', 'mpesa'] }
        ]}
      />

      <QuickEntryForm
        title="Record Stock Purchase"
        endpoint="/api/stock"
        onDone={load}
        fields={[
          { name: 'name', type: 'text', placeholder: 'Product name' },
          { name: 'buyingPrice', type: 'number', placeholder: 'Buying price' },
          { name: 'quantity', type: 'number', placeholder: 'Quantity' }
        ]}
      />

      <QuickEntryForm
        title="Record Debt"
        endpoint="/api/debts"
        onDone={load}
        fields={[
          { name: 'person', type: 'text', placeholder: 'Person name' },
          { name: 'amount', type: 'number', placeholder: 'Amount' },
          { name: 'direction', type: 'select', options: ['OWED_TO_ME', 'I_OWE'] }
        ]}
      />

      <section className="card">
        <h2 className="font-semibold">Open Debts</h2>
        <div className="mt-2 space-y-2">
          {data.debts.map((d) => (
            <div key={d.id} className="rounded-lg border border-slate-700 p-2 text-sm">
              <p>{d.person} • KES {Math.round(d.amount).toLocaleString()} • {d.direction === 'OWED_TO_ME' ? 'They owe me' : 'I owe'}</p>
              {d.status === 'OPEN' && (
                <button className="mt-1 rounded bg-indigo-700 px-3 py-1" onClick={async()=>{await fetch(`/api/debts/${d.id}/pay`,{method:'POST'});load();}}>Mark paid</button>
              )}
            </div>
          ))}
          {data.debts.length === 0 && <p className="text-sm text-slate-400">No debts yet.</p>}
        </div>
      </section>
    </main>
  );
}
