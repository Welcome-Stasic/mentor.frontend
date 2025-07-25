export const getColorByPercentage = (percentage: number): string => {
  if (percentage > 100) return '#b44577'; // яркий розово-фиолетовый
  if (percentage > 80) return '#39b881'; // яркий зелёный
  if (percentage > 50) return '#b6c53d'; // ярко-жёлто-зелёный
  if (percentage > 30) return '#e1862c'; // оранжевый
  return '#c0392b'; // насыщенно-красный
};