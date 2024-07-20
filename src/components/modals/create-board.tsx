import { supabase } from "@/lib/initSupabase";
import React, { useState, FormEvent } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
function Error({ message }: { message: string }) {
  return (
    <div className="rounded  border border-red-600 bg-red-50 p-1 text-red-600">
      {message}
    </div>
  );
}
const BoardTable = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<{ BoardName: string; Description: string }>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit: SubmitHandler<{
    BoardName: string;
    Description: string;
  }> = async (formData, e) => {
    // async request which may result error
    try {
      setIsLoading(true);
      setError(null);
      const { data, error } = await supabase.from("Boards").insert({
        BoardName: formData.BoardName,
        Description: formData.Description,
      });
      if (error) {
        setError(error.message);
      }
      reset();

      setIsLoading(false);
    } catch (e) {}
  };

  return (
    <div className="flex-grow-1">
      <button
        type="button"
        data-hs-overlay="#hs-vertically-centered-modal"
        className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-white text-gray-800 hover:bg-gray-300disabled:opacity-50 disabled:pointer-events-none">
        Create Board
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
      <div
        id="hs-vertically-centered-modal"
        className="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none">
        <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto min-h-[calc(100%-3.5rem)] flex items-center">
          <div className="w-full flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-neutral-700/70">
            <div className="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
              <h3 className="font-bold text-gray-800 dark:text-white">
                Create A New Board
              </h3>
              <button
                type="button"
                className="flex justify-center items-center size-7 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700"
                data-hs-overlay="#hs-vertically-centered-modal">
                <span className="sr-only">Close</span>
                <svg
                  className="flex-shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <p className="text-gray-800 dark:text-neutral-400">
                Please fill the form below to create a new board.
              </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                {error && <div style={{ color: "red" }}>{error}</div>}
                <div className="p-4">
                  <label
                    htmlFor="BoardName"
                    className="block text-sm font-medium text-gray-700 dark:text-neutral-300">
                    Board Name
                  </label>
                  <input
                    required
                    type="text"
                    id="BoardName"
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:focus:ring-neutral-600"
                    {...register("BoardName", {
                      required: {
                        value: true,
                        message: "BoardName is required!",
                      },
                    })}
                  />
                  {errors.BoardName && (
                    <Error message={errors.BoardName.message!} />
                  )}
                </div>
                <div className="p-4">
                  <label
                    htmlFor="Description"
                    className="block text-sm font-medium text-gray-700 dark:text-neutral-300">
                    Description
                  </label>
                  <textarea
                    required
                    id="Description"
                    rows={3}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:focus:ring-neutral-600"
                    {...register("Description", {
                      required: {
                        value: true,
                        message: "Description is required!",
                      },
                    })}
                  />

                  {errors.Description && (
                    <Error message={errors.Description.message!} />
                  )}
                </div>
              </div>
              <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t dark:border-neutral-700">
                <button
                  disabled={isLoading}
                  type="button"
                  className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                  data-hs-overlay="#hs-vertically-centered-modal">
                  Close
                </button>

                <button
                  disabled={isLoading}
                  type="submit"
                  className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                  {isLoading ? "Creating Board..." : "Create Board"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BoardTable;
