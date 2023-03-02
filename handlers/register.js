function getRegister(request, response){
    if(request.session.logged_in){
        console.log("Redirecting to home, current user: "+request.session.username);
        response.redirect("/home");
    }
    else{
      response.render('register', {title: 'WebMart - register'});
    }
  }
  
  module.exports = {
      getRegister
  };