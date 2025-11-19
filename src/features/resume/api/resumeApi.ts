import { Resumes } from "@/client/sdk.gen";
import type {
  AdditionalRemarkRead,
  AwardRead,
  CertificationRead,
  DisciplineRecordRead,
  EducationHistoryRead,
  FamilyMemberRead,
  OrganizationalActivityRead,
  PersonalProfileRead,
  ResumeDetail,
  ResumeRead,
  TrainingProgramRead,
  WorkExperienceRead,
} from "@/client";

import { resumeFormDefaults } from "../utils/resumeDefaults";
import type {
  AwardEntry,
  ChurchAppointmentEntry,
  DisciplineEntry,
  EducationHistoryEntry,
  FamilyInfoEntry,
  FamilyRelation,
  GraduationStatus,
  QualificationEntry,
  ResumeFormValues,
  ResumeRecord,
  SpecialRemarkEntry,
  TrainingHistoryEntry,
  WorkExperienceEntry,
} from "../types/resume";

export type ResumeRecordWithId = ResumeRecord & {
  recordId: string;
  meta: {
    name: string;
    status?: string;
    version?: string;
    language?: string;
    purpose?: string | null;
    notes?: string | null;
    updatedAt?: string;
  };
};

export type ResumeCreateInput = {
  name: string;
  language: string;
  purpose?: string;
  userId: string;
};

export type ResumeSectionKey =
  | "profile"
  | "education"
  | "training"
  | "qualifications"
  | "family"
  | "experience"
  | "church"
  | "awards"
  | "discipline"
  | "remarks";

export type ResumeSectionPayloadMap = {
  profile: ResumeFormValues;
  education: EducationHistoryEntry[];
  training: TrainingHistoryEntry[];
  qualifications: QualificationEntry[];
  family: FamilyInfoEntry[];
  experience: WorkExperienceEntry[];
  church: ChurchAppointmentEntry[];
  awards: AwardEntry[];
  discipline: DisciplineEntry[];
  remarks: SpecialRemarkEntry[];
};

const toDateInputValue = (value?: string | Date | null): string => {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toISOString().split("T")[0];
};

const splitEnglishName = (value?: string | null) => {
  if (!value) {
    return { first: "", last: "" };
  }
  const parts = value.trim().split(/\s+/);
  if (parts.length === 1) {
    return { first: parts[0], last: "" };
  }
  return { first: parts.slice(0, -1).join(" "), last: parts.at(-1) ?? "" };
};

const normalizeGraduationStatus = (value?: string | null): GraduationStatus => {
  if (!value) return "enrolled";
  const normalized = value.toLowerCase();
  switch (normalized) {
    case "graduated":
      return "graduated";
    case "completed":
      return "completed";
    case "dropped_out":
    case "dropped-out":
    case "dropped out":
      return "dropped_out";
    case "on_leave":
    case "on-leave":
      return "on_leave";
    default:
      return "enrolled";
  }
};

const normalizeFamilyRelation = (value?: string | null): FamilyRelation => {
  if (!value) return "father";
  const normalized = value.toLowerCase();
  if (normalized.includes("mother")) return "mother";
  if (normalized.includes("father")) return "father";
  if (normalized.includes("husband")) return "husband";
  if (normalized.includes("spouse") || normalized.includes("wife")) return "spouse";
  if (normalized.includes("older brother")) return "older_brother";
  if (normalized.includes("younger brother")) return "younger_brother";
  if (normalized.includes("older sister")) return "older_sister";
  if (normalized.includes("younger sister")) return "younger_sister";
  if (normalized.includes("son")) return "son";
  if (normalized.includes("daughter")) return "daughter";
  return "father";
};

const mapProfile = (profile: PersonalProfileRead | undefined, detail: ResumeDetail): ResumeFormValues => {
  const result: ResumeFormValues = { ...resumeFormDefaults };
  if (!profile) {
    result.nameKorean = detail.resume_name ?? "";
    return result;
  }

  const { first: englishFirst, last: englishLast } = splitEnglishName(profile.english_name);

  result.nameKorean = profile.korean_name ?? detail.resume_name ?? "";
  result.nameHanja = profile.chinese_name ?? "";
  result.firstNameEnglish = englishFirst;
  result.lastNameEnglish = englishLast;
  result.residentId = profile.resident_number ?? "";
  result.dateOfBirth = toDateInputValue(profile.birth_date ?? null);
  result.nationality = profile.nationality ?? "";
  result.department = profile.department ?? detail.notes ?? "";
  result.extensionNumber = profile.extension ?? "";
  result.mobilePhone = profile.mobile_phone ?? "";
  result.address = profile.address ?? "";
  result.remarks = profile.remarks ?? "";
  result.blessing = toDateInputValue(profile.blessing_date ?? null);
  result.admissionDate = toDateInputValue(profile.appointment_date ?? null);
  result.affiliation = profile.organization ?? "";
  result.positionTitle = profile.position ?? "";
  result.rankTitle = "";
  result.email = profile.email ?? "";
  result.photoUrl = "";
  result.photoFile = null;
  return result;
};

const mapEducationEntries = (items?: EducationHistoryRead[]): EducationHistoryEntry[] =>
  (items ?? []).map((item) => ({
    id: item.id,
    startDate: toDateInputValue(item.start_date),
    endDate: toDateInputValue(item.end_date),
    schoolNameKor: item.institution ?? "",
    majorKor: item.major ?? "",
    graduationStatus: normalizeGraduationStatus(item.graduation_type),
    degree: (item.degree ?? undefined) as EducationHistoryEntry["degree"],
  }));

const mapTrainingEntries = (items?: TrainingProgramRead[]): TrainingHistoryEntry[] =>
  (items ?? []).map((item) => ({
    id: item.id,
    category: "",
    courseName: item.program_name ?? "",
    startDate: toDateInputValue(item.start_date),
    endDate: toDateInputValue(item.end_date),
    organizer: item.organizing_institution ?? "",
    completion: Boolean(item.completion_status),
  }));

const mapCertificationEntries = (items?: CertificationRead[]): QualificationEntry[] =>
  (items ?? []).map((item) => ({
    id: item.id,
    acquisitionDate: toDateInputValue(item.acquisition_date),
    qualificationName: item.certification_name ?? "",
    remarks: item.remarks ?? "",
  }));

const mapFamilyEntries = (items?: FamilyMemberRead[]): FamilyInfoEntry[] =>
  (items ?? []).map((item) => ({
    id: item.id,
    relation: normalizeFamilyRelation(item.relationship),
    name: item.name ?? "",
    dateOfBirth: toDateInputValue(item.birth_date ?? null),
    blessed: Boolean(item.blessed),
    remarks: item.remarks ?? "",
  }));

const mapWorkEntries = (items?: WorkExperienceRead[]): WorkExperienceEntry[] =>
  (items ?? []).map((item) => ({
    id: item.id,
    startDate: toDateInputValue(item.start_date),
    endDate: toDateInputValue(item.end_date ?? null),
    companyName: item.organization ?? "",
    finalPosition: item.position ?? "",
    department: item.department ?? "",
    jobDescription: item.responsibilities ?? "",
  }));

const mapChurchEntries = (items?: OrganizationalActivityRead[]): ChurchAppointmentEntry[] =>
  (items ?? []).map((item) => ({
    id: item.id,
    startDate: toDateInputValue(item.start_date),
    endDate: toDateInputValue(item.end_date ?? null),
    organizationName: item.organization_name ?? "",
    lastPosition: item.position ?? "",
    department: "",
    responsibilities: item.main_role ?? "",
  }));

const mapAwardEntries = (items?: AwardRead[]): AwardEntry[] =>
  (items ?? []).map((item) => ({
    id: item.id,
    awardDate: toDateInputValue(item.award_date),
    awardType: item.category ?? "",
    description: item.details ?? "",
    organization: item.awarding_institution ?? "",
  }));

const mapDisciplineEntries = (items?: DisciplineRecordRead[]): DisciplineEntry[] =>
  (items ?? []).map((item) => ({
    id: item.id,
    recordDate: toDateInputValue(item.record_date),
    type: item.type ?? "",
    reason: item.reason ?? "",
  }));

const mapRemarkEntries = (items?: AdditionalRemarkRead[]): SpecialRemarkEntry[] =>
  (items ?? []).map((item) => ({
    id: item.id,
    entryDate: toDateInputValue(item.registration_date),
    content: item.content ?? "",
  }));

const mapResumeDetailToRecord = (detail: ResumeDetail): ResumeRecordWithId => {
  const profileSource = detail.personal_profiles?.[0];
  const profile = mapProfile(profileSource, detail);

  return {
    recordId: detail.id,
    profileEntryId: profileSource?.id,
    meta: {
      name: detail.resume_name ?? profile.nameKorean ?? "Untitled resume",
      status: detail.status ?? undefined,
      version: detail.resume_version ?? undefined,
      language: detail.language ?? undefined,
      purpose: detail.purpose ?? null,
      notes: detail.notes ?? null,
      updatedAt:
        detail.updated_at instanceof Date
          ? detail.updated_at.toISOString()
          : typeof detail.updated_at === "string"
            ? detail.updated_at
            : undefined,
    },
    profile,
    education: mapEducationEntries(detail.education_history),
    training: mapTrainingEntries(detail.training_programs),
    qualifications: mapCertificationEntries(detail.certifications),
    family: mapFamilyEntries(detail.family_members),
    workExperience: mapWorkEntries(detail.work_experience),
    churchAppointments: mapChurchEntries(detail.organizational_activities),
    awards: mapAwardEntries(detail.awards),
    discipline: mapDisciplineEntries(detail.discipline_records),
    specialRemarks: mapRemarkEntries(detail.additional_remarks),
  };
};

const loadResumeDetail = async (resumeId: string): Promise<ResumeDetail> => {
  const { data } = await Resumes.resumesGetFullResume({
    path: { resume_id: resumeId },
  });
  if (!data) {
    throw new Error("Resume not found");
  }
  return data;
};

const getFirstResumeId = async (): Promise<string | undefined> => {
  const { data } = await Resumes.resumesListResumes({});
  return data?.[0]?.id;
};

export async function fetchResumeRecord(recordId?: string): Promise<ResumeRecordWithId> {
  const targetId = recordId ?? (await getFirstResumeId());
  if (!targetId) {
    throw new Error("No resumes available");
  }
  const detail = await loadResumeDetail(targetId);
  return mapResumeDetailToRecord(detail);
}

export async function listResumeRecords(): Promise<ResumeRecordWithId[]> {
  const { data } = await Resumes.resumesListResumes({});
  const summaries: ResumeRead[] = data ?? [];
  if (summaries.length === 0) {
    return [];
  }
  const detailPromises = summaries.map(async (summary) => {
    try {
      const detail = await loadResumeDetail(summary.id);
      return mapResumeDetailToRecord(detail);
    } catch (error) {
      console.error("Failed to load resume detail", error);
      return null;
    }
  });
  const records = await Promise.all(detailPromises);
  return records.filter((record): record is ResumeRecordWithId => Boolean(record));
}

export async function createResumeRecord(input: ResumeCreateInput): Promise<ResumeRecordWithId> {
  const { data } = await Resumes.resumesCreateResume({
    body: {
      resume_name: input.name,
      user_id: input.userId,
      status: "active",
      language: input.language,
      purpose: input.purpose ?? "Resume Builder",
      is_current: true,
    },
  });

  if (!data) {
    throw new Error("Failed to create resume");
  }

  const detail = await loadResumeDetail(data.id);
  return mapResumeDetailToRecord(detail);
}

export async function saveResumeSection<Section extends ResumeSectionKey>(
  _recordId: string,
  _section: Section,
  _payload: ResumeSectionPayloadMap[Section],
): Promise<void> {
  console.warn("saveResumeSection is not implemented yet.");
}

export async function saveResumeRecord(_recordId: string, _payload: ResumeRecord): Promise<void> {
  console.warn("saveResumeRecord is not implemented yet.");
}
