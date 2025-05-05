import axios from "axios";
import { useState } from "react"
import { BASE_URL } from "../../utils/constant";
import { useSelector } from "react-redux";

const UserCommentBox=({postId ,userCommentCss,setNewPostComment,newPostComment})=>{
    // const postId = '67c5a41d8b43dd5470327f1a';
    const [userComment,setUserComment] = useState("");
    const [loading,setLoading] = useState(false);
    const user = useSelector((store)=>store.user);

    const owner = {
      avatar:user.avatar,
      fullName:user.fullName,
      _id:user._id,
      username:user.username
    }
    const addUserComment=async()=>{
        try {
            setLoading(true);
            const res =await axios.post(`${BASE_URL}/comment/post/${postId}`,{
                content:userComment
            },{withCredentials:true})

            console.log("comment",res.data.data)
            const postComment = res.data.data;
            const postCommentWithAllFields={
              ...postComment,
              commentOwner:owner
            }
            console.log(postCommentWithAllFields)
            setNewPostComment([postCommentWithAllFields,...newPostComment]);
            setUserComment("")
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
        
    }

    return(
        <div className={`flex items-center bg-yellow-300 mr-8 p-2 rounded-lg ${userCommentCss}`}>
          <div>
            <img
              className="w-10 h-10 rounded-full"
              src={user.avatar}
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
              <button
                onClick={() => setUserComment("")}
                className="bg-white px-2 py-1 rounded-full"
              >
                Cancel
              </button>
              <button
                onClick={addUserComment}
                disabled={!userComment.trim() && true}
                className={`px-2 py-1 rounded-full ${
                  userComment.trim()
                    ? "bg-blue-500"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                {loading ? "Posting..." : "Comment"}
              </button>
            </div>
          </div>
        </div>
    )
}

export default UserCommentBox;