export function generateColor(): string {
  const hexChars = '0123456789ABCDEF';
  let hexColor = '#';

  // generate a random hex color code
  for (let i = 0; i < 6; i++) {
    hexColor += hexChars[Math.floor(Math.random() * 16)];
  }

  return hexColor;
}
