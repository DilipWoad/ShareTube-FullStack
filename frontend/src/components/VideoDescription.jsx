const VideoDescription = ({ videoDetail }) => {
  const { views, description } = videoDetail;
  return (
    <div className="bg-yellow-300 rounded-lg p-2">
      <p className="font-semibold"> {views} views</p>
      <p>{description}</p>
    </div>
  );
};

export default VideoDescription;