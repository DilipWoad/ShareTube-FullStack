import { useState } from "react";

const StudioVideoCard = ({ channelVideos ,setSelectedId,selectedId}) => {
  const { thumbnail, views, title, _id } = channelVideos;
 
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
    <div className="bg-gray-500 h-28 border-y-[1px] items-center flex rounded-lg">
      <div className="bg-gray-400 h-24 w-full flex items-center px-2">
        <input
          className="mx-2"
          type="checkbox"
          checked={selectedId.includes(_id)}
          onChange={() => handleCheckbox(_id)}
        />
        <div className="flex bg-lime-300 w-[700px]">
          <div className="mr-4">
            <img
              className="h-20 w-32 rounded-lg"
              src={thumbnail}
              alt="thumbnail"
            />
          </div>
          <div className="text-lg font-semibold">{title}</div>
        </div>
        <div className="mx-3 flex items-center justify-center w-20">
          {views} views
        </div>

        <div className="flex items-center justify-center ">
          <input className="" type="checkbox" />
        </div>
      </div>
    </div>
  );
};

export default StudioVideoCard;
