interface WaxDividerProps {
  className?: string;
}

/**
 * Fine frise en losanges alternés, clin d'œil aux bordures de pagnes wax.
 * Utilisée avec parcimonie : header, hero, footer.
 */
export function WaxDivider({ className = "" }: WaxDividerProps) {
  return (
    <svg
      viewBox="0 0 240 12"
      preserveAspectRatio="xMidYMid slice"
      className={`h-3 w-full ${className}`}
      aria-hidden="true"
    >
      {Array.from({ length: 20 }).map((_, i) => (
        <g key={i} transform={`translate(${i * 12}, 0)`}>
          <polygon points="6,1 11,6 6,11 1,6" fill={i % 2 === 0 ? "#C6922B" : "#1F2A4D"} />
        </g>
      ))}
    </svg>
  );
}
