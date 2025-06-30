import { useState } from "react";
import ToggleButton from "../../utils/ToggleButton";
import ConfirmationBox from "../../utils/ConfirmationBox";
import { useDispatch } from "react-redux";

const StudioVideoCard = ({ channelVideos, setSelectedId, selectedId }) => {
  const { thumbnail, views, title, _id, isPublished } = channelVideos;
  const [toggle, setToggle] = useState(isPublished);
  const [showBox, setShowBox] = useState(false);

  const handleCheckbox = (id) => {
    setSelectedId((arrayOfIds) => {
      if (arrayOfIds.includes(id)) {
        return arrayOfIds.filter((Id) => Id !== id);
      } else {
        return [...arrayOfIds, id];
      }
    });
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 border-y border-gray-300 dark:border-gray-700 sm:py-4 sm:px-3 py-2 rounded-lg shadow-sm mb-2">
      <div className="flex flex-row items-center justify-between sm:gap-4">
        {/* Left Side: Checkbox + Thumbnail + Title */}
        <div className="flex sm:items-center sm:gap-4 flex-1 ml-4 ">
          <input
            type="checkbox"
            checked={selectedId.includes(_id)}
            onChange={() => handleCheckbox(_id)}
            className={`${
              selectedId.length == 1 ? "accent-blue-500" : "accent-red-500"
            } sm:h-5 sm:w-5`}
          />
          <img
            src={thumbnail}
            alt="thumbnail"
            className="h-14 w-24 sm:h-20 sm:w-32 rounded-md object-cover shadow-sm sm:ml-14 ml-4"
          />
          <div className="text-gray-800 dark:text-gray-100 sm:text-lg text-sm font-medium truncate text-wrap  max-w-[250px] sm:max-w-[400px]">
            {title}
          </div>
        </div>

        {/* Right Side: Views + Extra Checkbox */}
        <div className="flex items-center">
          <div className="text-gray-600 dark:text-gray-300 text-sm sm:text-base whitespace-nowrap sm:mr-16 mr-11">
            {views}
          </div>

          <div className="">
            <ToggleButton toggle={toggle} setShowBox={setShowBox} />
          </div>
        </div>
        {showBox && (
          <ConfirmationBox
            toggle={toggle}
            setShowBox={setShowBox}
            setToggle={setToggle}
            id={_id}
          />
        )}
      </div>
    </div>
  );
};

export default StudioVideoCard;
