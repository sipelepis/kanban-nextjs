import { supabase } from "@/lib/initSupabase";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
function Error({ message }: { message: string }) {
  return (
    <div className="rounded  border border-red-600 bg-red-50 p-1 text-red-600">
      {message}
    </div>
  );
}
type CreateCardModalProps = {
  ColumnIDs: { ColumnID?: number; ColumnName?: string }[] | undefined;
};
const CreateCardModal: React.FC<CreateCardModalProps> = ({ ColumnIDs }) => {
  const {
    register,
    handleSubmit,
    reset,

    formState: { errors },
  } = useForm<{
    Description: string;
    Priority: number;
    Title: string;
    ColumnID: number;
  }>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit: SubmitHandler<{
    Description: string;
    Priority: number;
    Title: string;
    ColumnID: number;
  }> = async (formData, e) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log(formData);
      const { data, error } = await supabase.from("Cards").insert({
        ColumnID: formData.ColumnID,
        Description: formData.Description,
        LastUpdated: new Date().toISOString(),
        DueDate: new Date().toISOString(),
        Priority: formData.Priority,
        Title: formData.Title,
      });
      if (error) {
        console.log(error);
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
        className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-gray-800 hover:text-gray-300  disabled:opacity-50 disabled:pointer-events-none dark:text-gray-100 dark:hover:text-gray-300"
        data-hs-overlay="#create-card-modal">
        Create Card
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
        id="create-card-modal"
        className="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none">
        <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto min-h-[calc(100%-3.5rem)] flex items-center">
          <div className="w-full flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-neutral-700/70">
            <div className="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
              <h3 className="font-bold text-gray-800 dark:text-white">CARD</h3>
              <button
                type="button"
                className="flex justify-center items-center size-7 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700"
                data-hs-overlay="#create-card-modal">
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
                Please fill the form below to create a new Card.
              </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                {error && <div style={{ color: "red" }}>{error}</div>}
                <div className="p-4">
                  <label
                    htmlFor="Title"
                    className="block text-left text-sm font-medium text-gray-700 dark:text-neutral-300">
                    Title
                  </label>
                  <input
                    required
                    type="text"
                    id="Title"
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:focus:ring-neutral-600"
                    {...register("Title", {
                      required: {
                        value: true,
                        message: "Title is required!",
                      },
                    })}
                  />
                  {errors.Title && <Error message={errors.Title.message!} />}
                </div>
                <div className="p-4">
                  <label
                    htmlFor="Description"
                    className="block  text-left text-sm font-medium text-gray-700 dark:text-neutral-300">
                    Description
                  </label>
                  <textarea
                    required
                    rows={3}
                    id="BoardName"
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
                <div className="p-4">
                  <label
                    htmlFor="ColumnID"
                    className="block text-left text-sm font-medium text-gray-700 dark:text-neutral-300">
                    Column
                  </label>
                  <select
                    id="ColumnID"
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:focus:ring-neutral-600"
                    {...register("ColumnID", {
                      required: {
                        value: true,
                        message: "Column is required!",
                      },
                    })}>
                    <option hidden>Select a column</option>
                    {ColumnIDs?.map((column, index) => (
                      <option key={column.ColumnID} value={column.ColumnID}>
                        {column.ColumnName}
                      </option>
                    ))}
                  </select>
                  {errors.ColumnID && (
                    <Error message={errors.ColumnID.message!} />
                  )}
                </div>
                <div className="p-4">
                  <label
                    htmlFor="Priority"
                    className="block text-left text-sm font-medium text-gray-700 dark:text-neutral-300">
                    Priority
                  </label>
                  <input
                    required
                    type="text"
                    id="Priority"
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:focus:ring-neutral-600"
                    {...register("Priority", {
                      required: {
                        value: true,
                        message: "Priority is required!",
                      },
                    })}
                  />
                  {errors.Priority && (
                    <Error message={errors.Priority.message!} />
                  )}
                </div>
              </div>
              <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t dark:border-neutral-700">
                <button
                  disabled={isLoading}
                  type="button"
                  className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                  data-hs-overlay="#create-card-modal">
                  Close
                </button>

                <button
                  disabled={isLoading}
                  type="submit"
                  className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                  {isLoading ? "Creating Card..." : "Create Card"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreateCardModal;
