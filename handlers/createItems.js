function getCreateItem(request, response){
    if(request.session.logged_in){
      console.log("Redirect to create items page, current user: "+request.session.username);
      response.render('createItems', {title: 'WebMart', username: request.session.username}); //loads username as var
    }
    else{
      response.render('home', {title: 'WebMart - Home Page'});
    }
  }
  
  module.exports = {
    getCreateItem
  };