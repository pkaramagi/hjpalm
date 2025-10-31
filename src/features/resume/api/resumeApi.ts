import type {
  AwardEntry,
  ChurchAppointmentEntry,
  DisciplineEntry,
  EducationHistoryEntry,
  FamilyInfoEntry,
  QualificationEntry,
  ResumeFormValues,
  ResumeRecord,
  SpecialRemarkEntry,
  TrainingHistoryEntry,
  WorkExperienceEntry,
} from "../types/resume";
import { resumeFormDefaults } from "../utils/resumeDefaults";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

const sanitizeProfile = (profile: ResumeFormValues): ResumeFormValues => ({
  ...profile,
  photoFile: null,
});

type ResumeStore = Record<string, ResumeRecord>;

const resumeStore: ResumeStore = {
  default: {
    profile: sanitizeProfile({
      ...resumeFormDefaults,
      nameKorean: "김민수",
      nameHanja: "金民洙",
      firstNameEnglish: "Minsoo",
      lastNameEnglish: "Kim",
      residentId: "900101-1234567",
      dateOfBirth: "1990-01-01",
      nationality: "대한민국",
      department: "인사팀",
      extensionNumber: "1042",
      mobilePhone: "+82 10-1234-5678",
      address: "서울특별시 강남구 테헤란로 231",
      remarks: "인사 혁신 프로젝트 리드 경험 보유",
      blessing: "2020-02-14",
      admissionDate: "2015-03-01",
      affiliation: "UPA 본사",
      positionTitle: "Senior HR Manager",
      rankTitle: "과장",
      email: "minsoo.kim@example.com",
      photoUrl: "https://i.pravatar.cc/200?img=56",
    }),
    education: [
      {
        id: "edu-1",
        startDate: "2008-03-01",
        endDate: "2012-02-28",
        schoolNameKor: "서울대학교",
        majorKor: "경영학",
        graduationStatus: "graduated",
        degree: "bachelor",
      },
      {
        id: "edu-2",
        startDate: "2012-09-01",
        endDate: "2014-06-30",
        schoolNameKor: "연세대학교 대학원",
        majorKor: "인적자원관리",
        graduationStatus: "graduated",
        degree: "master",
      },
    ],
    training: [
      {
        id: "tr-1",
        category: "Leadership",
        courseName: "Global Leadership Program",
        startDate: "2018-05-01",
        endDate: "2018-05-31",
        organizer: "UPA Training Center",
        completion: true,
      },
    ],
    qualifications: [
      {
        id: "qual-1",
        acquisitionDate: "2016-07-01",
        qualificationName: "HR Professional Certificate",
        remarks: "1급",
      },
    ],
    family: [
      {
        id: "fam-1",
        relation: "spouse",
        name: "박지영",
        dateOfBirth: "1991-04-12",
        blessed: true,
        remarks: "2019년 성화",
      },
      {
        id: "fam-2",
        relation: "son",
        name: "김도윤",
        dateOfBirth: "2021-09-03",
        blessed: false,
      },
    ],
    workExperience: [
      {
        id: "work-1",
        startDate: "2014-03-01",
        endDate: "2017-12-31",
        companyName: "UPA HQ",
        finalPosition: "HR Specialist",
        department: "Human Resources",
        jobDescription: "채용 및 온보딩 프로세스 운영",
      },
      {
        id: "work-2",
        startDate: "2018-01-01",
        companyName: "UPA HQ",
        finalPosition: "Senior HR Manager",
        department: "Human Resources",
        jobDescription: "조직문화 혁신 프로젝트 총괄",
      },
    ],
    churchAppointments: [
      {
        id: "church-1",
        startDate: "2016-01-01",
        endDate: "2018-12-31",
        organizationName: "서울중앙교회",
        lastPosition: "청년부 리더",
        responsibilities: "청년 소그룹 운영 및 프로그램 기획",
      },
      {
        id: "church-2",
        startDate: "2019-01-01",
        organizationName: "UPA 글로벌 협회",
        lastPosition: "교육 담당",
        responsibilities: "글로벌 리더십 교육 과정 개발",
      },
    ],
    awards: [
      {
        id: "award-1",
        awardDate: "2019-12-10",
        awardType: "Best Innovator",
        description: "인사 프로세스 디지털 전환 공로",
        organization: "UPA HQ",
      },
    ],
    discipline: [
      {
        id: "disc-1",
        recordDate: "2020-05-10",
        type: "Coaching",
        reason: "Leadership coaching completed",
      },
    ],
    specialRemarks: [
      {
        id: "remark-1",
        entryDate: "2022-09-05",
        content: "국제 캠퍼스 멘토링 프로그램 운영",
      },
    ],
  },
};

const recordNotFoundError = new Error("Resume record not found");

export async function fetchResumeRecord(recordId: string): Promise<ResumeRecord> {
  await delay(200);
  const record = resumeStore[recordId];
  if (!record) {
    throw recordNotFoundError;
  }
  return clone(record);
}

type ResumeRecordPatch = Partial<ResumeRecord>;

export async function updateResumeRecord(recordId: string, patch: ResumeRecordPatch): Promise<ResumeRecord> {
  await delay(200);
  const existing = resumeStore[recordId];
  if (!existing) {
    throw recordNotFoundError;
  }

  if (patch.profile) {
    existing.profile = sanitizeProfile({ ...existing.profile, ...patch.profile });
  }
  if (patch.education) {
    existing.education = clone(patch.education);
  }
  if (patch.training) {
    existing.training = clone(patch.training);
  }
  if (patch.qualifications) {
    existing.qualifications = clone(patch.qualifications);
  }
  if (patch.family) {
    existing.family = clone(patch.family);
  }
  if (patch.workExperience) {
    existing.workExperience = clone(patch.workExperience);
  }
  if (patch.churchAppointments) {
    existing.churchAppointments = clone(patch.churchAppointments);
  }
  if (patch.awards) {
    existing.awards = clone(patch.awards);
  }
  if (patch.discipline) {
    existing.discipline = clone(patch.discipline);
  }
  if (patch.specialRemarks) {
    existing.specialRemarks = clone(patch.specialRemarks);
  }

  return clone(existing);
}

export async function listResumeRecords(): Promise<Array<{ recordId: string } & ResumeRecord>> {
  await delay(200);
  return Object.entries(resumeStore).map(([recordId, record]) => ({
    recordId,
    ...clone(record),
  }));
}

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

