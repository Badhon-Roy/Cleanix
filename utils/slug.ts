export const slugify = (text?: string): string => {
  if (!text) return "";
  return text
    .toLowerCase()
    .trim()
    .replace(/[?,!@#$%^&*()=+|\\[\]/;:."'`~—–<>]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
};

export const slugifyTeamName = (name?: string): string => {
  return slugify(name);
};

export const unslugifyTeamName = (slug?: string): string => {
  if (!slug) return "";
  return slug
    .split("-")
    .map((word) => word.toUpperCase())
    .join(" ");
};
