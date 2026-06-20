export default function MetricCard({ title, value }) {
  return (
    <article className="metric-card">
      <p>{title}</p>
      <strong>{value}</strong>
    </article>
  );
}
