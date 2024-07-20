"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/initSupabase";
import { Board } from "@/src/models/board.model";
import { Column } from "@/src/models/column.model";
import { Card } from "@/src/models/card.model";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
export default function Kanban() {
  const [boards, setBoards] = useState<Board[] | null>(null);
  const [columns, setColumns] = useState<Column[] | null>(null);
  const [cards, setCards] = useState<Card[] | null>(null);

  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);

  const [loading, setLoading] = useState(true);
  const [isWaiting, setIsWaiting] = useState(false);
  const fetchBoards = async () => {
    const { data: boards, error } = await supabase
      .from("Boards")
      .select("*")
      .order("CreationDate", { ascending: true })
      .returns<Board[]>();
    if (!error) {
      setBoards(boards);
      setSelectedBoard(boards![0]);
      return selectedBoard;
    }
  };
  const fetchColumns = async (BoardID: number) => {
    const { data: columns, error } = await supabase
      .from("Columns")
      .select("*")
      .eq("BoardID", BoardID)
      .order("Position", { ascending: true })
      .returns<Column[]>();

    if (!error) {
      setColumns(columns);
      return columns;
    }
  };
  const fetchCards = async (ColumnID: number) => {
    const { data: cards, error } = await supabase
      .from("Cards")
      .select("*")
      .eq("ColumnID", ColumnID)
      .order("Position", { ascending: true })
      .returns<Card[]>();

    if (!error) {
      return cards;
    } else {
      return null;
    }
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
  useEffect(() => {
    if (typeof window !== "undefined") {
      fetchBoards().then((selectedBoard) => {
        fetchColumns(selectedBoard?.id!).then((columns) => {
          columns?.forEach((selectedColumns) => {
            fetchCards(selectedColumns.id).then((selectedCards) => {
              setCards((prevCards) => {
                if (!selectedCards) return prevCards;
                const updatedCards = prevCards ? [...prevCards] : [];

                selectedCards.forEach((newCard) => {
                  const cardIndex = updatedCards.findIndex(
                    (card) => card.id === newCard.id
                  );
                  if (cardIndex > -1) {
                    updatedCards[cardIndex] = newCard;
                  } else {
                    updatedCards.push(newCard);
                  }
                });

                return updatedCards;
              });
            });
            setLoading(false);
          });
        });
      });
    }
  });

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
        <div className="w-full flex flex-row justify-between items-center gap-4">
          <select className="py-3 px-4 pe-9 block w-full bg-gray-100 border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:border-transparent dark:text-neutral-400 dark:focus:ring-neutral-600">
            {boards?.map((board) => (
              <option key={board.id} value={board.id}>
                {board.BoardName}
              </option>
            ))}{" "}
          </select>
          <div className="w-32 ">
            <button
              type="button"
              className="my-5 flex flex-shrink-0 w-full justify-center items-center gap-2 size-[46px] text-sm font-semibold rounded-lg border border-transparent bg-white text-gray-800 hover:bg-gray-300 disabled:opacity-50 disabled:pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-5">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="mx-auto flex flex-col lg:flex-row gap-4 my-2">
          <DragDropContext onDragEnd={onDragEnd}>
            {columns?.map((column) => (
              <div
                key={column.id}
                className="flex flex-grow flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70">
                <div className={`p-4 md:p-5 w-full`}>
                  <div className="flex flex-row justify-between">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                      {column.ColumnName}
                    </h3>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-5">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                  </div>
                  <Droppable droppableId={column.id.toString()}>
                    {(provided, snapshot) => (
                      <div ref={provided.innerRef} {...provided.droppableProps}>
                        <div
                          className={`bg-gray-100 rounded-md shadow-md p-5 flex flex-col gap-4
                            ${snapshot.isDraggingOver && "bg-green-100"}`}>
                          {cards
                            ?.filter((card) => card.ColumnID === column.id)
                            .map((card, index) => {
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
      </div>
    );
  }
}
