export type GraduationStatus = "graduated" | "enrolled" | "dropped_out" | "completed" | "on_leave";
export type DegreeType = "bachelor" | "master" | "doctorate" | "other";

export type FamilyRelation =
  | "father"
  | "mother"
  | "older_brother"
  | "younger_brother"
  | "older_sister"
  | "younger_sister"
  | "spouse"
  | "husband"
  | "son"
  | "daughter";

export interface ResumeProfile {
  id?: string;
  nameKorean: string;
  nameHanja?: string;
  firstNameEnglish?: string;
  lastNameEnglish?: string;
  residentId?: string;
  dateOfBirth?: string;
  nationality?: string;
  department?: string;
  extensionNumber?: string;
  mobilePhone?: string;
  address?: string;
  remarks?: string;
  blessing?: string;
  admissionDate?: string;
  affiliation?: string;
  positionTitle?: string;
  rankTitle?: string;
  email?: string;
  photoUrl?: string;
}

export type ResumeFormValues = Omit<ResumeProfile, "id"> & {
  photoFile?: File | null;
};

export interface EducationHistoryEntry {
  id?: string;
  startDate: string;
  endDate?: string;
  schoolNameKor: string;
  majorKor: string;
  graduationStatus: GraduationStatus;
  degree?: DegreeType;
}

export interface WorkExperienceEntry {
  id?: string;
  startDate: string;
  endDate?: string;
  companyName: string;
  finalPosition: string;
  department?: string;
  jobDescription?: string;
}

export interface TrainingHistoryEntry {
  id?: string;
  category?: string;
  courseName: string;
  startDate?: string;
  endDate?: string;
  organizer?: string;
  completion?: boolean;
}

export interface ChurchAppointmentEntry {
  id?: string;
  startDate: string;
  endDate?: string;
  organizationName: string;
  lastPosition?: string;
  department?: string;
  responsibilities?: string;
}

export interface FamilyInfoEntry {
  id?: string;
  relation: FamilyRelation;
  name: string;
  dateOfBirth?: string;
  blessed?: boolean;
  remarks?: string;
}

export interface QualificationEntry {
  id?: string;
  acquisitionDate?: string;
  qualificationName: string;
  remarks?: string;
}

export interface AwardEntry {
  id?: string;
  awardDate?: string;
  awardType?: string;
  description?: string;
  organization?: string;
}

export interface DisciplineEntry {
  id?: string;
  recordDate: string;
  type: string;
  reason?: string;
}

export interface SpecialRemarkEntry {
  id?: string;
  entryDate: string;
  content: string;
}

export interface ResumeRecord {
  profile: ResumeFormValues;
  education: EducationHistoryEntry[];
  training: TrainingHistoryEntry[];
  qualifications: QualificationEntry[];
  family: FamilyInfoEntry[];
  workExperience: WorkExperienceEntry[];
  churchAppointments: ChurchAppointmentEntry[];
  awards: AwardEntry[];
  discipline: DisciplineEntry[];
  specialRemarks: SpecialRemarkEntry[];
}

