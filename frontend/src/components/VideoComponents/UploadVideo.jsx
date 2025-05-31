import axios from "axios";
import { useState,useNavigate } from "react";
import { BASE_URL } from "../../utils/constant";


const UploadVideo = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleVideoFile=(e)=>{
    if(e.target.files){
        console.log(e.target.files);
        setVideoFile(e.target.files[0])
    }
  }
  const handleThumbnailFile=(e)=>{
    if(e.target.files){
        console.log(e.target.files);
        setThumbnail(e.target.files[0])
    }
  }

  const handleUploadVideo = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("videoFile",videoFile);
    data.append("thumbnail",thumbnail);
    data.append("title",title);
    data.append("description",description)

    setLoading(true);
    try {
      const res = await axios.post(
        BASE_URL + `/video/upload`,
        data,
        {
          withCredentials: true,
        }
      );
      console.log(res.data);
      //once complete stop loading
      setLoading(false);
      //show a ui res that video is uploaded 
      console.alert("Video Uploaded Successfully!!")
      //and navigate to / home page/feed
      navigate('/');
    } catch (error) {
      //stop the loading 
      console.log(error);
      //TODO: if fails be on the same page and try again button
      setLoading(false);
      console.alert("Something Went Wrong Pls try again!!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center w-screen bg-red-400">
      <div className="bg-white w-full max-w-sm my-8 rounded-lg p-5 shadow-lg">
        <label className="text-2xl font-semibold ">Upload Video</label>
        <form className="mt-6">
          <div className="space-y-2 ">
            <label className="block text-gray-600">Video File</label>
            <input onChange={handleVideoFile} type="file" className="w-full p-2 border rounded-md" />

            <label className="block text-gray-600">Thumbnail</label>
            <input onChange={handleThumbnailFile} type="file" className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-gray-600">Title</label>
            <input
              type="text"
              placeholder="Video title..."
              value={title}
              required
              onChange={(e) => setTitle(e.target.value)}
              className=" bg-slate-100 w-full px-4 py-2 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mt-5">
            <label className="block text-gray-600">Description</label>
            <input
              type="text"
              placeholder="Video description..."
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className=" bg-slate-100 w-full px-4 py-2 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            onClick={handleUploadVideo}
            type="submit"
            className="py-2 bg-blue-500 mt-10 w-full rounded-lg text-lg text-white hover:bg-blue-600 transition"
          >
            Upload
          </button>
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
              <p className="mt-2 text-gray-600 font-semibold">Uploading...</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UploadVideo;
