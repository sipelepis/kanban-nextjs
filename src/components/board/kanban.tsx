"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/initSupabase";
import { Board } from "@/src/models/board.model";
import { Column } from "@/src/models/column.model";
import { Card } from "@/src/models/card.model";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import HSOverlay from "@preline/overlay";
import CreateCardModal from "../modals/create-cards";
import CreateBoardModal from "../../components/modals/create-board";
import CreateColumnModal from "../modals/create-column";

export default function Kanban() {
  const [boards, setBoards] = useState<Board[] | undefined>(undefined);
  const [columns, setColumns] = useState<Column[] | undefined>(undefined);
  const [cards, setCards] = useState<Card[] | undefined>(undefined);

  const [selectedBoard, setSelectedBoard] = useState<Board | undefined>(
    undefined
  );

  const [loading, setLoading] = useState(true);
  const [isWaiting, setIsWaiting] = useState(false);

  const fetchBoards = async () => {
    const { data: boardsResponse, error } = await supabase
      .from("Boards")
      .select("*")
      .order("CreationDate", { ascending: true })
      .returns<Board[]>();
    if (!error) {
      setBoards(boardsResponse);
      return boardsResponse;
    }
  };
  const fetchColumns = async () => {
    const { data: columns, error } = await supabase
      .from("Columns")
      .select("*")
      .order("Position", { ascending: true })
      .returns<Column[]>();

    if (!error) {
      setColumns(columns);
      return columns;
    }
  };
  const fetchCards = async () => {
    const { data: cards, error } = await supabase
      .from("Cards")
      .select("*")
      .order("Position", { ascending: true })
      .returns<Card[]>();

    if (!error) {
      setCards(cards);
      return cards;
    } else {
      return null;
    }
  };
  const filterColumns = (BoardID: number) => {
    return columns?.filter((column) => column.BoardID === BoardID);
  };
  const filterCards = (ColumnID: number) => {
    return cards?.filter((card) => card.ColumnID === ColumnID);
  };

  const handleOptionClick = (event: any) => {
    setLoading(true);
    const board = boards?.find((board) => board.id === +event!.target!.value!);
    setSelectedBoard(board!);
    setLoading(false);
  };
  const updateCard = async (
    CardID: number,
    ColumnID: number,
    DestinationIndex: number
  ) => {
    const { data, error } = await supabase
      .from("Cards")
      .update({
        ColumnID: ColumnID,
        LastUpdated: new Date().toISOString(),
        Position: DestinationIndex,
      })
      .eq("id", CardID);

    if (!error) {
      return data;
    } else {
      return null;
    }
  };
  const onDragEnd = async (result: any) => {
    if (!result.destination) return;
    const cardID = parseInt(result.draggableId);
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    const sourceColumnID = parseInt(result.source.droppableId);
    const destinationColumnID = parseInt(result.destination.droppableId);
    if (
      result.source.droppableId === result.destination.droppableId &&
      sourceIndex === destinationIndex
    ) {
      return;
    }
    updateCard(cardID, destinationColumnID, destinationIndex).then(async () => {
      await adjustCardsPosition(cardID, sourceIndex, destinationIndex);
    });
  };
  const adjustCardsPosition = async (
    cardID: number,
    sourceIndex: number,
    destinationIndex: number
  ) => {
    let updatedCards = [...cards!];
    const [movedCard] = updatedCards.splice(sourceIndex, 1);
    updatedCards.splice(destinationIndex, 0, movedCard);
    updatedCards = updatedCards.map((card, index) => ({
      ...card,
      Position: index,
    }));
    setCards(updatedCards);
    const updatePromises = updatedCards.map((card) => {
      if (card.id === cardID) return;
      updateCard(card.id, card.ColumnID, card.Position);
    });
    Promise.all(updatePromises)
      .then(() => {
        setIsWaiting(false);
      })
      .catch((error) => {
        setIsWaiting(false);
      })
      .finally(() => {
        setCards(updatedCards);
      });
  };
  const fetchData = async () => {
    await fetchBoards();
    await fetchColumns();
    await fetchCards();
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      fetchData();
    }
  });
  useEffect(() => {
    const initData = async () => {
      setLoading(false);
      await fetchCards();
      await fetchColumns();
      fetchBoards().then((boardsResponse) => {
        setSelectedBoard(boardsResponse![0]);
      });
    };
    if (typeof window !== "undefined") {
      initData();
    }
  }, []);
  if (loading) {
    return (
      <div className="container mx-auto flex items-center justify-center h-screen w-1/3">
        <div className="container mx-auto flex flex-col gap-4 text-center justify-centerbg-white shadow-sm ">
          <div>Loading...</div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="m-4">
        <div className="w-full flex flex-row items-center gap-2 ">
          <select
            onChange={handleOptionClick}
            className="flex-grow py-3 px-4 pe-9 block bg-gray-100 border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:border-transparent dark:text-neutral-400 dark:focus:ring-neutral-600">
            {boards?.map((board) => (
              <option key={board.id} value={board.id}>
                {board.BoardName}
              </option>
            ))}
          </select>
          <CreateBoardModal />
        </div>
        <div className="mx-auto flex flex-col lg:flex-row gap-4 my-2">
          <DragDropContext onDragEnd={onDragEnd}>
            {filterColumns(selectedBoard?.id!)?.map((column) => (
              <div
                key={column.id}
                className="flex flex-grow flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70">
                <div className={`p-4 md:p-5 w-full`}>
                  <div className="flex flex-row justify-between">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                      {column.ColumnName}
                    </h3>
                  </div>
                  <Droppable droppableId={column.id.toString()}>
                    {(provided, snapshot) => (
                      <div ref={provided.innerRef} {...provided.droppableProps}>
                        <div
                          className={`bg-gray-100 rounded-md shadow-md p-5 flex flex-col gap-4
                            ${snapshot.isDraggingOver && "bg-green-100"}`}>
                          {filterCards(column.id!)!.map((card, index) => {
                            return (
                              <Draggable
                                key={card.id.toString()}
                                index={index}
                                draggableId={card.id.toString()}
                                isDragDisabled={isWaiting}
                                disableInteractiveElementBlocking={true}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}>
                                    <div
                                      className="overflow-y-auto overflow-x-hidden h-auto cursor-pointer"
                                      style={{
                                        maxHeight: "calc(100vh - 290px)",
                                      }}>
                                      <div className="p-4 w-full flex flex-col flex-grow bg-white border shadow-sm rounded-lg dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70">
                                        <p className="dark:text-white">
                                          <strong>{card.Title}</strong>
                                        </p>
                                        <p className="dark:text-white">
                                          <small>{card.Description}</small>
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            ))}
          </DragDropContext>
        </div>
        <div className="container mx-auto flex flex-row justify-center text-center">
          <div className="flex flex-col justify-center text-center">
            <CreateColumnModal BoardID={selectedBoard?.id} />
            <CreateCardModal
              ColumnIDs={columns?.map((column) => ({
                ColumnID: column.id,
                ColumnName: column.ColumnName,
              }))}
            />
          </div>
        </div>
      </div>
    );
  }
}
