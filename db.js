const mongoose =require('mongoose')
const connectDB =async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log('mongodb connecte avec succes')

    }catch(error)
    {
        console.error('erreur de connection mongoDB',error)
        process.exit(1)
    }
}
module.exports = connectDB;