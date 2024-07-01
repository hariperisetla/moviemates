import { IoIosHeart } from "react-icons/io";
import { IoBookmark, IoCheckmarkCircle, IoPeople } from "react-icons/io5";

export default function BottomSheet({
  bottomSheet,
  setBottomSheet,
  statusFlag,
  setStatusFlag,
}) {
  return (
    <div>
      <div
        className={`${
          bottomSheet ? "opacity-100" : "hidden"
        } fixed inset-0 z-30 transition-all ease-in-out duration-300`}
      >
        <div
          className="bg-black/50 h-screen w-full z-20 absolute"
          onClick={() => {
            setBottomSheet(!bottomSheet);
            setStatusFlag(!statusFlag);
          }}
        ></div>
      </div>
      <div className="relative">
        <div
          className={`${
            bottomSheet ? "bottom-0" : "-bottom-[60rem]"
          } z-30 left-0 space-y-5 rounded-t-2xl bg-white px-5 transition-all duration-300 ease-in-out w-full py-8 fixed`}
        >
          {statusFlag === "status" ? (
            <div className="space-y-1">
              <h3 className="text-xl font-semibold text-primary">Status </h3>
              <p>Update your movie status</p>
            </div>
          ) : (
            <div className="space-y-1">
              <h3 className="text-xl font-semibold text-primary">
                Tell A Mate
              </h3>
              <p>Create a list to share it to your mate</p>
            </div>
          )}

          {statusFlag === "status" ? (
            <div className="space-y-3">
              <p className="py-2 border rounded-xl justify-center flex border-primary">
                <IoPeople className="text-xl text-primary" />
                Tell A Mate
              </p>

              <p className="py-2 border rounded-xl justify-center flex border-blue-500">
                <IoBookmark className="text-xl text-blue-500" />
                Add to Watchlist
              </p>
              <p className="py-2 border rounded-xl justify-center flex items-center gap-1 border-green-500/75">
                <IoCheckmarkCircle />
                Mark as Watched
              </p>
              <p className="py-2 border rounded-xl justify-center flex items-center gap-1 border-red-500/75">
                <IoIosHeart className="text-xl text-red-500" />
                Add to Favorites
              </p>

              <button className="flex w-full bg-primary py-3 items-center font-semibold text-secondary rounded-2xl justify-center">
                Update Status
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-col space-y-1">
                <label htmlFor="">Name</label>
                <input
                  type="text"
                  className="border border-gray rounded-xl outline-none px-2 py-1"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label htmlFor="">Description</label>
                <textarea
                  type="text"
                  className="border border-gray rounded-xl outline-none px-2 py-1"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label htmlFor="">Privacy</label>
                <select
                  name="privacy"
                  id="privacy"
                  className="capitalize border bg-white border-gray rounded-xl outline-none px-2 py-2"
                >
                  <option value="friends">friends</option>
                  <option value="private">private</option>
                  <option value="public">public</option>
                </select>
              </div>

              <button className="flex w-full bg-primary py-3 items-center font-semibold text-secondary rounded-2xl justify-center">
                Create List
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
