import { generateStreamToken } from "../config/stream.js"


export const getStreamToken = async (req,res)=>{
    try {
        const token = generateStreamToken(req.user.id);

        if (!token) {
      return res.status(500).json({ message: "Failed to generate token" });
    }


        res.status(200).json({token})
    } catch (error) {
        console.log("Error get in getStreamToken controller",error);
        res.status(500).json({message:"Internal Server Error "})
    }
}