export const extractPublicId = (url) => {
  const com = url.split("/");
//   console.log(com);
  const last = com[com.length - 1];
//   console.log(last);
  const finalArr = last.split(".");
//   console.log(finalArr);
  const publicId = finalArr[0];
  console.log(publicId);
  return publicId;
};
