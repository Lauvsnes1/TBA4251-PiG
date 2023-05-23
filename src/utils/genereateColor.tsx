import { GeoJSONItem } from '../context/geoJSONContext';
import chroma from 'chroma-js';

export function generateColor(): string {
  const hexChars = '0123456789ABCDEF';
  let hexColor = '#';

  // generate a random hex color code
  for (let i = 0; i < 6; i++) {
    hexColor += hexChars[Math.floor(Math.random() * 16)];
  }

  console.log('color generated:', hexColor);

  return hexColor;
}

//Algorithm that aims to find a distinct color each time new layer is added
export function generateDistinctColor(layers: GeoJSONItem[]) {
  const colors: string[] = [];
  layers.forEach((item) => colors.push(item.color));
  // Convert existing colors to HSL
  const existingHSLs = colors.map((color) => chroma(color).hsl());

  // Define a wide range of hues
  const hues = Array.from({ length: 360 }, (_, i) => i);

  // Randomly sort hues to ensure a different starting point each time
  hues.sort(() => Math.random() - 0.5);

  for (let h of hues) {
    // Proposed new color with full saturation and medium lightness
    const newColor = chroma.hsl(h, 1, 0.5);

    // Check if newColor is distinct from existing colors
    const isDistinct = existingHSLs.every((existingHSL) => {
      // Use chroma.deltaE to measure perceptual color difference
      // A Delta E value over 20 is typically considered a large difference
      return chroma.deltaE(newColor, chroma.hsl(...existingHSL), 1, 1) > 20;
    });

    if (isDistinct) {
      console.log('Found distinct');
      return newColor.hex();
    }
  }
  // If no distinct color found, return null
  console.log('Random was generated');
  return String(chroma.random());
}
// // type RGB = [number, number, number];

// // function hexToRGB(hex: string): RGB {
// //   return [
// //     parseInt(hex.substring(1, 3), 16),
// //     parseInt(hex.substring(3, 5), 16),
// //     parseInt(hex.substring(5, 7), 16),
// //   ];
// // }

// // function RGBToHex(rgb: RGB): string {
// //   return '#' + rgb.map((v) => v.toString(16).padStart(2, '0')).join('');
// // }

// // function colorDistance(rgb1: RGB, rgb2: RGB): number {
// //   return Math.sqrt(
// //     Math.pow(rgb1[0] - rgb2[0], 2) + Math.pow(rgb1[1] - rgb2[1], 2) + Math.pow(rgb1[2] - rgb2[2], 2)
// //   );
// // }

// // export function newGenerateColor(layers: GeoJSONItem[]): string {
// //   //extracting the colors from layers
// //   const colors: string[] = layers.map((item) => item.color);
// //   // Convert all hex colors to RGB
// //   const rgbs: RGB[] = colors.map((color) => hexToRGB(color));

// //   // Initialize with the first color of the color space
// //   let distinctColor: RGB = [0, 0, 0];
// //   let maxMinDistance = 0;

// //   // Scan the entire color space
// //   for (let r = 0; r <= 255; r++) {
// //     for (let g = 0; g <= 255; g++) {
// //       for (let b = 0; b <= 255; b++) {
// //         const currentRGB: RGB = [r, g, b];

// //         // Find the minimum distance between the current color and all others
// //         const minDistance = Math.min(...rgbs.map((rgb) => colorDistance(currentRGB, rgb)));

// //         // If it's the biggest minimum found so far, this is our new candidate
// //         if (minDistance > maxMinDistance) {
// //           maxMinDistance = minDistance;
// //           distinctColor = currentRGB;
// //         }
// //       }
// //     }
// //   }

// //   return RGBToHex(distinctColor);
// // }

// export function newGenerateColor(layers: GeoJSONItem[]) {
//   // Extracting a list of color strings
//   const colors: string[] = layers.map((item) => item.color);
//   const CIELAB_colors: CIELABColor[] = colors.map((element) => hexToCIELAB(element));
//   const center: number[] = calculateCenterColor(CIELAB_colors);

//   let maxDistance = -1;
//   let mostDistinctColor: CIELABColor = [0, 0, 0];

//   CIELAB_colors.forEach((color) => {
//     let distance = colorDistance(center, color);

//     if (distance > maxDistance) {
//       maxDistance = distance;
//       mostDistinctColor = color;
//     }
//   });

//   let direction: CIELABColor = [
//     center[0] - mostDistinctColor[0],
//     center[1] - mostDistinctColor[1],
//     center[2] - mostDistinctColor[2],
//   ];

//   let distinctColor: CIELABColor = [
//     center[0] + (maxDistance / 2) * direction[0],
//     center[1] + (maxDistance / 2) * direction[1],
//     center[2] + (maxDistance / 2) * direction[2],
//   ];

//   console.log('The new generated color is: ', cielabToHex(distinctColor));
//   return cielabToHex(distinctColor);
// }

// function colorDistance(color1: number[], color2: CIELABColor): number {
//   return Math.sqrt(
//     Math.pow(color1[0] - color2[0], 2) +
//       Math.pow(color1[1] - color2[1], 2) +
//       Math.pow(color1[2] - color2[2], 2)
//   );
// }

// function hexToCIELAB(hexColor: string): CIELABColor {
//   // Convert hex color to RGB values
//   const r = parseInt(hexColor.substr(1, 2), 16);
//   const g = parseInt(hexColor.substr(3, 2), 16);
//   const b = parseInt(hexColor.substr(5, 2), 16);

//   // Apply gamma correction
//   const R_linear = gammaCorrection(r / 255);
//   const G_linear = gammaCorrection(g / 255);
//   const B_linear = gammaCorrection(b / 255);

//   // Convert RGB to CIELAB
//   const x = R_linear * 0.4124564 + G_linear * 0.3575761 + B_linear * 0.1804375;
//   const y = R_linear * 0.2126729 + G_linear * 0.7151522 + B_linear * 0.072175;
//   const z = R_linear * 0.0193339 + G_linear * 0.119192 + B_linear * 0.9503041;

//   // Convert XYZ to CIELAB
//   const epsilon = 0.008856;
//   const kappa = 903.3;

//   const xRef = 0.95047;
//   const yRef = 1.0;
//   const zRef = 1.08883;

//   const f = (t: number) => (t > epsilon ? Math.cbrt(t) : (kappa * t + 16) / 116);

//   const fy = f(y / yRef);
//   const L = 116 * fy - 16;
//   const a = 500 * (f(x / xRef) - fy);
//   const b_res = 200 * (fy - f(z / zRef));

//   return [L, a, b_res];
// }

// function calculateCenterColor(points: number[][]): number[] {
//   const numPoints = points.length;

//   if (numPoints === 0) {
//     throw new Error('No points provided');
//   }

//   const numDimensions = points[0].length;

//   const center: number[] = new Array(numDimensions).fill(0);

//   for (const point of points) {
//     for (let i = 0; i < numDimensions; i++) {
//       center[i] += point[i];
//     }
//   }

//   for (let i = 0; i < numDimensions; i++) {
//     center[i] /= numPoints;
//   }

//   return center;
// }

// function cielabToHex(cielab: CIELABColor): string {
//   if (cielab.length !== 3) {
//     throw new Error('Invalid CIELAB values. Expected an array of length 3.');
//   }
//   function clamp(val: number, min: number, max: number): number {
//     return Math.min(Math.max(min, val), max);
//   }

//   const [L, a, b] = cielab;

//   // Convert CIELAB to XYZ
//   const epsilon = 0.008856;
//   const kappa = 903.3;

//   const yRef = 1.0;

//   const fy = (L + 16) / 116;
//   const fz = fy - b / 200;
//   const fx = a / 500 + fy;

//   const x = Math.pow(fx, 3) > epsilon ? Math.pow(fx, 3) : (116 * fx - 16) / kappa;
//   const y = L > kappa * epsilon ? Math.pow((L + 16) / 116, 3) : L / kappa;
//   const z = Math.pow(fz, 3) > epsilon ? Math.pow(fz, 3) : (116 * fz - 16) / kappa;

//   // Convert XYZ to RGB
//   let R_linear = 3.2404542 * x - 1.5371385 * y - 0.4985314 * z;
//   let G_linear = -0.969266 * x + 1.8760108 * y + 0.041556 * z;
//   let B_linear = 0.0556434 * x - 0.2040259 * y + 1.0572252 * z;

//   // Apply inverse gamma correction
//   let r = inverseGammaCorrection(R_linear);
//   let g = inverseGammaCorrection(G_linear);
//   let bVal = inverseGammaCorrection(B_linear);

//   // Clamp values
//   r = clamp(r, 0, 1);
//   g = clamp(g, 0, 1);
//   bVal = clamp(bVal, 0, 1);

//   // Convert RGB to hex
//   const toHex = (color: number): string => {
//     const hex = Math.round(color * 255)
//       .toString(16)
//       .padStart(2, '0');
//     return hex;
//   };

//   const hex = `#${toHex(r)}${toHex(g)}${toHex(bVal)}`;
//   return hex;
// }

// // Gamma correction function
// function gammaCorrection(value: number): number {
//   return value > 0.04045 ? Math.pow((value + 0.055) / 1.055, 2.4) : value / 12.92;
// }

// // Inverse gamma correction function
// function inverseGammaCorrection(value: number): number {
//   return value > 0.0031308 ? 1.055 * Math.pow(value, 1 / 2.4) - 0.055 : 12.92 * value;
// }

// type LAB = [number, number, number];

// // The ranges of valid values in the CIELAB color space
// const L_RANGE = [0, 100];
// const A_RANGE = [-128, 127];
// const B_RANGE = [-128, 127];

// // The step size for each component
// const STEP_SIZE = 3;

// function hexToLab(hex: string): LAB {
//   return chroma(hex).lab();
// }

// function labToHex(lab: LAB): string {
//   return chroma(lab).hex();
// }

// function labDistance(lab1: LAB, lab2: LAB): number {
//   return Math.sqrt(
//     Math.pow(lab1[0] - lab2[0], 2) + Math.pow(lab1[1] - lab2[1], 2) + Math.pow(lab1[2] - lab2[2], 2)
//   );
// }

// export function newGenerateColor(layers: GeoJSONItem[]) {
//   console.log('layers:', layers);
//   // Extracting a list of color strings
//   const colors: string[] = layers.map((item) => item.color);
//   // Convert all hex colors to LAB
//   colors.push('#3444BC');
//   console.log('HEX: ', colors);
//   const labs: LAB[] = colors.map((color) => hexToLab(color));
//   console.log('LABS: ', labs);
//   // Initialize with the first color of the color space
//   let distinctLab: LAB = [L_RANGE[0], A_RANGE[0], B_RANGE[0]];
//   let maxMinDistance = 0;

//   // Scan the color space with the specified step size
//   for (let L = L_RANGE[0]; L <= L_RANGE[1]; L += STEP_SIZE) {
//     for (let a = A_RANGE[0]; a <= A_RANGE[1]; a += STEP_SIZE) {
//       for (let b = B_RANGE[0]; b <= B_RANGE[1]; b += STEP_SIZE) {
//         const currentLab: LAB = [L, a, b];

//         // Find the minimum distance between the current color and all others
//         const minDistance = Math.min(...labs.map((lab) => labDistance(currentLab, lab)));

//         // If it's the biggest minimum found so far, this is our new candidate
//         if (minDistance > maxMinDistance) {
//           maxMinDistance = minDistance;
//           distinctLab = currentLab;
//         }
//       }
//     }
//   }
//   const res = labToHex(distinctLab);
//   console.log('COLOR:', res);

//   return res;
// }

// export function randomColor(layers: GeoJSONItem[]) {
//   console.log('layers:', layers);
//   // Extracting a list of color strings
//   const colors: string[] = [];
//   layers.forEach((item) => colors.push(item.color));
//   colors.push('#ff0000', '#00ff0d', '#0008ff');
//   console.log('COLORS LIST: ', colors);
//   const avg = chroma.average(colors);
//   let res: Color = chroma.random();
//   console.log('average color', avg);
//   console.log('random color', res);
//   console.log('distance: ', chroma.deltaE(avg, res));
//   let dist = 0;
//   for (let i = 0; i <= 101; i++) {
//     let randomColor: Color = chroma.random();
//     let calculatedDist = chroma.deltaE(randomColor, avg);
//     if (calculatedDist > dist) {
//       dist = calculatedDist;
//       res = randomColor;
//       console.log('distance was:', dist);
//     }
//   }
//   return String(res);
// }
