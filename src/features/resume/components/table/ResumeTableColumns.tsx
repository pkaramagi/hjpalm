import type { ColumnDef } from "@tanstack/react-table";
import { Avatar, Badge, Button } from "tabler-react-ui";
import { IconExternalLink, IconMail } from "@tabler/icons-react";
import type { ResumeTableRow } from "../../hooks/useResumeTableData";

/**
 * Creates table column definitions for resume search results
 * @param onViewClick - Callback when view button is clicked
 * @returns Array of column definitions
 */
export function createResumeTableColumns(
  onViewClick: (profileId: string) => void
): ColumnDef<ResumeTableRow>[] {
  return [
    {
      id: "candidate",
      header: "Candidate",
      cell: ({ row }) => {
        const candidate = row.original;
        return (
          <div className="d-flex align-items-center gap-3">
            <Avatar
              size="md"
              src={candidate.avatar}
              alt={candidate.name}
              color="primary"
            >
              {!candidate.avatar ? candidate.initials : null}
            </Avatar>
            <div>
              <div className="fw-semibold">{candidate.name}</div>
              {candidate.englishName ? (
                <div className="text-secondary small">
                  {candidate.englishName}
                </div>
              ) : null}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "department",
      header: "Department",
      cell: ({ getValue }) => (
        <Badge color="blue-lt">{getValue<string>() || "-"}</Badge>
      ),
    },
    {
      id: "currentRole",
      header: "Current Role",
      cell: ({ row }) => (
        <div className="d-flex flex-column">
          <span className="fw-semibold">
            {row.original.currentRole || "-"}
          </span>
          <span className="text-secondary small">
            {row.original.company || ""}
          </span>
        </div>
      ),
    },
    {
      id: "contact",
      header: "Contact",
      cell: ({ row }) => (
        <div className="d-flex flex-column">
          <span>{row.original.email}</span>
          {row.original.phone ? (
            <span className="text-secondary small">{row.original.phone}</span>
          ) : null}
        </div>
      ),
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="d-flex gap-2 justify-content-end">
          <Button
            size="sm"
            variant="light"
            color="primary"
            onClick={() => onViewClick(row.original.profileId)}
          >
            <IconExternalLink size={16} className="me-1" />
            View
          </Button>
          <Button size="sm" variant="light" color="secondary">
            <IconMail size={16} className="me-1" />
            Message
          </Button>
        </div>
      ),
    },
  ];
}
