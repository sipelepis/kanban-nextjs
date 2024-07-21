"use client";
import Kanban from "../components/board/kanban";
import CreateCardModal from "../components/modals/create-cards";
import Sidebar from "../components/sidebar/sidebar";

export default function RootPage() {
  return (
    <>
      <Sidebar type="profile" />
      <Kanban />
    </>
  );
}
