import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { useDispatch } from "react-redux";
import { removeUserComment, updateUserComment } from "../slices/commentSlice";

const CommentCard = ({ comment, usersComment }) => {
  const [moreOption, setMoreOption] = useState(false);
  const [editComment, setEditComment] = useState(false);
  const [editedComment, setEditedComment] = useState(comment.content);

  const { commentOwner, content } = comment;
  const { avatar, username, _id } = usersComment;

  const dispatch = useDispatch();

  const menuRef = useRef(null);

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
      if ((commentOwner? commentOwner._id : comment.owner) === usersComment._id) {
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

  if (!comment) return <div>Loading... wait</div>;

  //for outsideClicked
  useEffect(() => {
    if (!setMoreOption) return;
    const handleClickOutside = (e) => {
      if (menuRef?.current && !menuRef.current.contains(e.target)) {
        //menuRef.current has the object of the ref component (... wala div)
        //and this e will the place(div) we my mouse will be clicked
        //so we are checking if the "e" attributes is present in the menuRef
        //if present that means it is clicked on the MenuOption
        //but we need false (this will be true if the attributes of menuRef and e.target does not match)
        setMoreOption(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => (
      document.removeEventListener("mousedown", handleClickOutside)
    );
  }, []);

  return (
    <div className="p-2 flex bg-slate-300 my-2 ml-2 mr-7 max-w-[800px] rounded-lg z-0">
      <div className="">
        <img
          className="w-10 h-10 rounded-full"
          src={commentOwner ? commentOwner.avatar : avatar}
          alt="avatar"
        />
      </div>
      <div className="bg-slate-300 mx-2 flex items-center justify-between w-full rounded-lg">
        <div>
          <div className="font-semibold">
            @{commentOwner ? commentOwner?.username : username}
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
                  onClick={() => handleEditComment(comment._id)}
                  className="bg-blue-500 px-2 py-1 rounded-l-full rounded-r-full"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div>{editedComment}</div>
          )}
        </div>
        <div className="bg-yellow-300" ref={menuRef}>
          <div
            onClick={handleCommentOption}
            // onBlur={handleCommentOption}
            className="w-fit p-2 rounded-full hover:cursor-pointer hover:bg-white transition relative "
          >
            ⫶
          </div>
          {moreOption && (
            <div className="bg-lime-200 absolute p-3 z-50 rounded-lg hover cursor-pointer">
              <ul className="space-y-2">
                {(commentOwner ? commentOwner._id : _id) ===
                usersComment?._id ? (
                  <>
                    <li
                      onClick={() =>
                        handleDeleteComment(comment?._id, commentOwner? commentOwner._id:comment.owner)
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
      </div>
    </div>
  );
};
export default CommentCard;
