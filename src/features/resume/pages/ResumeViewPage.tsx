import React, { ReactNode, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import cadet_pic from "@/assets/cadet.png";
import { Card } from "tabler-react-ui";
/* -------------------------------------------------
   SAMPLE DATA – matches your PDF
   ------------------------------------------------- */
const SAMPLE_RECORD = {
  profile: {
    nameKorean: "김철수",
    nameHanja: "金哲洙",
    nameEnglish: "Cheolsu Kim",
    residentId: "801010-1234567",
    nationality: "대한민국",
    affiliation: "천주평화통일가정연합",
    department: "국제본부",
    positionTitle: "부장",
    rankTitle: "1급",
    mobilePhone: "010-1234-5678",
    extensionNumber: "1234",
    email: "cheolsu.kim@familyfed.org",
    address: "서울특별시 용산구 한남동 123-45",
    dateOfBirth: "1980-10-10",
    admissionDate: "2005-03-01",
    blessing: "2010-08-15",
    photoUrl: "https://via.placeholder.com/120x160?text=PHOTO",
  },
  family: [
    { relation: "부", name: "김영수", dob: "1955-03-15", blessed: true },
    { relation: "모", name: "이순자", dob: "1958-07-22", blessed: true },
    { relation: "형", name: "김철민", dob: "1978-11-30", blessed: true },
    { relation: "여동생", name: "김하영", dob: "1985-05-10", blessed: false },
    { relation: "처", name: "박영희", dob: "1982-07-15", blessed: true },
  ],
  education: [
    { period: "1999.03 ~ 2003.02", school: "서울대학교", major: "경영학", status: "졸업", degree: "학사" },
    { period: "2008.09 ~ 2010.08", school: "연세대학교 대학원", major: "국제경영", status: "졸업", degree: "석사" },
  ],
  career: [
    { period: "2005.03 ~ 2015.12", company: "가정연합 한국본부", dept: "기획팀", position: "과장", duties: "전국 행사 기획 및 운영" },
  ],
  churchAppointments: [
    { period: "2020.01 ~ 현재", org: "서울교구", position: "교구장", duties: "지역 신앙 공동체 지도 및 목회" },
  ],
  training: [
    { name: "40일 리더십 워크숍", period: "2015.06.01 ~ 2015.07.10", organizer: "세계본부", completed: true },
  ],
  qualifications: [
    { name: "통역 자격증 (영어)", date: "2012-05-20" },
    { name: "TOEIC 950", date: "2012-05-20" },
  ],
  awards: [
    { date: "2023-10-01", type: "공로상", org: "세계본부", desc: "40일 특별 헌신 공로" },
  ],
  discipline: [] as any[],
  specialRemarks: [
    { date: "2024-01-15", content: "일본 선교 3년 파송 예정" },
  ],
};

/* -------------------------------------------------
   UTILS
   ------------------------------------------------- */
const formatDate = (d?: string) => (d?.trim() ? d : "-");
const formatBoolean = (v?: boolean) => (v ? "Yes" : v === false ? "No" : "-");

/* -------------------------------------------------
   MAIN COMPONENT
   ------------------------------------------------- */
export function ResumeViewPage() {
  const [record] = useState(SAMPLE_RECORD);
  const [searchParams] = useSearchParams();
  const profileId = searchParams.get("profileId") ?? "123";

  const editLink = (key: string) =>
    `/personnel/profile/${profileId}/edit#personnel-${key}`;

  const { profile, family, education, career, churchAppointments, training, qualifications, awards, discipline, specialRemarks } = record;

  return (
    <>

      <div className="page">
        <div className="a4-container">

          {/* ========== PAGE 1 ========== */}
          <div className="page-break">
            <div className="text-center mb-3">
              <h3 className="mb-0">인사기록카드</h3>
              <small className="text-muted">작성일: 2025.07.07</small>
            </div>

            <Card>
              {/* Header Table */}
              <table className="table card-table table-bordered table-sm">
                <tbody>
                  <tr>
                    <th rowSpan={5} className="align-middle text-center bg-light" style={{ width: "150px" }}>
                      <img src={cadet_pic} alt="Photo" style={{ width: "150px", height: "200px", objectFit: "cover" }} />

                    </th>
                    <th className="bg-light">성 명</th>
                    <td >
                      <div className="d-flex justify-content-between">
                        <span>(한글) {profile.nameKorean}</span>

                      </div>
                    </td>
                    <td >
                      <div className="d-flex justify-content-between">

                        <span>(한자) {profile.nameHanja}</span>

                      </div>
                    </td>
                    <td >
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
                    <td colSpan={3}>{profile.email}</td>
                  </tr>
                  <tr>
                    <th className="bg-light">주 소</th>
                    <td colSpan={3}>{profile.address}</td>
                  </tr>
                  <tr>
                    <th className="bg-light">비 고</th>
                    <td colSpan={3} className="text-muted">2세 축복 가정</td>
                  </tr>
                </tbody>
              </table>
            </Card>

            {/* 학력사항 */}
            <div className="mt-4">
              <h6 className="border-bottom pb-1">학력사항</h6>
              <table className="table table-bordered table-sm">
                <thead className="table-light">

                  <tr>
                    <th colSpan={1} rowSpan={2}></th>
                    <th>기간</th>
                    <th>학교</th>
                    <th>전공</th>
                    <th>졸업구분</th>
                    <th>학위</th>
                  </tr>
                </thead>
                <tbody>

                  {education.map((e, i) => (
                    <tr key={i}>
                      {/* left vertical label – only on the very first row */}
                      {i === 0 && (
                        <td
                          rowSpan={education.length + 1}
                          className="align-middle text-center"
                          style={{
                            writingMode: "vertical-rl",
                            textOrientation: "mixed",
                            whiteSpace: "nowrap",
                            backgroundColor: "#f8f9fa",
                            fontWeight: "bold",
                          }}
                        >
                          학력사항
                        </td>
                      )}
                      <td>{e.period}</td>
                      <td>{e.school}</td>
                      <td>{e.major}</td>
                      <td>{e.status}</td>
                      <td>{e.degree}</td>
                    </tr>
                  ))}
                  {[...Array(3 - education.length)].map((_, i) => (
                    <tr key={`empty-edu-${i}`}>
                      <td className="text-muted">~</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 가족사항 */}
            <div className="mt-4">
              <h6 className="border-bottom pb-1">가족사항</h6>
              <table className="table table-bordered table-sm">
                <thead className="table-light">
                  <tr>
                    <th>관계</th>
                    <th>성명</th>
                    <th>생년월일</th>
                    <th>축복</th>
                    <th>비고</th>
                  </tr>
                </thead>
                <tbody>
                  {family.map((f, i) => (
                    <tr key={i}>
                      <td>{f.relation}</td>
                      <td>{f.name}</td>
                      <td>{formatDate(f.dob)}</td>
                      <td>{formatBoolean(f.blessed)}</td>
                      <td></td>
                    </tr>
                  ))}
                  {[...Array(6 - family.length)].map((_, i) => (
                    <tr key={`empty-fam-${i}`}>
                      <td className="text-muted">~</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 발령사항 */}
            <div className="mt-4">
              <h6 className="border-bottom pb-1">발령사항</h6>
              <table className="table table-bordered table-sm">
                <thead className="table-light">
                  <tr>
                    <th>근무기간</th>
                    <th>회사명</th>
                    <th>부서</th>
                    <th>최종직위</th>
                    <th>직무</th>
                  </tr>
                </thead>
                <tbody>
                  {career.map((c, i) => (
                    <tr key={i}>
                      <td>{c.period}</td>
                      <td>{c.company}</td>
                      <td>{c.dept}</td>
                      <td>{c.position}</td>
                      <td>{c.duties}</td>
                    </tr>
                  ))}
                  {[...Array(3 - career.length)].map((_, i) => (
                    <tr key={`empty-career-${i}`}>
                      <td className="text-muted">~</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ========== PAGE 2 ========== */}
          <div className="page-break">
            {/* 경력사항 */}
            <div className="mt-4">
              <h6 className="border-bottom pb-1">경력사항</h6>
              <table className="table table-bordered table-sm">
                <thead className="table-light">
                  <tr>
                    <th>근무기간</th>
                    <th>회사명</th>
                    <th>부서</th>
                    <th>최종직위</th>
                    <th>직무</th>
                  </tr>
                </thead>
                <tbody>
                  {churchAppointments.map((c, i) => (
                    <tr key={i}>
                      <td>{c.period}</td>
                      <td>{c.org}</td>
                      <td>-</td>
                      <td>{c.position}</td>
                      <td>{c.duties}</td>
                    </tr>
                  ))}
                  {[...Array(4 - churchAppointments.length)].map((_, i) => (
                    <tr key={`empty-church-${i}`}>
                      <td className="text-muted">~</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 교육이수 */}
            <div className="mt-4">
              <h6 className="border-bottom pb-1">교육이수</h6>
              <table className="table table-bordered table-sm">
                <thead className="table-light">
                  <tr>
                    <th>교육명</th>
                    <th>기간</th>
                    <th>주관처</th>
                    <th>구분</th>
                    <th>수료여부</th>
                  </tr>
                </thead>
                <tbody>
                  {training.map((t, i) => (
                    <tr key={i}>
                      <td>{t.name}</td>
                      <td>{t.period}</td>
                      <td>{t.organizer}</td>
                      <td>리더십</td>
                      <td>{formatBoolean(t.completed)}</td>
                    </tr>
                  ))}
                  {[...Array(4 - training.length)].map((_, i) => (
                    <tr key={`empty-train-${i}`}>
                      <td className="text-muted">~</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 자격사항 */}
            <div className="mt-4">
              <h6 className="border-bottom pb-1">자격사항</h6>
              <table className="table table-bordered table-sm">
                <thead className="table-light">
                  <tr>
                    <th>취득일자</th>
                    <th>자격명</th>
                    <th>취득일자</th>
                    <th>자격명</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{qualifications[0]?.date || "~"}</td>
                    <td>{qualifications[0]?.name || ""}</td>
                    <td>{qualifications[1]?.date || "~"}</td>
                    <td>{qualifications[1]?.name || ""}</td>
                  </tr>
                  {[...Array(3)].map((_, i) => (
                    <tr key={`empty-qual-${i}`}>
                      <td className="text-muted">~</td>
                      <td></td>
                      <td className="text-muted">~</td>
                      <td></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 포상내역 */}
            <div className="mt-4">
              <h6 className="border-bottom pb-1">포상내역</h6>
              <table className="table table-bordered table-sm">
                <thead className="table-light">
                  <tr>
                    <th>일자</th>
                    <th>종류</th>
                    <th>내용</th>
                    <th>기관</th>
                  </tr>
                </thead>
                <tbody>
                  {awards.map((a, i) => (
                    <tr key={i}>
                      <td>{a.date}</td>
                      <td>{a.type}</td>
                      <td>{a.desc}</td>
                      <td>{a.org}</td>
                    </tr>
                  ))}
                  {[...Array(3 - awards.length)].map((_, i) => (
                    <tr key={`empty-award-${i}`}>
                      <td className="text-muted">~</td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 상벌내역 */}
            <div className="mt-4">
              <h6 className="border-bottom pb-1">상벌내역</h6>
              <table className="table table-bordered table-sm">
                <thead className="table-light">
                  <tr>
                    <th>일자</th>
                    <th>사유</th>
                  </tr>
                </thead>
                <tbody>
                  {discipline.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="text-center text-muted">기록 없음</td>
                    </tr>
                  ) : (
                    discipline.map((d, i) => (
                      <tr key={i}>
                        <td>{d.date}</td>
                        <td>{d.reason}</td>
                      </tr>
                    ))
                  )}
                  {[...Array(3)].map((_, i) => (
                    <tr key={`empty-disc-${i}`}>
                      <td className="text-muted">~</td>
                      <td></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 특이사항 */}
            <div className="mt-4">
              <h6 className="border-bottom pb-1">특이사항</h6>
              <table className="table table-bordered table-sm">
                <thead className="table-light">
                  <tr>
                    <th>작성일</th>
                    <th>내용</th>
                  </tr>
                </thead>
                <tbody>
                  {specialRemarks.map((r, i) => (
                    <tr key={i}>
                      <td>{r.date}</td>
                      <td>{r.content}</td>
                    </tr>
                  ))}
                  {[...Array(3 - specialRemarks.length)].map((_, i) => (
                    <tr key={`empty-remark-${i}`}>
                      <td className="text-muted">~</td>
                      <td></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>


    </>
  );
}