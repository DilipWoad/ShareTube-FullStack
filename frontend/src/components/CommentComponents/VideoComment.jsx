import axiosInstance from "../../api/axiosInstance.js";
import { useEffect, useState } from "react";
import CommentCard from "./CommentCard";
import { useDispatch, useSelector } from "react-redux";
import { addNewComment, addComments } from "../../slices/commentSlice";
import LoadingScreen from "../../utils/LoadingScreen";

const VideoComment = ({ videoId }) => {
  // const [videoComments, setVideoComments] = useState(null);
  const [userComment, setUserComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const videoComments = useSelector((store) => store.comment);
  const user = useSelector((store) => store.user);

  const dispatch = useDispatch();

  const addUserComment = async () => {
    if (!userComment.trim()) return;
    try {
      setLoading(true);
      const res = await axiosInstance.post(
        `/comment/${videoId}`,
        {
          content: userComment,
        },
        { withCredentials: true }
      );
      const newComment = res.data.data;
      const videoCommentWithAllFields = {
        ...newComment,
        isLikedByCurrentUser: false,
        likeCount:0
      };
      dispatch(addNewComment(videoCommentWithAllFields));
      setUserComment("");
    } catch (error) {
      console.error("Failed to post comment:", error);
      setError("Failed to post comment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getVideoComments = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/comment/${videoId}`, {
        withCredentials: true,
      });
      const comment = res.data.data;
      console.log(comment)
      dispatch(addComments(comment));
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError("Failed to load comments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    !videoComments && getVideoComments();
  }, [videoId]);

  if (loading) return <LoadingScreen />;
  if (error) return <div className="text-red-500">{error}</div>;
  return (
    <div className="bg-gray-700 rounded-xl pb-2 px-2">
      {/* no of comments */}
      <p className="text-xl mt-5 px-2 font-bold">
        {videoComments?.length || 0} Comments
      </p>

      {/* flex space-x-2 p-2 */}
      <div className="flex flex-wrap sm:flex-nowrap items-center w-full  justify-between mr-8 p-2 rounded-lg">
        {/* avatar img */}
        <div>
          <img
            className="w-10 h-10 rounded-full object-cover"
            src={user.avatar}
            alt="user-icon"
          />
        </div>

        {/* Input-box */}
        <div className=" flex-1 sm:mx-4 mx-2">
          {/* Input-box */}
          <input
            type="text"
            value={userComment}
            onChange={(e) => setUserComment(e.target.value)}
            className="py-1 px-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Add a Comment..."
          />
        </div>

        {/* Sve Btn div */}
        <div className="flex w-full sm:w-fit justify-end mt-1 sm:mt-0 mr-2 ">
          {/* Cancel-Comment btn */}
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

      {/* Display comment */}
      <div>
        {videoComments &&
          videoComments.map((comment) => (
            <CommentCard
              key={comment._id}
              comment={comment}
              usersComment={user}
            />
          ))}
      </div>
    </div>
  );
};

export default VideoComment;
