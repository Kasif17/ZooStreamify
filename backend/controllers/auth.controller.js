import { upsertCreateStreamUser } from "../config/stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  const { email, password, fullName } = req.body;
  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already exists, please use a different one" });
    }

    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    const newUser = await User.create({
      email,
      fullName,
      password,
      profilePic: randomAvatar,
    });

    try {
      await upsertCreateStreamUser({
      id: newUser._id.toString(),
      name : newUser.fullName,
      image: newUser.profilePic || ""
    })
    console.log(`Stream user created for ${newUser.fullName} `);
    } catch (error) {
       console.error("error from controller upsertCreateStream",error);
       
    }

    const token = jwt.sign({ userId: newUser._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({ success: true, user: newUser, token });
  } catch (error) {
    console.error("Error in signup controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  
  try {
     const{email , password } = req.body
     if(!email || !password){
      return res.status(400).json({message : " All fields are required"})
     }
     const user = await User.findOne({email})
     if(!user){
      return res.status(401).json({message : "Invalid credentials"})
     }

     const isPasswordCorrect = await user.matchPassword(password)
    if(!isPasswordCorrect){
      return res.status(401).json({message : "Invalid credentials"})
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({success:true ,user})

  } catch (error) {
    console.log("error from login controllers",error);
    res.status(500).json({message:error})
    
  }
};

export const logout = async (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ message: "Logged out successfully" });
};



export const onboard = async (req, res) => {
  try {
    const userId = req.user?._id; // Ensure req.user exists

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body;

    // ✅ Validate required fields
    const missingFields = [
      !fullName && "fullName",
      !bio && "bio",
      !nativeLanguage && "nativeLanguage",
      !learningLanguage && "learningLanguage",
      !location && "location",
    ].filter(Boolean);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "All fields are required",
        missingFields,
      });
    }

    // ✅ Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullName,
        bio,
        nativeLanguage,
        learningLanguage,
        location,
        isOnboarded: true,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    try {
      await upsertCreateStreamUser({
      id:updatedUser._id.toString(),
      name: updatedUser.fullName,
      image: updatedUser.profilePic || ""
    })
    console.log(`Straem user updated after onbaording ${updatedUser.fullName}`);
    
    } catch (error) {
      console.error("Error from Stream user updated",error);
      
    }

    return res.status(200).json({
      success: true,
      message: "User onboarded successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Onboarding Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


// export const onboard = async(req,res)=>{
//   try {
//     const userId = req.user._id;

//     const {fullName,bio,nativeLanguage,learningLanguage,location} = req.body;
//     if(!fullName || !bio || !nativeLanguage ||! learningLanguage || !location){
//       return res.status(400).json({
//         message : "All field Required",
//         missingFields:[
//           !fullName && "fullName",
//           !bio && "bio",
//           !nativeLanguage && "nativeLanguage",
//           !learningLanguage && "learningLanguage",
//           !location && "location"
//         ].filter(Boolean),
//       })
//     }

//   const updateUser = await User.findByIdAndUpdate(userId,{
//     ...req.body,
//     isOnboarded:true,
//   },{new:true})  
//   if(!updateUser){
//     return res.status(404).json({ message: "User not found" });
//   }
//   } catch (error) {
//     console.error("onboarding Error",error);
//     res.status(500).json({ message:"Internal Error Updated" });
//   }
// }





// import User from "../models/User.js";
// import jwt from "jsonwebtoken";

// export const signup = async (req, res) => {
//   const { email, password, fullName } = req.body;
//   try {
//     if (!email || !password || !fullName) {
//       return res.status(400).json({ message: "All fields Are Required" });
//     }
//     if (password.length < 6) {
//       return res
//         .status(400)
//         .json({ message: " Paasword must be at least 6 characters" });
//     }
//     const emailRegax = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegax.test(email)) {
//       return res.status(400).json({ message: " Invalid email id" });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res
//         .status(400)
//         .json({ message: "email alredy existing please use diffrent one" });
//     }
//     const idx = Math.floor(Math.random() * 100) + 1;
//     const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

//     const newUser = await User.create({
//       email,
//       fullName,
//       password,
//       profilePic: randomAvatar,
//     });

//     const token = jwt.sign({ userId: newUser._id }, process.env.SECRET_KEY, {
//       expiresIn: "7d",
//     });

//     res.cookie("jwt", token, {
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//       httpOnly: true,
//       sameSite: "strict",
//       secure: process.env.NODE_ENV === "production",
//     });

//     res.status(201).json({ success: true, user: newUser });
//   } catch (error) {
//     console.log("Error in signup controllers", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// export const login = async (req, res) => {};

// export const logout = async (req, res) => {};
