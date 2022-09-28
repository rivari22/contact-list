export const getFavoriteLocalStorage = () => {
  const getFavLocalStorage = localStorage.getItem("FAVORITES");
  return getFavLocalStorage ? JSON.parse(getFavLocalStorage) : [];
};
