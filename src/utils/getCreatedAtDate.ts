export const getCreatedAtDate = (createdAt?: number) => {
  if (createdAt) {
    const date = new Date(createdAt);
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  }

  return 'N/A';
};
