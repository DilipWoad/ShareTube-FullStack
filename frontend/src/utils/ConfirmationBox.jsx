import axios from "axios";
import { BASE_URL } from "./constant";

const ConfirmationBox = ({ toggle, setToggle, id,setShowBox }) => {
  const handleYesClick = async () => {
    try {
      const res = await axios.patch(
        `${BASE_URL}/video/togglePublished/${id}`,
        {},
        { withCredentials: true }
      );

      console.log(res.data);
      setToggle(!toggle);
      setShowBox(false)
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 ">
      <div className="bg-slate-400  w-72 flex flex-col p-3 shadow-lg rounded-lg">
        <div className="text-center py-4 text-lg">
          {!toggle ? (
            <p>Do You Want to Published a Video?</p>
          ) : (
            <p>Do You Want to Unpublished a Video?</p>
          )}
        </div>
        <div className="flex justify-around mt-4">
          <button
            onClick={() => setShowBox(false)}
            className="bg-gray-500 text-sm font-medium text-white py-2 px-5 rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleYesClick}
            className="bg-white py-2 px-5 rounded-lg text-sm font-bold hover:bg-gray-200"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationBox;
