import type {
  AwardEntry,
  ChurchAppointmentEntry,
  DisciplineEntry,
  EducationHistoryEntry,
  FamilyInfoEntry,
  QualificationEntry,
  ResumeFormValues,
  SpecialRemarkEntry,
  TrainingHistoryEntry,
  WorkExperienceEntry,
} from "../types/resume";

export const resumeFormDefaults: ResumeFormValues = {
  nameKorean: "",
  nameHanja: "",
  firstNameEnglish: "",
  lastNameEnglish: "",
  residentId: "",
  dateOfBirth: "",
  nationality: "",
  department: "",
  extensionNumber: "",
  mobilePhone: "",
  address: "",
  remarks: "",
  blessing: "",
  admissionDate: "",
  affiliation: "",
  positionTitle: "",
  rankTitle: "",
  email: "",
  photoUrl: "",
  photoFile: null,
};

export const createEmptyEducationEntry = (): EducationHistoryEntry => ({
  id: (Math.random().toString(36).slice(2) + Date.now().toString(36)),
  startDate: "",
  endDate: "",
  schoolNameKor: "",
  majorKor: "",
  graduationStatus: "enrolled",
  degree: undefined,
});

export const createEmptyTrainingEntry = (): TrainingHistoryEntry => ({
  id: (Math.random().toString(36).slice(2) + Date.now().toString(36)),
  category: "",
  courseName: "",
  startDate: "",
  endDate: "",
  organizer: "",
  completion: false,
});

export const createEmptyQualificationEntry = (): QualificationEntry => ({
  id: (Math.random().toString(36).slice(2) + Date.now().toString(36)),
  acquisitionDate: "",
  qualificationName: "",
  remarks: "",
});

export const createEmptyFamilyEntry = (): FamilyInfoEntry => ({
  id: (Math.random().toString(36).slice(2) + Date.now().toString(36)),
  relation: "father",
  name: "",
  dateOfBirth: "",
  blessed: false,
  remarks: "",
});

export const createEmptyWorkExperienceEntry = (): WorkExperienceEntry => ({
  id: (Math.random().toString(36).slice(2) + Date.now().toString(36)),
  startDate: "",
  endDate: "",
  companyName: "",
  finalPosition: "",
  department: "",
  jobDescription: "",
});

export const createEmptyChurchAppointmentEntry = (): ChurchAppointmentEntry => ({
  id: (Math.random().toString(36).slice(2) + Date.now().toString(36)),
  startDate: "",
  endDate: "",
  organizationName: "",
  lastPosition: "",
  department: "",
  responsibilities: "",
});

export const createEmptyAwardEntry = (): AwardEntry => ({
  id: (Math.random().toString(36).slice(2) + Date.now().toString(36)),
  awardDate: "",
  awardType: "",
  description: "",
  organization: "",
});

export const createEmptyDisciplineEntry = (): DisciplineEntry => ({
  id: (Math.random().toString(36).slice(2) + Date.now().toString(36)),
  recordDate: "",
  type: "",
  reason: "",
});

export const createEmptySpecialRemarkEntry = (): SpecialRemarkEntry => ({
  id: (Math.random().toString(36).slice(2) + Date.now().toString(36)),
  entryDate: "",
  content: "",
});

