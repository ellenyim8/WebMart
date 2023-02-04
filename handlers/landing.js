function getLanding(request, response){
  if(request.session.logged_in){
    console.log("Redirect to home page, current user: "+request.session.username);
    response.render('home', {title: 'Auction', username: request.session.username}); //loads username as var
  }
  else{
    response.render('landing', {title: 'Auction - Landing'});
  }
}

module.exports = {
    getLanding
};