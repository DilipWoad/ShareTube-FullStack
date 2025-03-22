import PlaylistCard from "./PlaylistCard"
import VideoCard from "./VideoCard"

const LibraryCardComponent=({history,label})=>{
    
    if(!history) return <div>Loading...</div>
    return(
        <div className="bg-green-300 my-5 p-2">
            <p className="text-xl font-bold">{label}</p>
            <div className="bg-pink-300 flex flex-wrap overflow-x-scroll">
                {
                    label!=="Playlists" ?    
                        history.map((video)=>(<VideoCard key={video?._id} video={video} css={"w-[224px] h-52 text-md"} thumbnailcss={"h-32"}/>))
                    : history.map((playlist)=><PlaylistCard key={playlist?._id} playlist={playlist} css={"w-[224px] h-52 text-md"} thumbnailcss={"h-32"}/>)
                }
            </div>
        </div>
    )
}

export default LibraryCardComponent