export const SECTION_SEQUENCE = [
  { key: "profile", path: "profile", label: "Profile" },
  { key: "education", path: "education", label: "Education" },
  { key: "family", path: "family", label: "Family" },
  { key: "church", path: "church-appointments", label: "Church appointments" },
  { key: "experience", path: "work-experience", label: "Work experience" },
  { key: "training", path: "training", label: "Training" },
  { key: "qualifications", path: "qualifications", label: "Qualifications" },
  { key: "awards", path: "awards", label: "Awards" },
  { key: "discipline", path: "discipline", label: "Discipline" },
  { key: "remarks", path: "special-remarks", label: "Special remarks" },
] as const;

export type SectionKey = (typeof SECTION_SEQUENCE)[number]["key"];

const KEY_TO_PATH = Object.fromEntries(
  SECTION_SEQUENCE.map((section) => [section.key, section.path]),
) as Record<SectionKey, string>;

const PATH_TO_KEY = Object.fromEntries(
  SECTION_SEQUENCE.map((section) => [section.path, section.key]),
) as Record<(typeof SECTION_SEQUENCE)[number]["path"], SectionKey>;

export const mapPathToSection = (path: string | undefined): SectionKey | null => {
  if (!path) {
    return null;
  }
  return (PATH_TO_KEY as Record<string, SectionKey | undefined>)[path] ?? null;
};

export const resolveSectionPath = (sectionKey: SectionKey, basePath: string) => {
  const mappedPath = KEY_TO_PATH[sectionKey];
  const normalizedBase = basePath.endsWith("/") ? basePath.slice(0, -1) : basePath;
  return `${normalizedBase}/${mappedPath}`;
};

