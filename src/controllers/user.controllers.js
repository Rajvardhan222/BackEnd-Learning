import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../module/user.models.js";
import  jwt  from "jsonwebtoken";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    //validation not empty
    //check if user already exists: username, email
    // check for images, check for avatar
    //upload them to cloudinary, avatar
    // create user object create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return response

    let { username, email, password, fullName } = req.body;

    if ([username, email, password, fullName].some((data) => data === "")) {
        throw new ApiError(400, "Fiels are required");
    }

    let isUserTHere = await User.find({
        $or: [{ email }, { username }],
    });

    if (isUserTHere.length !== 0) {
        throw new ApiError(400, "User Already there!!");
    }
    const avatarLocalPath = req.files?.avatar[0]?.path;
    console.log("avatar path", req.files);
    let coverImageLocalPath;
    console.log("cover image path ", req.files.coverImage.length);
    if (req.files && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files?.coverImage[0]?.path;
        console.log("this if executed");
    } else {
        coverImageLocalPath = "";
    }

    if (!avatarLocalPath) throw new ApiError(408, "Avatar is required");
    let avatar = await uploadOnCloudinary(avatarLocalPath);
    let coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if (!avatar) {
        throw new ApiError(
            500,
            "Internal Server Errror :: Avatar Upload Failed"
        );
    }
    let user = await User.create({
        username: username.toLowerCase(),
        fullName,
        email,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
    });
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    if (!createdUser)
        throw new ApiError(501, "something went Wrong :: user Not created");

    return res
        .status(201)
        .json(new ApiResponse(201, createdUser, "user creation successful"));
});
const generateAccessAndRefreshToken = async(userId)=>{
         try {
            const user = await  User.findById(userId)
            if(!user){
              throw new ApiError(400,'User not Found')
            }
           const accessToken =await user.generateAccessToken()
           const refreshToken =await user.generateRefreshToken()
           user.refreshToken = refreshToken;
           user.save({
             validateBeforeSave:false
           })
  
           return {accessToken,refreshToken}
         } catch (error) {
            throw new ApiError(502,'Failed to generate refreshToken')
         }
}
const logginUser = asyncHandler(async(req,res)=>{
        // req body -> data
        // username or email
        //find the user
        //password check
        //access and referesh token
        //send cookie

        const {username,email,password} = req.body;
            console.log('userName',req);
        if (!(username||email)) {
            throw new ApiError(404,'UserName or Email anyone is required ')
        }

       const user = await User.findOne({
            $or:[{username},{email}]
        })

        if (!user) {
            throw new ApiError(420,'NO user found with that email or username')
        }
        

      const isPasswordCorrect =  await user.isPasswordCorrectCheck(password)

      if (!isPasswordCorrect) {
        throw new ApiError(409,"Password incorrect")
      }

     const {accessToken,refreshToken} =await generateAccessAndRefreshToken(user._id)
      const option = {
        httpOnly:true,
        secure:true
      }

     res.status(201).cookie('refreshToken',refreshToken,option)
     .cookie('AccessToken',accessToken,option)
     .json(
        new ApiResponse(201,
        {
            refreshToken:refreshToken,
            accessToken:accessToken
        },
        "User logged in successful"
        )
     )
    

})
const logout = asyncHandler(async(req,res,next)=>{
    User.findByIdAndUpdate(
       await req.user._id,
        {
            $set : {
                refreshToken : ""
            }
        },
        {
            new:true
        }

    )
    const option = {
        httpOnly:true,
        secure:true
      }

      res.status(201).clearCookie('AccessToken',option)
      .clearCookie('refreshToken',option).json(
        new ApiResponse(200,{},"logged Out successful")
      )

})

const refreshAccessToken = asyncHandler(async(req,res)=>{
      let fromUserRefreshToken =  req?.cookie?.requestToken||Headers.requestToken
      let decodedRefreshToken =  jwt.verify(fromUserRefreshToken,process.env.REFRESH_TOKEN_SECRET)
     let user = User.findById(decodedRefreshToken._id)
     if(!user){
        throw new ApiError(400,"Invalid User ")
     }

     if(user.refreshToken!==fromUserRefreshToken){
        throw new ApiError(400,"Invalid Access Token")
     }
     const option = {
        httpOnly:true,
        secure:true
      }
    let {accessToken,refreshToken} =await generateAccessAndRefreshToken(user._id)
   
    res.status(201)
    .cookie('AccessToken',accessToken,option)
    .cookie("refreshToken",refreshToken,option)
    .json(
        new ApiResponse(201,{
            AccessToken:accessToken,
            refreshToken
        },
    "Token regenerated successfully"
    )
    )


})

const changeUserPassword = asyncHandler(async(req,res)=>{
   
    console.log(req.body);
    let {oldPassword,newPassword} = req?.body

    let user = req.user
    console.log("User line 199 ",user);
    
       let isOldPasswordCorrect =await user.isPasswordCorrectCheck(oldPassword)
       if(!isOldPasswordCorrect){
        throw new ApiError(404,"Password incorrect")
       }

       user.password = newPassword
   let savedUser =  await  user.save()
   if(!savedUser){
    throw new ApiError(500,"Something went wrong while saving the password to db")
   }
    
   res.status(201).json(
    new ApiResponse(201,{
        user:savedUser
    },
'Password updated successfully')
   )


           

           
           
})

const updateUserInformation = asyncHandler(async(req,res)=>{
    const {fullName,email} = req.body
    
    if (!(fullName || email)) {
        throw new ApiError(404,"Any one field is require Name or Email")
    }

   let user =await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                fullName,email
            }
        },
        {
            new:true
        }
    ).select("-password -refreshToken")

    if(!user){
        throw new ApiError(505,"SOmething went wrong while updating the username or email in database ")
    }
    res.status(200).json(
        new ApiResponse(200,{userData:user},"User Name or Email Updated Successfully")
    )
})

export { registerUser,logginUser ,logout,refreshAccessToken,changeUserPassword,updateUserInformation};
