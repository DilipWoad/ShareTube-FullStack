import { useSearchParams } from "react-router";
import PostCard from "./PostCard";
import axios from "axios";
import { BASE_URL } from "../../utils/constant";
import { useEffect, useState } from "react";
import CommentCard from "../CommentComponents/CommentCard";
import { useSelector } from "react-redux";

const PostComments=()=>{
    const [searchParams,setSearchParams] = useSearchParams();
    const [postComment,setPostComment] = useState(null);
    const user = useSelector((store)=>store.user)

    const postId = searchParams.get('id')

    const postComments = async()=>{
        try {
           const res = await axios.get(`${BASE_URL}/comment/post/${postId}`,{withCredentials:true});
           const comment = res.data;
           console.log(comment.data);
           setPostComment(comment.data);
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(()=>{
        postComments();
    },[])
    if(!postComment) return <div>Loading... comments!!</div>
    return(
        <div>
            Post with Comments here!!{" id " + postId}
            {/* <PostCard/> */}
           {postComment.map((comment)=>(
            <CommentCard comment={comment} key={comment._id} usersComment={user} commentCss={"w-[600px]"}/>
           ))}
        </div>
    )
}

export default PostComments;