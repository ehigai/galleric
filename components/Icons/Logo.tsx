interface LogoProps {
  width?: string | number;
  height?: string | number;
}

export default function Logo({ width = 180, height = 39 }: LogoProps) {
  return (
    <svg
      aria-labelledby="galleric-logo-title"
      fill="none"
      role="img"
      viewBox="0 0 120 26"
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      id="logoSvg"
    >
      <title id="galleric-logo-title">Galleric</title>
      <g color="currentColor">
        <rect
          x="4"
          y="4"
          width="18"
          height="18"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.8"
          opacity="0.25"
          transform="rotate(-12 13 13)"
        />
        <rect
          x="4"
          y="4"
          width="18"
          height="18"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.8"
          opacity="0.5"
          transform="rotate(-6 13 13)"
        />
        <rect
          x="4"
          y="4"
          width="18"
          height="18"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle cx="10" cy="10" r="2" fill="currentColor" />
        <path
          d="M4 19L10 12L15 17"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 16L16 12L22 18"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <text
        x="32"
        y="19"
        fill="currentColor"
        fontFamily="ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
        fontWeight="800"
        fontSize="17"
        letterSpacing="-0.03em"
      >
        Galleric
      </text>
    </svg>
  );
}
