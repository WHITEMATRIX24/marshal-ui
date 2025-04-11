export const formatName = (name?: string | any) => {
  if (!name) return "";
  return name.charAt(0).toUpperCase() + name.slice(1);
};
export const formatDate = (dateString?: string) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};
