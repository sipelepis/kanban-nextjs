import Kanban from "../components/board/kanban";
import Sidebar from "../components/sidebar/sidebar";

export default function RootPage() {
  return (
    <>
      <Sidebar type="profile" />
      <Kanban />
    </>
  );
}
