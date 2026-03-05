import { Navigate } from "react-router-dom";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const isAuth = sessionStorage.getItem("moboost_auth") === "1";
  if (!isAuth) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
