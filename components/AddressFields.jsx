const fields = [['name', 'Full name', 'name', 'sm:col-span-2'], ['phone', 'Mobile number', 'tel', ''], ['pincode', 'Pincode', 'postal-code', ''], ['line1', 'Address line 1', 'address-line1', 'sm:col-span-2'], ['line2', 'Address line 2 (optional)', 'address-line2', 'sm:col-span-2'], ['city', 'City', 'address-level2', ''], ['state', 'State', 'address-level1', '']];

export default function AddressFields({ register, errors }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map(([f, label, auto, span]) => (
        <div key={f} className={span}>
          <label htmlFor={`a-${f}`} className="mb-1.5 block text-sm font-medium text-primary">{label}</label>
          <input id={`a-${f}`} autoComplete={auto} inputMode={f === 'phone' || f === 'pincode' ? 'numeric' : undefined} aria-invalid={!!errors[f]} {...register(f)}
            className="h-12 w-full rounded-xl bg-background px-4 text-sm text-primary outline-none ring-1 ring-secondary focus:ring-accent aria-[invalid=true]:ring-highlight" />
          {errors[f] && <p className="mt-1 text-xs text-highlight" role="alert">{errors[f].message}</p>}
        </div>
      ))}
    </div>
  );
}
