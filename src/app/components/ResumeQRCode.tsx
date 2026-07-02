import { QRCodeCanvas } from "qrcode.react";

interface ResumeQRCodeProps {
  url?: string;
  show?: boolean;
  size?: number;
  className?: string;
}

/**
 * Reusable resume QR code. Renders nothing when disabled or empty.
 * Uses <canvas> so it exports crisply through html-to-image → jsPDF.
 */
export function ResumeQRCode({ url, show = true, size = 72, className = "" }: ResumeQRCodeProps) {
  if (!show) return null;
  const trimmed = (url ?? "").trim();
  if (!trimmed) return null;

  // Ensure it's a proper URL for scanners
  const value = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  return (
    <div
      className={`inline-flex items-center justify-center bg-white rounded-md p-1.5 ring-1 ring-black/10 shadow-sm print:shadow-none ${className}`}
      title="Scan to visit"
      aria-label="Resume QR code"
    >
      <QRCodeCanvas
        value={value}
        size={size}
        level="M"
        marginSize={0}
        bgColor="#ffffff"
        fgColor="#000000"
      />
    </div>
  );
}
