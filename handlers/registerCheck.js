function registerCheck(request, response){
    if(request.session.logged_in){
        console.log("Redirecting to home, current user: "+request.session.username);
        response.redirect("/register");
    }
    else{
      response.render('registerCheck', {title: 'Auction - registerCheck'});
    }
  }
  
  module.exports = {
        registerCheck
  };