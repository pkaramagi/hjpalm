import React, { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import CIGLogo from "@/assets/CIG Leaders.png";

import cadet_pic from "@/assets/cadet.png";
import { Container, Page } from "tabler-react-ui";

const SAMPLE_RECORD = {
  profile: {
    nameKorean: "김민수",
    nameHanja: "金民洙",
    nameEnglish: "Minsoo Kim",
    residentId: "900101-1234567",
    nationality: "대한민국",
    affiliation: "UPA Headquarters",
    department: "인사팀",
    positionTitle: "Senior HR Manager",
    rankTitle: "과장",
    mobilePhone: "+82 10-1234-5678",
    extensionNumber: "1042",
    email: "minsoo.kim@example.com",
    address: "서울특별시 강남구 테헤란로 231",
    dateOfBirth: "1990-01-01",
    admissionDate: "2015-03-01",
    blessing: "2020-02-14",
    photoUrl: "https://i.pravatar.cc/120?img=56",
  },
  family: [
    { relation: "부", name: "김영수", dateOfBirth: "1960-03-12", blessed: true },
    { relation: "모", name: "박미정", dateOfBirth: "1962-07-08", blessed: true },
    { relation: "배우자", name: "이서연", dateOfBirth: "1991-04-12", blessed: true },
    { relation: "자녀", name: "김도윤", dateOfBirth: "2021-09-03", blessed: false },
  ],
  education: [
    {
      startDate: "2008-03-01",
      endDate: "2012-02-28",
      schoolNameKor: "서울대학교",
      majorKor: "경영학",
      graduationStatus: "졸업",
      degree: "학사",
    },
    {
      startDate: "2012-09-01",
      endDate: "2014-08-31",
      schoolNameKor: "연세대학교 대학원",
      majorKor: "인적자원관리",
      graduationStatus: "졸업",
      degree: "석사",
    },
  ],
  workExperience: [
    {
      startDate: "2014-03-01",
      endDate: "2017-12-31",
      companyName: "UPA HQ",
      department: "인사팀",
      finalPosition: "HR Specialist",
      jobDescription: "채용 및 온보딩 프로세스 운영",
    },
    {
      startDate: "2018-01-01",
      companyName: "UPA HQ",
      department: "인사혁신팀",
      finalPosition: "Senior HR Manager",
      jobDescription: "조직문화 혁신 프로젝트 총괄",
    },
  ],
  churchAppointments: [
    {
      startDate: "2016-01-01",
      endDate: "2018-12-31",
      organizationName: "서울중앙교회",
      lastPosition: "청년부 리더",
      responsibilities: "소그룹 운영 및 프로그램 기획",
    },
    {
      startDate: "2019-01-01",
      organizationName: "UPA 글로벌 협회",
      lastPosition: "교육 담당",
      responsibilities: "글로벌 리더십 교육 과정 개발",
    },
  ],
  training: [
    {
      courseName: "Global Leadership Program",
      startDate: "2018-05-01",
      endDate: "2018-05-31",
      organizer: "UPA Training Center",
      completion: true,
    },
    {
      courseName: "Strategic HR Workshop",
      startDate: "2022-09-10",
      endDate: "2022-09-15",
      organizer: "HRD Korea",
      completion: true,
    },
  ],
  qualifications: [
    {
      qualificationName: "HR Professional Certificate",
      acquisitionDate: "2016-07-01",
      remarks: "1급",
    },
    {
      qualificationName: "TOEIC 950",
      acquisitionDate: "2015-11-20",
      remarks: "",
    },
  ],
  awards: [
    {
      awardDate: "2019-12-10",
      awardType: "Best Innovator",
      organization: "UPA HQ",
      description: "인사 프로세스 디지털 전환 공로",
    },
    {
      awardDate: "2023-04-28",
      awardType: "Leadership Excellence",
      organization: "서울중앙교회",
      description: "청년 리더십 프로그램 성과",
    },
  ],
  discipline: [
    {
      recordDate: "2020-05-10",
      type: "Coaching",
      reason: "Leadership coaching completed",
    },
  ],
  specialRemarks: [
    {
      entryDate: "2024-01-15",
      content: "국제 캠퍼스 멘토링 프로그램 운영",
    },
  ],
};

const formatDate = (value?: string) => (value?.trim() ? value : "-");
const formatPeriod = (start?: string, end?: string) => {
  if (!start && !end) return "-";
  if (start && end) return `${start} ~ ${end}`;
  if (start) return `${start} ~ 현재`;
  return end ?? "-";
};
const formatBoolean = (value?: boolean) =>
  value ? "Yes" : value === false ? "No" : "-";

const blueCellStyle = { backgroundColor: "#e3f2ff", fontWeight: 600 };
const grayCellStyle = { backgroundColor: "#f8f9fa" };
const calculateAge = (dob?: string) => {
  if (!dob) return "-";
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return "-";
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }
  return `${age}세`;
};

interface LabeledTableProps {
  label: string;
  columns: string[];
  rows: Array<Array<ReactNode>>;
  minRows?: number;
  emptyMessage?: string;
}

function LabeledTable({
  label,
  columns,
  rows,
  minRows = 0,
  emptyMessage = "데이터가 없습니다.",
}: LabeledTableProps) {
  const displayRows = [...rows];
  while (displayRows.length < minRows) {
    displayRows.push(
      columns.map((_, index) =>
        index === 0 ? <span className="text-muted">~</span> : "",
      ),
    );
  }

  const rowSpan = (displayRows.length || 1) + 1;

  return (

    <table className="table table-bordered table-sm">
      <tbody>
        <tr className="">
          <td
            rowSpan={rowSpan}
            className="align-middle text-center bg-light"
            style={{
              writingMode: "vertical-rl",
              fontWeight: 600,
              width: "4%",

            }}
          >
            {label}
          </td>
          {columns.map((column) => (
            <td className="bg-light" key={`${label}-${column}`}>{column}</td>
          ))}
        </tr>
        {displayRows.length ? (
          displayRows.map((cells, rowIndex) => (
            <tr key={`${label}-row-${rowIndex}`}>
              {cells.map((cell, cellIndex) => (
                <td key={`${label}-cell-${rowIndex}-${cellIndex}`}>
                  {cell ?? ""}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columns.length} className=" text-center text-muted">
              {emptyMessage}
            </td>
          </tr>
        )}
      </tbody>
    </table>

  );
}

export function ResumeViewPage() {
  const { resumeId } = useParams<{ resumeId?: string; }>();
  const profileId = resumeId ?? "sample";
  const record = SAMPLE_RECORD;

  const editLink = (section: string) =>
    `/personnel/profile/${profileId}/edit#personnel-${section}`;

  const {
    profile,
    family = [],
    education = [],
    workExperience = [],
    churchAppointments = [],
    training = [],
    qualifications = [],
    awards = [],
    discipline = [],
    specialRemarks = [],
  } = record;

  return (
    <div className="page-body">
      <div className="container-xl">
        <div className="page-break">
          <div className="text-center mb-3">
            <img src={CIGLogo} width={100} />
            <h1 className="mb-0">인사기록 카드</h1>
            <small className="text-muted">최종 갱신일: 2025.07.07</small>
          </div>


          {/* Header Table */}
          <table className="table table-bordered table-sm">
            <tbody>
              <tr>
                <th rowSpan={9} className="align-middle text-center" style={{ width: "150px" }}>
                  <img src={cadet_pic} alt="Photo" style={{ width: "150px", height: "200px", objectFit: "cover" }} />
                </th>
                <th className="bg-light">성 명</th>
                <td>
                  <div className="d-flex justify-content-between">
                    <span>(한글) {profile.nameKorean}</span>
                  </div>
                </td>
                <td>
                  <div className="d-flex justify-content-between">
                    <span>(한자) {profile.nameHanja}</span>
                  </div>
                </td>
                <td>
                  <div className="d-flex justify-content-between">
                    <span>(영어) {profile.nameEnglish}</span>
                  </div>
                </td>
              </tr>
              <tr>
                <th className="bg-light">주민번호</th>
                <td>{profile.residentId}</td>
                <th className="bg-light">축 복</th>
                <td>{formatDate(profile.blessing)}</td>
              </tr>
              <tr>
                <th className="bg-light">생년월일</th>
                <td>{formatDate(profile.dateOfBirth)}</td>
                <th className="bg-light">입 교</th>
                <td>{formatDate(profile.admissionDate)}</td>
              </tr>
              <tr>
                <th className="bg-light">국 적</th>
                <td>{profile.nationality}</td>
                <th className="bg-light">소속기관</th>
                <td>{profile.affiliation}</td>
              </tr>
              <tr>
                <th className="bg-light">소속부서</th>
                <td>{profile.department}</td>
                <th className="bg-light">직 책</th>
                <td>{profile.positionTitle}</td>
              </tr>
              <tr>
                <th className="bg-light">휴대전화</th>
                <td>{profile.mobilePhone}</td>
                <th className="bg-light">내선번호</th>
                <td>{profile.extensionNumber}</td>
              </tr>
              <tr>
                <th className="bg-light">E-MAIL</th>
                <td >{profile.email}</td>
                <th className="bg-light">주 소</th>
                <td >{profile.address}</td>
              </tr>

              <tr>
                <th className="bg-light">비 고</th>
                <td colSpan={3} >2세 축복 가정</td>
              </tr>
            </tbody>
          </table>


          <div className="mt-4">

            <LabeledTable
              label="학력"
              columns={["기간", "학교", "전공", "졸업구분", "학위"]}
              rows={education.map((entry) => [
                formatPeriod(entry.startDate, entry.endDate),
                entry.schoolNameKor,
                entry.majorKor,
                entry.graduationStatus,
                entry.degree,
              ])}
              minRows={education.length}
            />
          </div>

          <div className="mt-4">

            <LabeledTable
              label="가족"
              columns={["관계", "성명", "생년월일", "축복여부", "비고"]}
              rows={family.map((member) => [
                member.relation,
                member.name,
                formatDate(member.dateOfBirth),
                formatBoolean(member.blessed),
                "",
              ])}
              minRows={family.length}
            />
          </div>

          <div className="mt-4">

            <LabeledTable
              label="경력"
              columns={["근무기간", "기관명", "부서", "직책", "담당업무"]}
              rows={workExperience.map((entry) => [
                formatPeriod(entry.startDate, entry.endDate),
                entry.companyName,
                entry.department,
                entry.finalPosition,
                entry.jobDescription,
              ])}
              minRows={workExperience.length}
            />
          </div>
        </div>

        <div className="page-break">
          <div className="mt-4">

            <LabeledTable
              label="교회"
              columns={["활동기간", "조직명", "직책", "주요 역할"]}
              rows={churchAppointments.map((entry) => [
                formatPeriod(entry.startDate, entry.endDate),
                entry.organizationName,
                entry.lastPosition,
                entry.responsibilities,
              ])}
              minRows={churchAppointments.length}
            />
          </div>

          <div className="mt-4">

            <LabeledTable
              label="교육"
              columns={["과정명", "기간", "주관기관", "수료여부"]}
              rows={training.map((entry) => [
                entry.courseName,
                formatPeriod(entry.startDate, entry.endDate),
                entry.organizer,
                formatBoolean(entry.completion),
              ])}
              minRows={training.length}
            />
          </div>

          <div className="mt-4">

            <LabeledTable
              label="자격"
              columns={["취득일", "자격명", "비고"]}
              rows={qualifications.map((entry) => [
                formatDate(entry.acquisitionDate),
                entry.qualificationName,
                entry.remarks,
              ])}
              minRows={qualifications.length}
            />
          </div>

          <div className="mt-4">

            <LabeledTable
              label="수상"
              columns={["수상일", "구분", "상세 내용", "수여 기관"]}
              rows={awards.map((entry) => [
                formatDate(entry.awardDate),
                entry.awardType,
                entry.description,
                entry.organization,
              ])}
              minRows={awards.length}
            />
          </div>

          <div className="mt-4">

            <LabeledTable
              label="징계"
              columns={["기록일", "유형", "사유"]}
              rows={
                discipline.length
                  ? discipline.map((entry) => [
                    formatDate(entry.recordDate),
                    entry.type,
                    entry.reason,
                  ])
                  : []
              }
              minRows={discipline.length}
            />
          </div>

          <div className="mt-4">

            <LabeledTable
              label="비고"
              columns={["등록일", "내용"]}
              rows={specialRemarks.map((entry) => [
                formatDate(entry.entryDate),
                entry.content,
              ])}
              minRows={specialRemarks.length}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
