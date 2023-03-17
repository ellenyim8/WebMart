const Items = require("../models/Items");

async function getPurchase(request, response){ //handler for profile
    if(request.session.logged_in || !request.session.logged_in){
      var id = request.params.item_id
      try{
        const item_to_display = await Items.findById({"_id": id}).lean()
        if(item_to_display){
        console.log("Going to purchase page: "+item_to_display.name);
        console.log("Price: "+item_to_display.price);
        console.log("Item Id: "+item_to_display._id);
        response.render('purchasePage', {
            title: 'WebMart',
            userObj : request.session.userObj,
            username: request.session.username,
            address: request.session.address,
            email: request.session.email,
            img: request.session.img,
            about: request.session.about,
            type: request.session.type,
            purchaseHistory : request.session.purchaseHistory,
            item_to_display: item_to_display
           });
        }
        else{
            console.log("No item found!")
            response.redirect("/home")
        }
      }
      catch (error) {        
        // console.log("No item found or invalid ID given!")
        // console.log(error)
        response.redirect("/home")}
    }
    else{
        // console.log("Not logged in, redirecting")
        response.redirect("/login")
    }
  }
  
  module.exports = {
      getPurchase
  };