import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/constant";
import { useDispatch } from "react-redux";

import { useOutsideClick } from "../../hooks/useOutsideClick";

const PostCommentPractice = ({ post, userInfo, postCss, hideComment }) => {

//   const post = [
//     {
//       _id: "6818b854bb1ca0e3771b7c13",
//       content:
//         "hey gang. unfortunately it's likely going to be a little while before the next video is out. this has been kind of a hectic month (my cat has been sick and i've had some car troubles) which hasn't left me with a ton of time and energy to work on video stuff. i'm also going away on a little trip to visit some family next month and obviously won't be able to work while i'm away, so the video will probably be out towards the end of may. in the meantime, i've just uploaded a new members only video where i rank neurodivergent characters, so you can check that out if you're already a member or want to join! thanks for reading and have a great day/night 🤗",
//       createdAt: "2025-05-05T13:08:36.890Z",
//       postOwner: {
//         _id: "67aba5c579eaabcadd9c12b3",
//         username: "dilip",
//         fullName: "Dilip Woad",
//         avatar:
//           "http://res.cloudinary.com/dvb5edx52/image/upload/v1739302337/dilip_pic_ox9fuv.jpg",
//       },
//     },
//     {
//       _id: "681771a4143cda4eb07e887e",
//       content: "new post here",
//       createdAt: "2025-05-04T13:54:44.456Z",
//       postOwner: {
//         _id: "67aba5c579eaabcadd9c12b3",
//         username: "dilip",
//         fullName: "Dilip Woad",
//         avatar:
//           "http://res.cloudinary.com/dvb5edx52/image/upload/v1739302337/dilip_pic_ox9fuv.jpg",
//       },
//     },
//     {
//       _id: "6812520436f9d9ca47067890",
//       content: "first post on my channel",
//       createdAt: "2025-04-30T16:38:28.679Z",
//       postOwner: {
//         _id: "67aba5c579eaabcadd9c12b3",
//         username: "dilip",
//         fullName: "Dilip Woad",
//         avatar:
//           "http://res.cloudinary.com/dvb5edx52/image/upload/v1739302337/dilip_pic_ox9fuv.jpg",
//       },
//     },
//   ];

  const [moreOption, setMoreOption] = useState(false);
  const [editComment, setEditComment] = useState(false);
  const [editedComment, setEditedComment] = useState(post.content);

  //post
  const {postOwner} = post;
//   const { avatar, username, _id } = userInfo;

//   const dispatch = useDispatch();

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
      }
    } catch (error) {
      console.log(
        "You don't have permission to delete other user comment!!",
        error
      );
    }
  };

  const handleEditPost = async (postId) => {
    try {
      if (
        postOwner._id  === userInfo._id
      ) {
        const res = await axios.patch(
          BASE_URL + `/post/${postId}`,
          {
            content: editedComment,
          },
          { withCredentials: true }
        );
        const updatedComment = res.data.data;
        // dispatch(updateUserComment(updatedComment));
      }
    } catch (error) {
      console.log(error);
    }
    setEditComment(false);
  };
  const handleEditCancel = () => {
    setEditedComment(post.content);
    setEditComment(false);
  };

  if (!post) return <div>Loading... wait</div>;

  return (
    <div
      key={post._id}
      className={` p-3 flex mb-7 rounded-xl border-2 ${postCss} bg-orange-400 pl-7 pr-7 `}
    >
      <div className=" mr-2 h-fit ">
        <img
          className="w-10 h-10 rounded-full object-cover"
          src={postOwner?.avatar}
          alt="avatar"
        />
      </div>
      <div className="w-full">
        <div className="flex  text-sm justify-between">
          <div className="flex space-x-2">
            <p className="font-bold ">{postOwner?.fullName}</p>
            <p>{createdAt}</p>
          </div>
          {editComment ? (
            <div className="w-full mx-4 flex">
              <input
                type="text"
                value={editedComment}
                onChange={(e) => setEditedComment(e.target.value)}
                className="flex-1 px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                  onClick={() => handleEditComment(post._id)}
                  className="bg-blue-500 px-2 py-1 rounded-l-full rounded-r-full"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div>{editedComment}</div>
          )}
          <div className="bg-yellow-300" ref={menuRef}>
            <p
              onClick={handleCommentOption}
              className="text-lg font-semibold hover:cursor-pointer rounded-full hover:bg-gray-200 w-7 h-7 text-center relative "
            >
              ⫶
            </p>
            {moreOption && (
              <div className="bg-lime-200 absolute p-3 z-50 rounded-lg hover cursor-pointer">
                <ul className="space-y-2">
                  {postOwner._id === userInfo?._id ? (
                    <>
                      <li
                        onClick={() =>
                          handleDeletePost(
                            post?._id,
                            postOwner._id
                          )
                        }
                        className="hover:bg-slate-300 p-1 rounded-lg"
                      >
                        🗑️ Delete
                      </li>
                      <li
                        onClick={() => setEditComment(true)}
                        className="hover:bg-slate-300 p-1 rounded-lg"
                      >
                        🖊 Edit
                      </li>
                    </>
                  ) : (
                    <li className="hover:bg-slate-300 p-1 rounded-lg">
                      🖊 Report
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
          <div className="mt-1 text-lg">{content}</div>
        <div className="flex space-x-5 mt-5 text-[15px] font-semibold">
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
    </div>
  );
};
export default PostCommentPractice;
