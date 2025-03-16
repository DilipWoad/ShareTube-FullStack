import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constant";
import CommentCard from "./CommentCard";

const VideoComment = ({ videoId, avatar }) => {
  const [videoComments, setVideoComments] = useState(null);
  const [userComment, setUserComment] = useState("");

  const addUserComment = async()=>{
    try {
        const res = await axios.post(BASE_URL+`/comment/${videoId}`,{
            content:userComment
        },{withCredentials:true})
        console.log(res.data);
    } catch (error) {
        console.log(error);
    }
    setUserComment("")
    //use Slice to update the count and add values to the state
  }

  const getVideoComments = async () => {
    const res = await axios.get(BASE_URL + `/comment/${videoId}`, {
      withCredentials: true,
    });
    console.log(res.data);
    setVideoComments(res.data.data);
  };
  useEffect(() => {
    getVideoComments();
  }, [videoId]);
  if(!videoComments) return <div>Loading...</div>
  return (
    <div>
      <div ><p className="text-xl mt-5 px-2 font-bold">{videoComments?.length} Comments</p> </div>
      <div className="flex space-x-2 p-2">
        <div className="flex items-center bg-yellow-300 w-full mr-8 p-2 rounded-lg">
          <div>
            <img
              className="w-10 h-10 rounded-full"
              src={avatar}
              alt="user-icon"
            />
          </div>
          <div className="w-full mx-4 flex">
            <input
              type="text"
              value={userComment}
              onChange={(e) => setUserComment(e.target.value)}
              className="flex-1 px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Add a Comment..."
            />
            <div className="flex flex-2 ml-2 space-x-2">
              {/*  //TODO:Show cancel when input box is focus and Save the input focus to a state, and make a state to store comment value and when clicked on cancel it should make the state to "empty" and focus as false  */}
              <button onClick={()=>setUserComment("")} className="bg-white px-2 py-1 rounded-l-full rounded-r-full">Cancel</button>
              <button onClick={addUserComment} className="bg-blue-500 px-2 py-1 rounded-l-full rounded-r-full">
                Comment
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div>
          {videoComments &&
            videoComments.map((comment) => (
              <CommentCard key={comment._id} comment={comment} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default VideoComment;
