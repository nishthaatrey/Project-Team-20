var Properties = require("../../Backend/models/property");
const request = require('request');

require("../../Backend/db/mongoose");

console.log(
  "---------------------INSIDE /SERVICES/BUYPROPERTY.js------------------"
);
function handle_request(msg, callback) {
  console.log(
    "In services buyproperty.js handle request:" + JSON.stringify(msg)
  );

  //Post request to Hyperledger to save new transaction
  propID = String(msg.streetaddr).replace(/\s+/g, "")
  console.log("PropID=", propID)
  bodyData ={
        "buyer":msg.fname,
        "seller":msg.owner_fname,
        "trans_date":msg.date,
        "trans_amt":msg.price,
        "property":propID 
  }

  console.log("HyperL bodyData=" + bodyData)

  url="http://localhost:4000/api/org.digitalproperty.TransactionDetails"

  request.post({
        headers: {'content-type' : 'application/json'},
        url: url,
        body: bodyData,
        json: true
         }, function(error, response, body){
            if(error){ 
              console.log(
                "There was a problem in saving the transaction history to hyperledger in buyproperty.js"
              );
              console.log(error); 
              callback(null, []);
            }
            console.log(body);
            
            //Delete entry from mongoDB 
            Properties.deleteOne({_id:msg.property_id}, function(err, obj) {
              if (err){
                console.log(
                  "There was a problem in deleting the posting on MongoDB."
                );
                console.log(err); 
                callback(null, []);
              } 
              console.log("1 document deleted");
              callback(null, JSON.stringify(bodyData, undefined, 2))
            });

    });

  



}

exports.handle_request = handle_request;
