import { v2 as cloudinary } from "cloudinary"; 

import fs from 'fs';
import { extractPublicId } from "./extractPublicId.js";
import { ApiError } from "./ApiError.js";

//so we first get the img/vid to the server
//from server we get file path
//this path will be the input for the cloudinary

cloudinary.config({ 
    cloud_name: 'dvb5edx52', 
    api_key: process.env.CLOUDINARY_API_KEY ,
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});
  

const uploadToCloudinary = async(filePath)=>{
    try {
        //check if file path is present or not(meaning that file does not reached the server)
        if(!filePath) return null;
        //else upload it to the sever
        const response = await cloudinary.uploader.upload(filePath,{
            use_filename:true,
            resource_type:"auto"
        })

        //once uploaded
        console.log(response);
        //this response will have the inmage link

        //now we can remove the file from the server
        fs.unlinkSync(filePath);
        return response;
    } catch (error) {
        //if any error
        //firstly remove the file from the server
        fs.unlinkSync(filePath);
        return null;
    }

}

const deleteFromCloudinary =async(url,resourceType='image')=>{ 

    const publicId = extractPublicId(url);
    const isDeleted = await cloudinary.api.delete_resources(publicId ,{resource_type: resourceType});
    console.log(isDeleted);
    return isDeleted;
}


const uploadVideoToCloudinary = async (filePath) => {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "video" },
        (error, result) => {
          if (error) {
            fs.unlink(filePath, () => {}); // Delete file if upload fails
            return reject(new ApiError("Uploading video to Cloudinary Failed!", 500));
          }
          resolve(result);
        }
      );
  
      fs.createReadStream(filePath).pipe(uploadStream);
    });
  };


export {uploadToCloudinary,deleteFromCloudinary,uploadVideoToCloudinary};
