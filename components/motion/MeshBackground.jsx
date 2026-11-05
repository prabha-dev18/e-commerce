/** Slowly drifting colour clouds. Decorative only; put it behind content in a relatively positioned section. */
export default function MeshBackground({ className = '', dark = false }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <div className={`absolute -left-[10%] -top-[20%] h-[70%] w-[55%] animate-mesh-a rounded-full blur-[90px] ${dark ? 'bg-accent/30' : 'bg-highlight/25'}`} />
      <div className={`absolute -right-[10%] top-[10%] h-[65%] w-[50%] animate-mesh-b rounded-full blur-[100px] ${dark ? 'bg-highlight/25' : 'bg-accent/30'}`} />
      <div className={`absolute bottom-[-25%] left-[25%] h-[60%] w-[50%] animate-mesh-a rounded-full blur-[110px] ${dark ? 'bg-secondary/10' : 'bg-secondary'}`} />
    </div>
  );
}
