import QRCode from 'qrcode';
import { writeFileSync } from 'fs';

const URL = 'https://hd2908.github.io/mobile-wedding/';
const SIZE = 600;
const MARGIN = 2;

function isFinderPattern(row, col, moduleCount) {
  // Top-left 7x7
  if (row < 7 && col < 7) return true;
  // Top-right 7x7
  if (row < 7 && col >= moduleCount - 7) return true;
  // Bottom-left 7x7
  if (row >= moduleCount - 7 && col < 7) return true;
  return false;
}

function isAlignmentPattern(row, col, moduleCount) {
  // For version 2+ QR codes, alignment pattern is 5x5 centered at specific positions
  // Version 2 (25 modules): alignment at (18, 18)
  // Version 3 (29 modules): alignment at (22, 22)
  // General: check if near alignment center positions
  const version = (moduleCount - 17) / 4;
  if (version < 2) return false;

  // Alignment pattern positions by version
  const alignPos = getAlignmentPositions(version);
  for (const r of alignPos) {
    for (const c of alignPos) {
      // Skip if overlapping with finder patterns
      if (r < 9 && c < 9) continue;
      if (r < 9 && c >= moduleCount - 9) continue;
      if (r >= moduleCount - 9 && c < 9) continue;
      // Check if within 5x5 alignment pattern
      if (Math.abs(row - r) <= 2 && Math.abs(col - c) <= 2) return true;
    }
  }
  return false;
}

function getAlignmentPositions(version) {
  const positions = [
    [], // v0 (n/a)
    [], // v1
    [6, 18], // v2
    [6, 22], // v3
    [6, 26], // v4
    [6, 30], // v5
    [6, 34], // v6
    [6, 22, 38], // v7
  ];
  return positions[version] || [];
}

async function generate() {
  const qr = QRCode.create(URL, { errorCorrectionLevel: 'H' });
  const modules = qr.modules;
  const moduleCount = modules.size;
  const cellSize = SIZE / (moduleCount + MARGIN * 2);
  const emojiSize = cellSize * 1.15;

  function heart(cx, cy) {
    return `<text x="${cx}" y="${cy}" font-size="${emojiSize}" text-anchor="middle" dominant-baseline="central">💚</text>`;
  }

  // Draw a single finder pattern (outer + inner) with sharp square corners
  function finderPattern(ox, oy) {
    const s = cellSize;
    let out = '';
    // Outer ring: 7x7
    out += `<rect x="${ox}" y="${oy}" width="${s * 7}" height="${s * 7}" fill="black"/>`;
    out += `<rect x="${ox + s}" y="${oy + s}" width="${s * 5}" height="${s * 5}" fill="white"/>`;
    // Inner square: 3x3
    out += `<rect x="${ox + s * 2}" y="${oy + s * 2}" width="${s * 3}" height="${s * 3}" fill="black"/>`;
    return out;
  }

  // Draw alignment pattern (5x5 with standard sharp squares)
  function alignmentPattern(cx, cy) {
    const s = cellSize;
    let out = '';
    out += `<rect x="${cx - s * 2.5}" y="${cy - s * 2.5}" width="${s * 5}" height="${s * 5}" fill="black"/>`;
    out += `<rect x="${cx - s * 1.5}" y="${cy - s * 1.5}" width="${s * 3}" height="${s * 3}" fill="white"/>`;
    out += `<rect x="${cx - s * 0.5}" y="${cy - s * 0.5}" width="${s}" height="${s}" fill="black"/>`;
    return out;
  }

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}">`;
  svg += `<rect width="${SIZE}" height="${SIZE}" fill="white"/>`;

  // Radial gradient: red center → black edge
  svg += `<defs>`;
  svg += `<radialGradient id="grad" cx="50%" cy="50%" r="50%">`;
  svg += `<stop offset="0%" stop-color="#00A94F"/>`;
  svg += `<stop offset="45%" stop-color="#008C41"/>`;
  svg += `<stop offset="100%" stop-color="#000000"/>`;
  svg += `</radialGradient>`;
  svg += `</defs>`;

  // Draw finder patterns with sharp square corners (standard QR)
  const mOff = MARGIN * cellSize;
  svg += finderPattern(mOff, mOff); // top-left
  svg += finderPattern(mOff + (moduleCount - 7) * cellSize, mOff); // top-right
  svg += finderPattern(mOff, mOff + (moduleCount - 7) * cellSize); // bottom-left

  // Draw alignment patterns as standard squares
  const version = (moduleCount - 17) / 4;
  if (version >= 2) {
    const alignPos = getAlignmentPositions(version);
    for (const r of alignPos) {
      for (const c of alignPos) {
        // Skip if overlapping with finder patterns
        if (r < 9 && c < 9) continue;
        if (r < 9 && c >= moduleCount - 9) continue;
        if (r >= moduleCount - 9 && c < 9) continue;
        const cx = (c + MARGIN + 0.5) * cellSize;
        const cy = (r + MARGIN + 0.5) * cellSize;
        svg += alignmentPattern(cx, cy);
      }
    }
  }

  // Draw remaining modules as hearts (skip finder + alignment areas)
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (isFinderPattern(row, col, moduleCount)) continue;
      if (isAlignmentPattern(row, col, moduleCount)) continue;
      if (modules.get(row, col)) {
        const cx = (col + MARGIN + 0.5) * cellSize;
        const cy = (row + MARGIN + 0.5) * cellSize;
        svg += heart(cx, cy);
      }
    }
  }

  svg += `</svg>`;

  writeFileSync('public/qr-code.svg', svg);
  console.log('QR code saved to public/qr-code.svg');

  writeFileSync('public/qr-preview.html', `<!DOCTYPE html>
<html><head><title>QR Preview</title></head>
<body style="display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f5f5f5">
${svg}
</body></html>`);
  console.log('Preview saved to public/qr-preview.html');
}

generate().catch(console.error);
