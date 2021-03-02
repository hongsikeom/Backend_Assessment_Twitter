// User list
const users = [];

// Create user object and push it to the users list
function userInChat(id, username, room) {
    const user = {id, username, room};
    users.push(user);
    return user;
}


// Get current user
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}


// Remove the user
function deleteUser(id) {
    const userIndex = users.find(user => user.id == id);
    
    if(index != -1) {
        return users.splice(userIndex, 1)[0];
    }
}


// Get users that are in the same room
function getUsersInSameRoom(room) {
    return users.filter(user => user.room === room);
}

module.exports = { 
    userInChat, 
    getCurrentUser, 
    deleteUser, 
    getUsersInSameRoom
};