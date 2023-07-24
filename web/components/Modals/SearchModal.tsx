"use client";

import React from "react";
import SearchCom from "../SearchCom";
import ReactDOM from "react-dom";

interface Props {
  onClose: () => void;
  searchQuery: string;
}

const SearchModal: React.FC<Props> = ({ onClose, searchQuery }) => {
  const modalRoot = document.getElementById("modal-root") as Element;
  const [query, setQuery] = React.useState<string>(searchQuery);

  if (modalRoot) {
    return ReactDOM.createPortal(
      <>
        <div
          data-te-modal-init
          className="fixed left-0 top-0 z-[1055] h-full w-full overflow-y-auto overflow-x-hidden outline-none"
          id="exampleModalScrollable"
          tabIndex={-1}
          aria-labelledby="exampleModalScrollableLabel"
          aria-hidden="true"
        >
          <div
            data-te-modal-dialog-ref
            className="pointer-events-none relative h-[calc(100%-1rem)] w-auto transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:h-[calc(100%-3.5rem)] min-[576px]:max-w-[500px]"
          >
            <div className="pointer-events-auto relative flex max-h-[100%] w-full flex-col overflow-hidden rounded-md border-none bg-white bg-clip-padding text-current shadow-lg outline-none ">
              <div className="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4 ">
                <h5 className="text-base text-slate-500" id="exampleModalLabel">
                  Search...
                </h5>
                <button
                  type="button"
                  className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                  data-te-modal-dismiss
                  aria-label="Close"
                  onClick={onClose}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="relative overflow-y-auto p-4 max-sm:min-h-screen min-h-[700px]">
                <div className="relative rounded-md w-full">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 text-slate-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="query"
                    id="quey"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className="block w-full outline-none rounded-md border-0 py-3 pl-10 pr-20 text-gray-900  placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    placeholder="Search..."
                  />
                </div>
                {query.length > 3 ? (
                  <SearchCom query={query} />
                ) : (
                  <div className="flex flex-col items-center min-h-[465px] justify-center">
                    <span className="text-base text-slate-400">
                      Type in to search for results...
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
      </>,
      modalRoot
    );
  }
};

export default SearchModal;
