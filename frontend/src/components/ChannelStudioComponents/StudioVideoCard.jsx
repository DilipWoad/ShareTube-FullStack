import { useState } from "react";
import ToggleButton from "../../utils/ToggleButton";
import ConfirmationBox from "../../utils/ConfirmationBox";
import { useDispatch } from "react-redux";

const StudioVideoCard = ({ channelVideos ,setSelectedId,selectedId}) => {
  const { thumbnail, views, title, _id ,isPublished} = channelVideos;
    const [toggle,setToggle] = useState(isPublished);
    const [showBox,setShowBox] = useState(false);

  const handleCheckbox=(id)=>{
    setSelectedId((arrayOfIds)=>{
      if(arrayOfIds.includes(id)){
        return arrayOfIds.filter((Id)=> Id!==id)
      }else{
        return [...arrayOfIds,id]
      }
    })
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-800 border-y border-gray-300 dark:border-gray-700 py-4 px-3 rounded-lg shadow-sm mb-2">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    {/* Left Side: Checkbox + Thumbnail + Title */}
    <div className="flex items-center gap-4 flex-1 ">
      <input
        type="checkbox"
        checked={selectedId.includes(_id)}
        onChange={() => handleCheckbox(_id)}
        className={`${selectedId.length==1 ? "accent-blue-500": "accent-red-500"} h-5 w-5`}
      />
      <img
        src={thumbnail}
        alt="thumbnail"
        className="h-20 w-32 rounded-md object-cover shadow-sm ml-14"
      />
      <div className="text-gray-800 dark:text-gray-100 text-lg font-medium truncate max-w-[250px] sm:max-w-[400px]">
        {title}
      </div>
    </div>

    {/* Right Side: Views + Extra Checkbox */}
    <div className="flex items-center ">
      <div className="text-gray-600 dark:text-gray-300 text-sm sm:text-base whitespace-nowrap mr-16">
        {views} views
      </div>
      
      <div>
        <ToggleButton  toggle={toggle} setShowBox={setShowBox}/>
      </div>
    </div>
    {showBox && <ConfirmationBox toggle={toggle} setShowBox={setShowBox} setToggle={setToggle} id={_id}/>}
  </div>
</div>
  );
};

export default StudioVideoCard;
