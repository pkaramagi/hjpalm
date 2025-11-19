import { useMemo, useRef, useState } from "react";
import { Badge, Button, Card, Form, Text } from "tabler-react-ui";

import { ADMIN_ROLE_OPTIONS } from "../constants/roles";
import type { AdminUserRole, BulkCreateAdminUserInput, BulkCreateAdminUsersResult } from "../types";

type UserBulkUploadFormProps = {
  onBulkCreate: (entries: BulkCreateAdminUserInput[]) => Promise<BulkCreateAdminUsersResult>;
  onCancel?: () => void;
  variant?: "card" | "modal";
};

const SAMPLE_ROWS = [
  "Hanna Lee,hanna.lee@example.com,manager,Education",
  "Sungmin Go,sungmin.go@example.com,staff,Logistics",
  "Ruth Kang,ruth.kang@example.com,viewer,Communications",
].join("\n");

const VALID_ROLES = new Set<AdminUserRole>(ADMIN_ROLE_OPTIONS.map((role) => role.value));

export function UserBulkUploadForm({ onBulkCreate, onCancel, variant = "card" }: UserBulkUploadFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [rows, setRows] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BulkCreateAdminUsersResult | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const parsedPreview = useMemo(() => {
    if (!rows.trim()) return [];
    return rows
      .trim()
      .split(/\n+/)
      .filter(Boolean)
      .map((line) => line.split(",")[0]?.trim() ?? "")
      .filter(Boolean);
  }, [rows]);

  const parseRows = () => {
    const entries: BulkCreateAdminUserInput[] = [];
    const issues: string[] = [];

    rows
      .split(/\n+/)
      .map((row) => row.trim())
      .filter(Boolean)
      .forEach((line, index) => {
        const parts = line.split(",").map((part) => part.trim());
        if (parts.length < 4) {
          issues.push(`Line ${index + 1} is incomplete. Expected at least 4 comma separated values.`);
          return;
        }

        const [fullName, email, roleValue, department, phone, location] = parts;
        if (!fullName) {
          issues.push(`Line ${index + 1} is missing the full name.`);
        }
        if (!email) {
          issues.push(`Line ${index + 1} is missing the email.`);
        }
        const role = roleValue as AdminUserRole;
        if (!VALID_ROLES.has(role)) {
          issues.push(`Line ${index + 1} has an unknown role "${roleValue}".`);
        }
        if (!department) {
          issues.push(`Line ${index + 1} requires a department.`);
        }

        if (VALID_ROLES.has(role) && fullName && email && department) {
          entries.push({
            fullName,
            email,
            role,
            department,
            phone,
            location,
          });
        }
      });

    return { entries, issues };
  };

  const resetFileSelection = () => {
    setFileName(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setError(null);
    setFileError(null);
    setResult(null);

    const { entries, issues } = parseRows();

    if (issues.length > 0) {
      setError(issues.join(" "));
      return;
    }

    if (entries.length === 0) {
      setError("Add at least one valid row to continue.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await onBulkCreate(entries);
      setResult(response);
      setRows("");
      resetFileSelection();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bulk upload failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    const file = event.currentTarget.files?.[0];
    setFileError(null);
    if (!file) {
      return;
    }

    if (file.size === 0) {
      setFileError("Selected file is empty.");
      return;
    }

    try {
      const text = await file.text();
      setRows(text);
      setFileName(file.name);
      setResult(null);
    } catch (err) {
      setFileError(err instanceof Error ? err.message : "Could not read the file.");
    }
  };

  const description = "Upload a CSV or paste rows to add multiple people at once.";
  const headerContent = (
    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
      <div>
        {variant === "card" ? (
          <Card.Title className="mb-1">Bulk add users</Card.Title>
        ) : (
          <>
            <h5 className="mb-1">Bulk add users</h5>
            <Text muted size="sm">{description}</Text>
          </>
        )}
        {variant === "card" ? (
          <Text muted size="sm">{description}</Text>
        ) : null}
      </div>
      <Badge color="indigo" variant="light">
        CSV
      </Badge>
    </div>
  );
  const formContent = (
    <form className="d-grid gap-3" onSubmit={handleSubmit} noValidate>
      {error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : null}
      {result ? (
        <div className="alert alert-success" role="alert">
          Created {result.created.length} users.{" "}
          {result.skipped.length > 0 ? `${result.skipped.length} rows skipped.` : "All rows imported."}
        </div>
      ) : null}
      {result && result.skipped.length > 0 ? (
        <div className="alert alert-warning" role="alert">
          {result.skipped.map((item) => (
            <div key={item.email}>
              <strong>{item.email || "Row"}</strong>: {item.reason}
            </div>
          ))}
        </div>
      ) : null}
      <div>
        <label className="form-label">Upload CSV</label>
        <input
          ref={fileInputRef}
          className="form-control"
          type="file"
          accept=".csv,text/csv"
          onChange={handleFileChange}
          disabled={submitting}
        />
        <small className="text-muted d-block mt-1">
          Columns: full name, email, role, department, phone (optional), location (optional)
        </small>
        {fileName ? (
          <div className="d-flex align-items-center gap-2 mt-2">
            <Badge color="blue" variant="light">
              {fileName}
            </Badge>
            <Button size="xs" variant="light" color="secondary" onClick={resetFileSelection} disabled={submitting}>
              Clear file
            </Button>
          </div>
        ) : null}
        {fileError ? <small className="text-danger d-block mt-2">{fileError}</small> : null}
      </div>
      <Form.Textarea
        label="Comma separated rows"
        placeholder="Full Name,email,role,department[,phone][,location]"
        rows={6}
        value={rows}
        onChange={(event) => {
          if (fileName) {
            resetFileSelection();
          }
          setRows(event.currentTarget.value);
        }}
        disabled={submitting}
      />
      <div className="d-flex flex-wrap gap-2">
        <Button
          type="button"
          variant="light"
          color="secondary"
          onClick={() => {
            resetFileSelection();
            setRows(SAMPLE_ROWS);
          }}
          disabled={submitting}
        >
          Use sample data
        </Button>
        {onCancel ? (
          <Button type="button" variant="light" color="secondary" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit" color="primary" disabled={submitting}>
          {submitting ? "Processing..." : "Create users"}
        </Button>
      </div>
      <div className="border rounded p-3">
        <Text size="sm" className="mb-1 d-block fw-semibold text-uppercase text-muted">
          Expected columns
        </Text>
        <ol className="mb-2 ps-3">
          <li>Full name</li>
          <li>Email</li>
          <li>Role ({ADMIN_ROLE_OPTIONS.map((role) => role.value).join(", ")})</li>
          <li>Department</li>
          <li>Phone (optional)</li>
          <li>Location (optional)</li>
        </ol>
        {parsedPreview.length > 0 ? (
          <Text size="sm" muted className="mb-0">
            Ready to import {parsedPreview.length} {parsedPreview.length === 1 ? "user" : "users"}.
          </Text>
        ) : (
          <Text size="sm" muted className="mb-0">
            Separate each user with a new line. Need role details? See guide above.
          </Text>
        )}
      </div>
    </form>
  );

  return variant === "card" ? (
    <Card className="mb-4">
      <Card.Header>{headerContent}</Card.Header>
      <Card.Body>{formContent}</Card.Body>
    </Card>
  ) : (
    <div className="d-grid gap-3">
      {headerContent}
      {formContent}
    </div>
  );
}

export default UserBulkUploadForm;
