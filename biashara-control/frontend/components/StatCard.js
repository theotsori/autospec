export default function StatCard({ label, value }) {
  return (
    <article className="card">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-bold">KES {Math.round(value).toLocaleString()}</p>
    </article>
  );
}
