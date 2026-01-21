import mongoose from 'mongoose'

const mongoDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL || "mongodb+srv://developer786kasif_db_user:lQ7OqAmGTbvvs1GF@cluster0.sd78rha.mongodb.net/test" );
        console.log("Connected successfully ");
    } catch (error) {
        console.log("DB not connected",error);
        process.exit(1);
    }
}

export default mongoDB