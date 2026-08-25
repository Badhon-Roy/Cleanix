export const slugifyTeamName = (name?: string): string => {
  if (!name) return "";
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const unslugifyTeamName = (slug?: string): string => {
  if (!slug) return "";
  return slug
    .split("-")
    .map((word) => word.toUpperCase())
    .join(" ");
};
