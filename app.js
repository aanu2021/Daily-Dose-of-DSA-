const mailchimp = require("@mailchimp/mailchimp_marketing");
require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.listen(process.env.PORT||3000,function(){
  console.log("Server is running at port 3000");
})
  
app.get("/",function(req,res){
  res.sendFile(__dirname + "/signup.html");
})

mailchimp.setConfig({
  apiKey: process.env.API_KEY,
  server: "us17",
});

app.post("/",function(req,res){
    
   const firstName = req.body.firstName;
   const lastName = req.body.lastName;
   const email = req.body.email;

   const listId = process.env.LIST_ID;

   async function run(){
 
        const response = await mailchimp.lists.addListMember(listId,{

           email_address : email,
           status : "subscribed",
           merge_fields : {
              FNAME : firstName,
              LNAME : lastName,
           },

        }); 
        
        res.sendFile(__dirname + "/success.html");

   };

   run().catch((e) => res.sendFile(__dirname + "/failure.html"));

});

app.post("/failure",function(req,res){
  res.sendFile(__dirname + "/signup.html");
})



