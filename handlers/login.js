function getLogin(request, response){
  if(request.session.logged_in){
    console.log("Redirecting to home, current user: "+request.session.username);
    response.redirect("/home");
  }
  else{
    response.render('login', {title: 'Auction - Login'});
  }
}

module.exports = {
    getLogin
};