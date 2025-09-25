import mongoose from 'mongoose'

const mongoDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL || "mongodb+srv://developer786kasif_db_user:9956920829@cluster0.sd78rha.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0" );
        console.log("Connected successfully ");
    } catch (error) {
        console.log("DB not connected",error);
        process.exit(1);
    }
}

export default mongoDB