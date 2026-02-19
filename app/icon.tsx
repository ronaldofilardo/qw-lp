import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 88,
        background: "#1a1a1a",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 192 192"
        width="160"
        height="160"
      >
        {/* Círculo de fundo verde */}
        <circle cx="96" cy="96" r="85" fill="#9ccc65" />

        {/* Símbolo: cabeça + sinal N-R */}
        <g fill="#1a1a1a">
          {/* Cabeça (círculo) */}
          <circle cx="96" cy="60" r="24" />

          {/* Corpo com braços levantados (indicando saúde/vitória) */}
          <path d="M 70 85 L 50 75 L 55 95 L 70 105 Z" />
          <path d="M 122 85 L 142 75 L 137 95 L 122 105 Z" />

          {/* Torso */}
          <rect x="80" y="85" width="32" height="35" rx="8" />

          {/* Pernas */}
          <rect x="85" y="125" width="10" height="25" rx="5" />
          <rect x="97" y="125" width="10" height="25" rx="5" />
        </g>
      </svg>
    </div>,
    {
      width: 192,
      height: 192,
    },
  );
}
