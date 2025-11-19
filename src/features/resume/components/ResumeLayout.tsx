import { Outlet, useParams } from "react-router-dom";
import { ResumeProvider } from "./ResumeContext";

export function ResumeLayout() {
  const { resumeId } = useParams<{ resumeId?: string; }>();

  return (
    <ResumeProvider recordId={resumeId}>
      <Outlet />
    </ResumeProvider>
  );
}
