import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../module/user.models.js";
import  jwt  from "jsonwebtoken";
export let varifyJWT = asyncHandler(async (req,_,next)=>{
   try {
   console.log(req);
     let token = req?.cookies.AccessToken;
 
     if (!token) {
         throw new ApiError(400,'Invalid Access')
     }
 
   const decodedToken =  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
   console.log("decodedToken",decodedToken);
   let user =await User.findById(decodedToken._id)
   if (!user) {
     throw new ApiError(450,"Invalid User")
   }
   console.log('logout',user);
   req.user = user;
   next()
   } catch (error) {
    throw new ApiError(500,'Something went wrong while loging out')
   }

})

