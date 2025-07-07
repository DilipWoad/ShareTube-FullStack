import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/constant";
import { useDispatch } from "react-redux";
import {
  removeUserComment,
  updateUserComment,
} from "../../slices/commentSlice";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import LikeSvgIcon from "../../utils/SVGIcons/LikeSvgIcon";

const CommentCard = ({ comment, usersComment, commentCss }) => {
  const [moreOption, setMoreOption] = useState(false);
  const [editComment, setEditComment] = useState(false);
  const [editedComment, setEditedComment] = useState(comment.content);

  const { commentOwner, content } = comment;
  const { avatar, username, _id } = usersComment;

  const dispatch = useDispatch();

  const menuRef = useOutsideClick(setMoreOption);

  const handleCommentOption = () => {
    setMoreOption(!moreOption);
  };

  const handleDeleteComment = async (commentId, commentOwnerId) => {
    try {
      if (commentOwnerId === usersComment._id) {
        await axios.delete(BASE_URL + `/comment/c/${commentId}`, {
          withCredentials: true,
        });
        dispatch(removeUserComment(commentId));
      }
    } catch (error) {
      console.log(
        "You don't have permission to delete other user comment!!",
        error
      );
    }
  };

  const handleEditComment = async (commentId) => {
    try {
      if (
        (commentOwner ? commentOwner._id : comment.owner) === usersComment._id
      ) {
        const res = await axios.patch(
          BASE_URL + `/comment/c/${commentId}`,
          {
            content: editedComment,
          },
          { withCredentials: true }
        );
        const updatedComment = res.data.data;
        dispatch(updateUserComment(updatedComment));
      }
    } catch (error) {
      console.log(error);
    }
    setEditComment(false);
  };
  const handleEditCancel = () => {
    setEditedComment(comment.content);
    setEditComment(false);
  };

  const handleEditClick = () => {
    setEditComment(true);
    setMoreOption(false);
  };

  if (!comment) return <div>Loading... wait</div>

  return (
    <div
      className={`sm:p-4 py-2 flex bg-slate-500 hover:shadow-lg mt-4 sm:ml-2 sm:mr-7 sm:max-w-[800px] rounded-lg z-0 ${commentCss}`}
    >
      <div className="w-14 flex justify-center sm:w-auto ">
        <img
          className="w-10 h-10 rounded-full object-cover"
          src={commentOwner ? commentOwner.avatar : avatar}
          alt="avatar"
        />
      </div>
      <div className="bg-slate-300  mx-2 flex items-center justify-between w-full rounded-lg sm:px-2">
        <div className=" w-full">
          <div className="font-semibold mb-2">
            @{commentOwner ? commentOwner?.username : username}
          </div>
          {editComment ? (
            <div className="flex flex-wrap sm:flex-nowrap sm:w-[400px] md:w-[600px] sm:mb-2  justify-end gap-1">
              <input
                type="text"
                value={editedComment}
                onChange={(e) => setEditedComment(e.target.value)}
                className="w-full sm:flex-1 py-1 px-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 "
              />
              <div className=" sm:flex  space-x-2 text-sm sm:text-[16px]">
                {/*  //TODO:Show cancel when input box is focus and Save the input focus to a state, and make a state to store comment value and when clicked on cancel it should make the state to "empty" and focus as false  */}
                <button
                  onClick={handleEditCancel}
                  className="bg-white px-2 py-1 rounded-full"
                >
                  Cancel
                </button>
                <button
                  disabled={editedComment.trim() === ""}
                  onClick={() => handleEditComment(comment._id)}
                  className={`bg-blue-500 px-2 py-1 rounded-full 
                    ${
                      editedComment.trim() === ""
                        ? "hover:cursor-not-allowed bg-blue-400 text-gray-500"
                        : "bg-blue-600 hover:bg-blue-700 transition-all duration-200 text-white"
                    }`}
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-2 ml-2 ">{editedComment}</div>
          )}
          <div className="m-1 hover:cursor-pointer">
           <LikeSvgIcon/>
          </div>
        </div>
        <div className="font-bold relative" ref={menuRef}>
          <div
            onClick={handleCommentOption}
            // onBlur={handleCommentOption}
            className="w-fit p-2 rounded-full hover:cursor-pointer hover:bg-white transition "
          >
            ⫶
          </div>
          {moreOption && (
            <div className="bg-slate-600 absolute top-5 right-6 opacity-90 z-50 rounded-lg hover cursor-pointer">
              <ul className="flex-col items-center  w-20 m-2 space-y-2">
                {(commentOwner ? commentOwner._id : _id) ===
                usersComment?._id ? (
                  <>
                    <li
                      onClick={() =>
                        handleDeleteComment(
                          comment?._id,
                          commentOwner ? commentOwner._id : comment.owner
                        )
                      }
                      className="hover:bg-slate-300 p-1  rounded-lg text-sm font-medium"
                    >
                      🗑️ Delete
                    </li>
                    <li
                      onClick={handleEditClick}
                      className="hover:bg-slate-300 p-1 rounded-lg text-sm font-medium  "
                    >
                      🖊 Edit
                    </li>
                  </>
                ) : (
                  <li className="hover:bg-slate-300 p-1 rounded-lg text-sm font-medium ">
                    🖊 Report
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default CommentCard;
