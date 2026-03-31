export const HexParityGrid = () => (
  <div className="flex flex-col items-end gap-1">
    <div className="hex-grid">
      {Array.from({ length: 16 }).map((_, i) => (
        <div key={i} className="hex-cell" />
      ))}
    </div>
    <span className="label-tag" style={{ fontSize: '0.55rem' }}>
      HEX_PARITY_VERIFIED
    </span>
  </div>
)
