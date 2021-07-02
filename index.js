const express= require("express");
const app=express();
const  mongoose = require('mongoose');
const dotenv=require("dotenv");
const helmet=require("helmet");
const morgan=require("morgan");
const userRouter=require("./routes/users");
const authRouter=require("./routes/auth");
const postsRoute=require("./routes/posts");

dotenv.config();
// mongoose.set('useUnifiedTopology', true);
// mongoose.set('useNewUrlParser', true);
// mongoose.connect("mongodb://127.0.0.1:27017/socialDB")
// .then( () => console.log("connected to DB."))
// .catch( err => console.log(err));
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true}, ()=>{
    console.log("Connected to mongDb");
});

//middleware

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users", userRouter);
app.use("/api/auth",authRouter);
app.use("/api/posts",postsRoute);

app.listen(5000, ()=>{
    console.log("Backaend is start");
})