export default function Stepper({ steps, activeIndex }) {
  return (
    <div className="stepper">
      {steps.map((s, i) => (
        <div key={s} className={`step ${i===activeIndex ? 'step-active' : ''}`}>{i+1}. {s}</div>
      ))}
    </div>
  );
}