"use client";
import Kanban from "../components/board/kanban";
import BoardTable from "../components/modals/create-board";
import Sidebar from "../components/sidebar/sidebar";

export default function RootPage() {
  return (
    <>
      <Sidebar type="profile" />
      <center>
        <BoardTable />
      </center>
      <Kanban />
    </>
  );
}
