//фільтрація

const parseType = (string) => {
  if (['home', 'personal', 'work'].includes(string)) return string;
};
const parseBoolean = (string) => {
  if (['true', 'false'].includes(string)) return JSON.parse(string); //буль
};

export const parseFilters = (filter) => {
  return {
    contactType: parseType(filter['filter(type)']), // Дістаємо значення type //значення по ключу "filter(type)"
    isFavourite: parseBoolean(filter['filter(isFavorite)']), // Дістаємо значення isFavorite
  };
};
