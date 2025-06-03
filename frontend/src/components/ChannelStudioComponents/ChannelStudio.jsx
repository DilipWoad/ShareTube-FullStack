import UploadVideo from "../VideoComponents/UploadVideo";
import StudioVideoCard from "./StudioVideoCard";

const ChannelStudio=()=>{
    return(
        <div className="flex w-screen h-screen m-2"> 
            <div className="bg-yellow-300 w-44 text-center mr-4">
                <div className="bg-lime-200 h-44 mb-4">
                    <img className="w-44 h-44 rounded-full object-cover" src="http://res.cloudinary.com/dvb5edx52/image/upload/v1739302337/dilip_pic_ox9fuv.jpg" alt="avatar"/>
                </div>
                <div className="bg-green-600" >
                    <div>Dashboard</div>
                    <div>Edit profile</div>
                    <div>Videos</div>
                    <div>Posts</div>
                </div>
            </div>
            <div className="bg-blue-300 flex-grow">
                <div className="bg-red-500 h-44 mb-4">
                    <img className="h-44 rounded-xl w-full object-fill" src="http://res.cloudinary.com/dvb5edx52/image/upload/v1739302338/dilip_sig_bty8ug.jpg"/>
                </div>
                <div className="bg-orange-400 h-screen mx-2">
                    <StudioVideoCard/>
                    <StudioVideoCard/>
                    <StudioVideoCard/>
                    <StudioVideoCard/>
                </div>
            </div>
            {/* <UploadVideo uploadBgCss={"bg-black bg-opacity-20"}/> */}
        </div>
    )
}

export default ChannelStudio;