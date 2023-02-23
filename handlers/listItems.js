function getItemList(request, response){
    if(request.session.logged_in){
      console.log("Redirect to list items page, current user: "+request.session.username);
      response.render('listItems', {title: 'WebMart', username: request.session.username}); //loads username as var
    }
    else{
      response.render('home', {title: 'WebMart - Home Page'});
    }
  }
  
  module.exports = {
      getItemList
  };