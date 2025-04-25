import VideoCard from "../VideoComponents/VideoCard";

const ChannelVideos =({channelVideos,menuClick})=>{
    return (
        <>
          {
            channelVideos.map((video) => (
              <VideoCard
                video={video}
                menuClicked={menuClick}
                css={"w-[235px] items-center"}
                thumbnailcss={"h-32"}
                isChannelVideos={true}
              />
            ))}  
        </>
    )
}

export default ChannelVideos;