export const slugifyTeamName = (name: string): string => {
  if (!name) return "team-squad";
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const unslugifyTeamName = (slug: string): string => {
  if (!slug) return "Team Squad";
  return slug
    .split("-")
    .map((word) => word.toUpperCase())
    .join(" ");
};
