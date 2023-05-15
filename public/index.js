const socket = io('127.0.0.1:3000', {  reconnectionAttempts: 3 /* Try to reconnect up to 3 times*/});
socket.on('connect_error', error => {
    console.log('Connection error:', error);
        alert('Error connection with server try again after play server on port 3000 ,we will try connect 3 times  ');
  });
  
  socket.on('connect_timeout', timeout => {
    console.log('Connection timeout:', timeout);
    alert('Error connect_timeout with server try again after play server on port 3000 ');

    // Handle the timeout here
  }); 

socket.onAny((event, ...args) => {
    console.log('listen on '+event  +' on Any ');
    append(event , args)
});
// by jQuery
// $(document).on('click', '.show-more', function() {
//   console.log(1);
//   var parentElement = $(this).parents()[1];
//   var childTwo = $(parentElement).children();
//   $(childTwo[1]).toggleClass('d-none');
// });
document.addEventListener('click', function(event) {
  if (event.target.classList.contains('show-more')) {
    console.log(1);
    var parentElement = event.target.parentNode.parentNode;
    var childTwo = parentElement.children;
    childTwo[1].classList.toggle('d-none');
  }
});
const append= (event ,  args)=>{
  // $('#messages-container').append(`
  //       <div class="container darker">
  //           <div class="event" id="event1" style="display: flex; flex-direction: row;">
  //             <div style="width: 80%;" class="event-title">${event}</div>
  //             <div style="width: 10%;" class="event-time">${Date.now()}</div>
  //             <button style="width: 10%;" onclick="{
  //             }" class="show-more" >show</button>
  //           </div>
  //           <div class="event-body d-none event1-body" >
  //               <pre>${JSON.stringify(args[0])}</pre>
  //           </div>
  //       </div>`)
  const messagesContainer = document.querySelector('#messages-container');

const newContainer = document.createElement('div');
newContainer.classList.add('container', 'darker');

newContainer.innerHTML = `
  <div class="event"  >
    <div class="event-title">${event}</div>
    <div class="event-time" >${formatTime(Date.now())}</div>
    <div class="show-more caret"></div>

  </div>
  <div class="event-body d-none">
    <pre>${JSON.stringify(args[0])}</pre>
  </div>
`;

// messagesContainer.appendChild(newContainer);
messagesContainer.insertBefore(newContainer, messagesContainer.firstChild);

}

function fun(){
    console.log(1)
    const message ={msg:  "amgad wattar  " , name:"hello"};
    socket.emit('event',message)
    socket.emit('event2',message)
    socket.emit('event3',message)
}

function formatTime(timestamp) {
  const date = new Date(timestamp);
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getUTCSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

const toggleButton = document.querySelector('#toggle-button');
toggleButton.addEventListener('click', function() {
  const container = document.querySelector('#messages-container');
  container.classList.toggle('lighter');

  const nav = document.querySelector('#nav');
  // nav.className = '';
  if (nav.classList.contains('color-dark')) {
    nav.classList.remove('color-dark');
    nav.classList.add('color-light');
  } else {
    nav.classList.remove('color-light');
    nav.classList.add('color-dark');
  }
  const body = document.querySelector('body');
  body.classList.toggle('dark');
});