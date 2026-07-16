import { liquidMetalFragmentShader, ShaderMount } from "@paper-design/shaders";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";

interface LiquidMetalButtonProps {
  label?: string;
  onClick?: (e: React.MouseEvent) => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  width?: number;
  height?: number;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  textColor?: string;
  fullWidth?: boolean;
}

export function LiquidMetalButton({
  label,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  width = 142,
  height = 46,
  icon,
  children,
  textColor = "#ffffff",
  fullWidth = false,
}: LiquidMetalButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const shaderRef = useRef<HTMLDivElement>(null);
  // biome-ignore lint/suspicious/noExplicitAny: shader lib untyped
  const shaderMount = useRef<any>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleId = useRef(0);

  const dims = useMemo(() => ({ width, height }), [width, height]);

  useEffect(() => {
    const styleId = "liquid-metal-btn-style";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        .lm-shader canvas {
          width: 100% !important;
          height: 100% !important;
          display: block !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          border-radius: 100px !important;
        }
        @keyframes lm-ripple {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0.5; }
          100% { transform: translate(-50%, -50%) scale(4); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    if (shaderRef.current) {
      if (shaderMount.current?.destroy) shaderMount.current.destroy();
      try {
        shaderMount.current = new ShaderMount(
          shaderRef.current,
          liquidMetalFragmentShader,
          {
            u_repetition: 4,
            u_softness: 0.5,
            u_shiftRed: 0.3,
            u_shiftBlue: 0.3,
            u_distortion: 0,
            u_contour: 0,
            u_angle: 45,
            u_scale: 8,
            u_shape: 1,
            u_offsetX: 0.1,
            u_offsetY: -0.1,
          },
          undefined,
          0.6,
        );
      } catch (err) {
        console.error("Liquid metal shader failed:", err);
      }
    }

    return () => {
      if (shaderMount.current?.destroy) {
        shaderMount.current.destroy();
        shaderMount.current = null;
      }
    };
  }, []);

  const handleEnter = () => {
    setIsHovered(true);
    shaderMount.current?.setSpeed?.(1);
  };
  const handleLeave = () => {
    setIsHovered(false);
    shaderMount.current?.setSpeed?.(0.6);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    shaderMount.current?.setSpeed?.(2.4);
    setTimeout(() => {
      shaderMount.current?.setSpeed?.(isHovered ? 1 : 0.6);
    }, 300);

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const r = { x, y, id: rippleId.current++ };
      setRipples((p) => [...p, r]);
      setTimeout(() => setRipples((p) => p.filter((rp) => rp.id !== r.id)), 600);
    }
    onClick?.(e);
  };

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: fullWidth ? "100%" : `${dims.width}px`,
        height: `${dims.height}px`,
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {/* Shader fills the entire button */}
      <div
        ref={shaderRef}
        className="lm-shader"
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "100px",
          overflow: "hidden",
          pointerEvents: "none",
        }}
      />
      {/* Outer soft glow only (inner stays transparent) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "100px",
          boxShadow: "0 6px 20px rgba(234,88,12,0.18)",
          pointerEvents: "none",
        }}
      />
      {/* Label */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          color: textColor,
          fontWeight: 700,
          fontSize: 14,
          letterSpacing: "0.01em",
          pointerEvents: "none",
          textShadow: "0 1px 2px rgba(0,0,0,0.25)",
          zIndex: 2,
        }}
      >
        {icon}
        {children ?? label}
      </div>
      {/* Button */}
      <button
        ref={buttonRef}
        type={type}
        disabled={disabled}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onClick={handleClick}
        aria-label={label}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          background: "transparent",
          border: "none",
          cursor: disabled ? "not-allowed" : "pointer",
          outline: "none",
          zIndex: 3,
          borderRadius: "100px",
          overflow: "hidden",
        }}
      >
        {ripples.map((r) => (
          <span
            key={r.id}
            style={{
              position: "absolute",
              left: r.x,
              top: r.y,
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.6)",
              transform: "translate(-50%, -50%) scale(0)",
              animation: "lm-ripple 600ms ease-out forwards",
              pointerEvents: "none",
            }}
          />
        ))}
      </button>
    </div>
  );
}
