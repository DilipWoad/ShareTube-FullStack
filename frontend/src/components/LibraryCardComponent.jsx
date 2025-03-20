import VideoCard from "./VideoCard"

const LibraryCardComponent=({history})=>{
    
    if(!history) return <div>Loading...</div>
    return(
        <div className="bg-green-300 my-5">
            <p className="text-xl font-bold">History</p>
            <div className="bg-pink-300 flex flex-wrap overflow-x-scroll">
                {
                    history.map((video)=>(<VideoCard key={video?._id} video={video} css={"w-56 h-52"} thumbnailcss={"h-32"}/>))
                }
            </div>
        </div>
    )
}

export default LibraryCardComponent