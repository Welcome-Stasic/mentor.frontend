
export const handleApiError = (error: unknown) => {
  console.error('API Error:', error);
  throw new Error('Something went wrong while fetching data.');
};