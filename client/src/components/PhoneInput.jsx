export default function PhoneInput({ value, onChange, required }) {
  const handleChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '')
    if (raw.length <= 10) onChange(raw)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
      <span style={{
        padding: '10px 12px',
        background: '#f0f0f0',
        border: '1px solid #ddd',
        borderRight: 'none',
        borderRadius: '6px 0 0 6px',
        fontSize: 14,
        color: '#333',
        whiteSpace: 'nowrap'
      }}>+91</span>
      <input
        className="input"
        type="tel"
        value={value}
        onChange={handleChange}
        placeholder="XXXXXXXXXX"
        required={required}
        maxLength={10}
        style={{ borderRadius: '0 6px 6px 0' }}
      />
    </div>
  )
}
