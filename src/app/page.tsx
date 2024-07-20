import LoginAndSignup from "../components/auth/login_and_signup";
import Sidebar from "../components/sidebar/sidebar";
import KanbanBoard from "./dashboard/page";

export default function RootPage() {
  return (
    <>
      <Sidebar type="profile" />
      <KanbanBoard />
    </>
  );
}
