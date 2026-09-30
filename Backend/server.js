require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const Port = 5000;
connectDB();
app.listen(Port,()=>{
    console.log(`LeadMind server is Running on port ${Port}`);
});