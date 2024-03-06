const socket = io();

const username = prompt('Enter your username:');
socket.emit('join', username);

const messages = document.getElementById('messages');
const form = document.querySelector('form');
const input = document.getElementById('message-input');
const audio = new Audio("alert.mp3");

// Common function to append "message" child node
const append = async(message, position) => {
    const messageElement = document.createElement("div");
    messageElement.classList.add("msg");
    messageElement.classList.add(position);
    
    if(position === 'center') {
    messageElement.style.fontFamily = "Arial, Helvetica, sans-serif;";
    }
    
    messageElement.innerHTML = message;
    messages.append(messageElement);

    if(position === 'left'){
    await audio.play();
    }
}

// Handling "Submit" event-listener
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if(input.value){
    const message = input.value;
    append(`<strong>You:</strong> ${message}`, 'right');
    socket.emit('send', message);
    input.value = "";
    }
})

// Sending socket request to server, when new-user joins
socket.emit('new-user-joined', username);

socket.on('user-joined', name => {
    if(name) append(`<strong>${name}</strong> joined the chat`, 'center');
})

// Handling messages received to user(s)
socket.on('receive', data => {
    append(`<strong>${data.name}:</strong> ${data.message}`, 'left');
})

// Handling "disconnect" from socket server, when user leaves
socket.on('user left', name => {
    append(`<strong>${name}</strong> left the chat`, 'center');
});