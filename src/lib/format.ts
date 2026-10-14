/**
 * Deterministic number and currency formatting for INR (Indian Rupees).
 * Ensures exact character match between Server-Side Rendering (Node.js)
 * and Client-Side Hydration (all browser platforms and operating systems).
 */
export function formatINR(amount: number): string {
  if (typeof amount !== 'number' || isNaN(amount)) return '0';
  
  // Format with standard Indian Numbering System:
  // Last 3 digits grouped together, preceding digits grouped in 2s.
  const isNegative = amount < 0;
  const absInt = Math.floor(Math.abs(amount)).toString();

  let lastThree = absInt.substring(absInt.length - 3);
  const otherNumbers = absInt.substring(0, absInt.length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  return (isNegative ? '-' : '') + formatted;
}
