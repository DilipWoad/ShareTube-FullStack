import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../utils/constant";

import { Link, useNavigate } from "react-router";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { useDispatch } from "react-redux";
import { removeUserPost, updateUserPost } from "../../slices/postSlice";

const PostCard = ({ post, postCss, hideComment, userInfo }) => {
  const [isPostLiked, setIsPostLiked] = useState(false);
  const { content, createdAt, postOwner, _id } = post;
  const navigate = useNavigate();

  const handlePostLike = async () => {
    //when clicked change the given state
    try {
      const res = await axios.post(
        `${BASE_URL}/like/p/${_id}`,
        {},
        { withCredentials: true }
      );
      console.log(res.data);
      setIsPostLiked(!isPostLiked);
    } catch (error) {
      console.log(error);
    }
  };

  const isUserLikedThePost = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/like/p/${_id}`, {
        withCredentials: true,
      });
      console.log(res.data.data);
      const likedStatus = res.data.data;
      setIsPostLiked(likedStatus);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePostCommentClick = (postId) => {
    navigate(`/channel/${postOwner._id}/post?id=${postId}`);
  };

  const [moreOption, setMoreOption] = useState(false);
  const [editPost, setEditPost] = useState(false);

  const [editedPost, setEditedPost] = useState(post.content);

  //post
  // const {postOwner} = post;
  //   const { avatar, username, _id } = userInfo;

  //   const dispatch = useDispatch();
  const dispatch = useDispatch();

  const menuRef = useOutsideClick(setMoreOption);

  const handleCommentOption = () => {
    setMoreOption(!moreOption);
  };

  const handleDeletePost = async (postId, postOwnerId) => {
    try {
      if (postOwnerId === userInfo._id) {
        await axios.delete(BASE_URL + `/post/${postId}`, {
          withCredentials: true,
        });
        // dispatch(removeUserComment(commentId));
        dispatch(removeUserPost(postId));
      }
    } catch (error) {
      console.log(
        "You don't have permission to delete other user Posts!!",
        error
      );
    }
  };

  const handleEditPost = async (postId) => {
    try {
      if (postOwner._id === userInfo._id) {
        const res = await axios.patch(
          BASE_URL + `/post/${postId}`,
          {
            content: editedPost,
          },
          { withCredentials: true }
        );
        const updatedComment = res.data.data;
        // dispatch(updateUserComment(updatedComment));
        dispatch(updateUserPost({ ...updatedComment, postOwner }));
        setEditPost(false);
      }
    } catch (error) {
      console.log(error);
    }
    setEditPost(false);
  };
  const handleEditCancel = () => {
    setEditedPost(post.content);
    setEditPost(false);
  };
  useEffect(() => {
    isUserLikedThePost();
  }, []);

  if (!post) return <div>Loading... wait</div>;

  return (
    <div
      key={post._id}
      className={` sm:p-3 px-2 py-1 flex mb-7 sm:rounded-xl rounded-lg border-2 ${postCss} bg-gray-400 sm:px-7 `}
    >
      <div className="mr-2 h-fit bg-purple-500 ">
        <img
          className="w-10 h-10 rounded-full object-cover"
          src={postOwner?.avatar}
          alt="avatar"
        />
      </div>

      <div className="flex-1">
        <div className="flex  text-sm justify-between items-center ">
          <div className="flex gap-2">
            <p className="font-bold ">{postOwner?.fullName}</p>
            <p>{createdAt}</p>
          </div>

          <div className="relative" ref={menuRef}>
            <p
              onClick={handleCommentOption}
              className="text-lg font-semibold hover:cursor-pointer rounded-full hover:bg-gray-200 w-7 h-7 text-center "
            >
              ⫶
            </p>
            {moreOption && (
              <div className="bg-slate-900 absolute z-50 rounded-lg hover:cursor-pointer top-5 right-5">
                <ul className="text-nowrap sm:w-24 mx-2 sm:my-2 sm:mx-0 my-1 text-sm text-white sm:space-y-3 space-y-1">
                  {postOwner._id === userInfo?._id ? (
                    <>
                      <li
                        onClick={() =>
                          handleDeletePost(post?._id, postOwner._id)
                        }
                        className="hover:bg-slate-400 py-1 "
                      >
                        🗑️ Delete
                      </li>
                      <li
                        onClick={() => setEditPost(true)}
                        className="hover:bg-slate-400 py-1"
                      >
                        🖊 Edit
                      </li>
                    </>
                  ) : (
                    <li className="hover:bg-slate-300 py-1">
                      🖊 Report
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
        {editPost ? (
          <div className="w-full mt-1 flex">
            <input
              type="text"
              value={editedPost}
              onChange={(e) => setEditedPost(e.target.value)}
              className="flex-1 px-1 text-lg rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex flex-2 ml-2 space-x-2">
              {/*  //TODO:Show cancel when input box is focus and Save the input focus to a state, and make a state to store comment value and when clicked on cancel it should make the state to "empty" and focus as false  */}
              <button
                onClick={handleEditCancel}
                className="bg-white px-2 py-1 rounded-l-full rounded-r-full"
              >
                Cancel
              </button>
              <button
                onClick={() => handleEditPost(post._id)}
                className="bg-blue-500 px-2 py-1 rounded-l-full rounded-r-full"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          // <div>{editedPost}</div>
          <div className="mt-1 sm:text-lg">{content}</div>
        )}

        <div className="flex space-x-5 sm:mt-5 mt-2 text-[15px] font-semibold">
          <button
            onClick={handlePostLike}
            className={`hover:bg-gray-300 rounded-full text-3xl ${
              isPostLiked ? "bg-red-500 hover:bg-red-300" : ""
            } h-7 w-7 flex items-center justify-center overflow-clip`}
          >
            <span
              className={`${
                isPostLiked ? " text-white hover:text-black " : ""
              }`}
            >
              ♡
            </span>
          </button>
          {!hideComment && (
            <button
              className="text-lg hover:bg-gray-200 rounded-full w-7 h-7"
              onClick={() => handlePostCommentClick(_id)}
            >
              💬
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
