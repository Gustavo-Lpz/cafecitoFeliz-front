export function calculateDiscount(purchasesCount: number = 0): number {

  if (!purchasesCount || purchasesCount <= 0) return 0;
  if (purchasesCount <= 3) return 5;
  if (purchasesCount <= 7) return 10;

  return 15;
}
    