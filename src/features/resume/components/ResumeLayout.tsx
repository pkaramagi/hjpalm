import { Outlet } from "react-router-dom";
import { ResumeProvider } from "./ResumeContext";

export function ResumeLayout() {
  return (
    <ResumeProvider>
      <Outlet />
    </ResumeProvider>
  );
}

