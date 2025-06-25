import axios from "axios";
import { useState } from "react"
import { BASE_URL } from "../../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { addNewComment } from "../../slices/commentSlice";

const UserCommentBox=({postId ,userCommentCss})=>{
    // const postId = '67c5a41d8b43dd5470327f1a';
    const [userComment,setUserComment] = useState("");
    const [loading,setLoading] = useState(false);
    const user = useSelector((store)=>store.user);
    const dispatch = useDispatch();

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
            // setNewPostComment([postCommentWithAllFields,...newPostComment]);
            dispatch(addNewComment(postCommentWithAllFields));
            setUserComment("")
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
        
    }

    return(
        <div className={`flex flex-wrap  items-center sm:mr-8 p-2 rounded-lg ${userCommentCss}`}>
          {/* avatar */}
          <div className="">
            <img
              className="w-10 h-10 rounded-full"
              src={user.avatar}
              alt="user-icon"
            />
          </div>

          
           <input
              type="text"
              value={userComment}
              onChange={(e) => setUserComment(e.target.value)}
              className="px-2 py-1 flex-1 sm:rounded-lg rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mx-2"
              placeholder="Add a Comment..."
            />

          {/* input+Cancel+Comment Btn */}
          <div className=" sm:flex-2 space-x-2 flex w-full sm:w-fit  justify-end text-sm font-medium my-1 mr-2 text-gray-900">
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
                    ? "bg-blue-500 text-white"
                    : "bg-blue-300 cursor-not-allowed"
                }`}
              >
                {loading ? "Posting..." : "Comment"}
              </button>
            </div>
          {/* <div className="w-full mx-4 flex">
            
          </div> */}
        </div>
    )
}

export default UserCommentBox;