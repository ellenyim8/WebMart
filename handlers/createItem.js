function getCreateItem(request, response) {
    if(request.session.logged_in){
        console.log("Redirecting to create items page: "+request.session.username);
        response.render('createItem', {title: 'WebMart', username: request.session.username});
    }
    else{
      response.render('createItem', {title: 'WebMart - create item'});
    }
}

module.exports = {
    getCreateItem
}