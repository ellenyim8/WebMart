class User{
    constructor(){
        if (this.constructor == User) {
            throw new Error("Can't instantiate abstract User class");
        }
    }

    displayInfo(){
        throw new Error("Method displayInfo not implemented")
    }
}

class BaseUser extends User{
    constructor(username, email, address, dateOfEntry, img, about, type, friends, friend_requests) {
        super()
        this.username = username
        this.email = email
        this.address = address
        this.date = dateOfEntry
        this.img = img
        this.about = about
        this.type = type
        this.friends = this.friends
        this.friend_requests = friend_requests
    }

    displayInfo(){
        console.log('User: '+this.username + ', '+this.email+'connected')
    }
}

class Admin extends User{
    constructor(username, email, address, dateOfEntry, img, about, type, permissions) {
        super()
        this.username = username
        this.email = email
        this.address = address
        this.date = dateOfEntry
        this.img = img
        this.about = about
        this.type = type
        this.permissions = permissions
    } 

    displayInfo(){
        console.log('Admin: '+this.username + ', '+this.email+'connected')
        console.log('Permissions granted: '+this.permissions)
    }
}


module.exports = {
      User, Admin, BaseUser
};