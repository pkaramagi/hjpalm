import { useMemo, useState } from "react";
import type { DegreeType } from "../types/resume";
import type { ResumeRecordWithId } from "../api/resumeApi";
import { containsText } from "../utils/formatters";

export interface SimpleFilters {
  query: string;
  department: string;
  position: string;
  rank: string;
}

export interface AdvancedFilters {
  school: string;
  degree: DegreeType | "";
  company: string;
  workRole: string;
  trainingCategory: string;
  churchRole: string;
  qualification: string;
  award: string;
  withPhoto: boolean;
  currentlyEmployed: boolean;
}

const SIMPLE_DEFAULT: SimpleFilters = {
  query: "",
  department: "all",
  position: "",
  rank: "",
};

const ADVANCED_DEFAULT: AdvancedFilters = {
  school: "",
  degree: "",
  company: "",
  workRole: "",
  trainingCategory: "",
  churchRole: "",
  qualification: "",
  award: "",
  withPhoto: false,
  currentlyEmployed: false,
};

/**
 * Custom hook to manage resume filtering logic
 * @param records - Array of resume records to filter
 * @returns Filter state, handlers, and filtered records
 */
export function useResumeFilters(records: ResumeRecordWithId[]) {
  const [simpleFilters, setSimpleFilters] = useState<SimpleFilters>(SIMPLE_DEFAULT);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>(ADVANCED_DEFAULT);

  const updateSimpleFilter = (key: keyof SimpleFilters) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { value } = event.currentTarget;
      setSimpleFilters((prev) => ({ ...prev, [key]: value }));
    };

  const updateAdvancedFilter = (key: keyof AdvancedFilters) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { value } = event.currentTarget;
      setAdvancedFilters((prev) => ({ ...prev, [key]: value }));
    };

  const resetAllFilters = () => {
    setSimpleFilters(SIMPLE_DEFAULT);
    setAdvancedFilters(ADVANCED_DEFAULT);
  };

  const hasActiveAdvancedFilters = useMemo(() => {
    return (
      advancedFilters.withPhoto ||
      advancedFilters.currentlyEmployed ||
      Object.entries(advancedFilters).some(([key, value]) => {
        if (key === "withPhoto" || key === "currentlyEmployed") {
          return false;
        }
        if (typeof value === "string") {
          return value.trim().length > 0;
        }
        return false;
      })
    );
  }, [advancedFilters]);

  const filteredRecords = useMemo(() => {
    const query = simpleFilters.query.trim().toLowerCase();
    const departmentFilter = simpleFilters.department.toLowerCase();
    const positionFilter = simpleFilters.position.trim().toLowerCase();
    const rankFilter = simpleFilters.rank.trim().toLowerCase();
    const schoolFilter = advancedFilters.school.trim().toLowerCase();
    const degreeFilter = advancedFilters.degree;
    const companyFilter = advancedFilters.company.trim().toLowerCase();
    const workRoleFilter = advancedFilters.workRole.trim().toLowerCase();
    const trainingCategoryFilter = advancedFilters.trainingCategory.trim().toLowerCase();
    const churchRoleFilter = advancedFilters.churchRole.trim().toLowerCase();
    const qualificationFilter = advancedFilters.qualification.trim().toLowerCase();
    const awardFilter = advancedFilters.award.trim().toLowerCase();
    const requirePhoto = advancedFilters.withPhoto;
    const requireCurrent = advancedFilters.currentlyEmployed;

    return records.filter((record) => {
      const profile = record.profile ?? {};
      const educationEntries = record.education ?? [];
      const workEntries = record.workExperience ?? [];
      const trainingEntries = record.training ?? [];
      const churchEntries = record.churchAppointments ?? [];
      const qualificationEntries = record.qualifications ?? [];
      const awardEntries = record.awards ?? [];

      if (requirePhoto && !profile.photoUrl) {
        return false;
      }

      if (
        simpleFilters.department !== "all" &&
        (profile.department?.toLowerCase() ?? "") !== departmentFilter
      ) {
        return false;
      }

      if (
        positionFilter &&
        !(
          containsText(profile.positionTitle, positionFilter) ||
          workEntries.some(
            (entry) =>
              containsText(entry.finalPosition, positionFilter) ||
              containsText(entry.department, positionFilter)
          )
        )
      ) {
        return false;
      }

      if (rankFilter && !containsText(profile.rankTitle, rankFilter)) {
        return false;
      }

      if (
        schoolFilter &&
        !educationEntries.some(
          (entry) =>
            containsText(entry.schoolNameKor, schoolFilter) ||
            containsText(entry.majorKor, schoolFilter)
        )
      ) {
        return false;
      }

      if (
        degreeFilter &&
        !educationEntries.some((entry) => entry.degree === degreeFilter)
      ) {
        return false;
      }

      if (
        companyFilter &&
        !workEntries.some((entry) => containsText(entry.companyName, companyFilter))
      ) {
        return false;
      }

      if (
        workRoleFilter &&
        !(
          containsText(profile.positionTitle, workRoleFilter) ||
          workEntries.some(
            (entry) =>
              containsText(entry.finalPosition, workRoleFilter) ||
              containsText(entry.department, workRoleFilter)
          )
        )
      ) {
        return false;
      }

      if (requireCurrent && !workEntries.some((entry) => !entry.endDate)) {
        return false;
      }

      if (
        trainingCategoryFilter &&
        !trainingEntries.some(
          (entry) =>
            containsText(entry.category, trainingCategoryFilter) ||
            containsText(entry.courseName, trainingCategoryFilter)
        )
      ) {
        return false;
      }

      if (
        churchRoleFilter &&
        !churchEntries.some(
          (entry) =>
            containsText(entry.lastPosition, churchRoleFilter) ||
            containsText(entry.organizationName, churchRoleFilter)
        )
      ) {
        return false;
      }

      if (
        qualificationFilter &&
        !qualificationEntries.some((entry) =>
          containsText(entry.qualificationName, qualificationFilter)
        )
      ) {
        return false;
      }

      if (
        awardFilter &&
        !awardEntries.some(
          (entry) =>
            containsText(entry.awardType, awardFilter) ||
            containsText(entry.description, awardFilter)
        )
      ) {
        return false;
      }

      if (query) {
        const basicFields = [
          profile.nameKorean,
          profile.nameHanja,
          profile.department,
          profile.positionTitle,
          profile.rankTitle,
          profile.affiliation,
          profile.email,
          profile.mobilePhone,
        ];

        const matchesQuery =
          basicFields.some((field) => containsText(field, query)) ||
          educationEntries.some(
            (entry) =>
              containsText(entry.schoolNameKor, query) ||
              containsText(entry.majorKor, query)
          ) ||
          workEntries.some(
            (entry) =>
              containsText(entry.companyName, query) ||
              containsText(entry.finalPosition, query)
          ) ||
          trainingEntries.some(
            (entry) =>
              containsText(entry.courseName, query) ||
              containsText(entry.category, query)
          ) ||
          churchEntries.some(
            (entry) =>
              containsText(entry.organizationName, query) ||
              containsText(entry.lastPosition, query)
          ) ||
          qualificationEntries.some((entry) =>
            containsText(entry.qualificationName, query)
          ) ||
          awardEntries.some(
            (entry) =>
              containsText(entry.awardType, query) ||
              containsText(entry.description, query)
          );

        if (!matchesQuery) {
          return false;
        }
      }

      return true;
    });
  }, [records, simpleFilters, advancedFilters]);

  const departmentOptions = useMemo(() => {
    const set = new Set<string>();
    records.forEach((record) => {
      const value = record.profile?.department?.trim();
      if (value) {
        set.add(value);
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [records]);

  const trainingCategories = useMemo(() => {
    const set = new Set<string>();
    records.forEach((record) =>
      record.training?.forEach((entry) => {
        if (entry.category?.trim()) {
          set.add(entry.category.trim());
        }
      })
    );
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [records]);

  return {
    simpleFilters,
    advancedFilters,
    updateSimpleFilter,
    updateAdvancedFilter,
    setAdvancedFilters,
    resetAllFilters,
    hasActiveAdvancedFilters,
    filteredRecords,
    departmentOptions,
    trainingCategories,
  };
}
