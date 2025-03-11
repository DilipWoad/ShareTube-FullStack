const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

// const asyncHandler = (requestHandler)=>{
//     return async (req,res,next)=>{
//         //we perform Database opertion
//         //so try catch
//         try {
//             await requestHandler(req,res,next);
//         } catch (error) {
//             res.status(err.code || 500).json({
//                 sucess : false,
//                 message : err.message
//             })
//         }
//     }
// }

export { asyncHandler };
