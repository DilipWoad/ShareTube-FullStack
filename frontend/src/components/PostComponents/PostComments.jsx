import { useSearchParams } from "react-router";
import PostCard from "./PostCard";
import axios from "axios";
import { BASE_URL } from "../../utils/constant";
import { use, useEffect, useState } from "react";
import CommentCard from "../CommentComponents/CommentCard";
import { useDispatch, useSelector } from "react-redux";
import UserCommentBox from "../CommentComponents/UserCommentBox";
import { addComments } from "../../slices/commentSlice";

const PostComments = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  // const [postComment, setPostComment] = useState(null);
  const [aPost, setAPost] = useState(null);
  const dispatch = useDispatch();
  const postComment = useSelector((store)=>store.comment);

  // const [currentComment, setCurrentComment] = useState([]);

  const user = useSelector((store) => store.user);

  const postId = searchParams.get("id");

  const postComments = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/comment/post/${postId}`, {
        withCredentials: true,
      });
      const comment = res.data;
      console.log(comment.data);
      dispatch(addComments(comment.data))
      // setPostComment(comment.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getAPost = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/post/${postId}`, {
        withCredentials: true,
      });
      console.log(res.data.data);
      setAPost(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAPost();
    postComments();
  }, []);
  if (!aPost) return <div>Loading Post...!!</div>;

  return (
    <div className="m-2 flex items-center justify-center w-full">
      <div className=" bg-gray-500 pl-6 py-6 my-5 rounded-2xl">
        <PostCard
          post={aPost}
          postCss={"w-[800px] m-2 bg-gray-600"}
          hideComment={true}
        />
        <UserCommentBox
          postId={postId}
          userCommentCss={"mx-2 min-w-[800px]"}
        />
        {postComment &&
          postComment.map((comment) => (
            <CommentCard
              comment={comment}
              key={comment._id}
              usersComment={user}
              commentCss={"w-[800px]"}
            />
          ))}
      </div>
    </div>
  );
};

export default PostComments;
