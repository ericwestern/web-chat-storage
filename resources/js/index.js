const nameInput = document.getElementById("my-name-input");
const myMessage = document.getElementById("my-message");
const sendButton = document.getElementById("send-button");
const saveButton = document.getElementById("save-button");
const chatBox = document.getElementById("chat");
const nameSpan = document.getElementById("name-span");
const serverURL = 'https://it3049c-chat-application.herokuapp.com/messages';

updateMessagesInChatBox();
const MILLISECONDS_IN_TEN_SECONDS = 10000;
setInterval(updateMessagesInChatBox, MILLISECONDS_IN_TEN_SECONDS);

async function updateMessagesInChatBox() {
  const messages = await fetchMessages();
  
  let formattedMessages = "";
  messages.forEach(message => {
    formattedMessages +=  formatMessage(message, nameInput.value);
  });
  chatBox.innerHTML = formattedMessages;
}

function fetchMessages() {
  return fetch(serverURL)
      .then( response => response.json())
}

function formatMessage(message, nameInput) {
    const time = new Date(message.timestamp);
    const formattedTime = `${time.getHours()}:${time.getMinutes()}`;

    if (localStorage.getItem('username') === message.sender) {
        return `
        <div class="mine messages">
            <div class="message">
                ${message.text}
            </div>
            <div class="sender-info">
                ${formattedTime}
            </div>
        </div>
        `
    } else {
        return `
            <div class="yours messages">
                <div class="message">
                    ${message.text}
                </div>
                <div class="sender-info">
                    ${message.sender} ${formattedTime}
                </div>
            </div>
        `
    }
}

function sendMessages(username, text) {
  const newMessage = {
      sender: username,
      text: text,
      timestamp: new Date()
  }

  fetch (serverURL, {
      method: 'POST', 
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(newMessage)
  });
}

function saveUserName() {
    localStorage.setItem('username', nameInput.value);
    myMessage.removeAttribute('disabled');
    sendButton.removeAttribute('disabled');
    nameSpan.innerText = "Sending messages as: " + localStorage.getItem('username');
}

sendButton.addEventListener("click", function(sendButtonClickEvent) {
  sendButtonClickEvent.preventDefault();
  const sender = localStorage.getItem('username');
  const message = myMessage.value;

  sendMessages(sender,message);
  myMessage.value = "";
});

saveButton.addEventListener("click", saveUserName);