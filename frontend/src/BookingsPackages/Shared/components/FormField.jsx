export default function FormField({ label, help, error, children }) {
  return (
    <div className="space-y-1">
      <div className="label">{label}</div>
      {children}
      {help && <div className="help">{help}</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
}