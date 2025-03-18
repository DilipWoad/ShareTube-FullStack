import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constant";
import CommentCard from "./CommentCard";
import { useDispatch, useSelector } from "react-redux";
import { addNewComment, addVideoComments } from "../slices/commentSlice";

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
      const res = await axios.post(
        BASE_URL + `/comment/${videoId}`,
        {
          content: userComment,
        },
        { withCredentials: true }
      );
      const newComment = res.data.data;
      dispatch(addNewComment(newComment));
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
      const res = await axios.get(BASE_URL + `/comment/${videoId}`, {
        withCredentials: true,
      });
      const array = res.data.data;
      dispatch(addVideoComments(array));
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError("Failed to load comments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVideoComments();
  }, [videoId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  return (
    <div>
      <p className="text-xl mt-5 px-2 font-bold">
        {videoComments?.length || 0} Comments
      </p>

      <div className="flex space-x-2 p-2">
        <div className="flex items-center bg-yellow-300 w-full mr-8 p-2 rounded-lg">
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
