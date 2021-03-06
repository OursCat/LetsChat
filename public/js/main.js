const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
//get user name
const {username, room} = Qs.parse(location.search, {
  ignoreQueryPrefix:true
})


const socket =io()

//Join chatroom

socket.emit('joinRoom', {username,room})


socket.on('roomUsers', ({room, users})=>{
  outputRoomName(room);
  outputUsers(users);
})

socket.on('message', message=>{
  outputMessage(message);

  //scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
})

//message submit

chatForm.addEventListener('submit',(e)=>{
  e.preventDefault();
  //get message
  const msg = e.target.elements.msg.value;
  //send to the server
  socket.emit('chatMessage', msg)

  //clear input box
  e.target.elements.msg.value ='';
  e.target.elements.msg.focus();
})
//output message to DOM
function outputMessage(message){
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML =
  `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;
  document.querySelector('.chat-messages').appendChild(div);
}

//add room name
function outputRoomName(room){
  roomName.innerText = room;
}

function outputUsers(users){
  userList.innerHTML=`
    ${users.map(user=> `<li>${user.username}</li>`).join('')}
  `
}