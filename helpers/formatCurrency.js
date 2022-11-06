export const formatCurrency = (amount) => {
  const options1 = { style: 'currency', currency: 'USD' };
  const numberFormat1 = new Intl.NumberFormat('en-US', options1);
  return numberFormat1.format(amount)
}
