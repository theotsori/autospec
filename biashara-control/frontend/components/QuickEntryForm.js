'use client';
import { useState } from 'react';

export default function QuickEntryForm({ title, endpoint, fields, onDone }) {
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    const res = await fetch(endpoint, { method: 'POST', body: JSON.stringify(payload) });
    setLoading(false);
    if (res.ok) {
      e.currentTarget.reset();
      onDone();
    }
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-2">
      <h3 className="font-semibold">{title}</h3>
      {fields.map((f) =>
        f.type === 'select' ? (
          <select key={f.name} name={f.name} className="input" defaultValue={f.defaultValue || ''} required={f.required !== false}>
            {f.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        ) : (
          <input key={f.name} name={f.name} className="input" type={f.type || 'text'} placeholder={f.placeholder} required={f.required !== false} />
        )
      )}
      <button className="btn w-full bg-emerald-600" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
    </form>
  );
}
