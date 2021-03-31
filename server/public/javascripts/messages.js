function addMessageGroup(channel) {
    var el = document.getElementById("message-list");
    var node = document.createElement("li");
    var div = document.createElement("div");
    var msggrp = document.createElement("div");
    var bttnwrap = document.createElement("div");
    var menu = document.createElement("div");
    var icon = document.createElement("img");
    var status = document.createElement("span");
    var statuscircle = document.createElement("span");
    var bttn = document.createElement("bttn");
    var letter =channel.name.charAt(0);
    if(letter.length === 1 && letter.match(/[a-z]/i)){
        icon.src = '/images/letters/letter-'+letter+'.svg'
    }
    else{
        icon.src = '/images/letters/letter-s.svg'
    }
    icon.setAttribute("height", "40");
    icon.setAttribute("width", "40");
    icon.setAttribute("alt", "lettericon");
    node.appendChild(icon);
    node.setAttribute('class', 'message');
    div.setAttribute('class', 'divider');
    msggrp.setAttribute('class', 'messagegroup');
    msggrp.innerText=channel.name;
    bttnwrap.setAttribute('class', 'button-wrapper');
    menu.setAttribute('class', 'menu');
    status.setAttribute('class', 'status');
    statuscircle.setAttribute('class', "status-circle green");
    bttn.setAttribute('class', 'message-button status-button open');
    bttn.innerText="Open";
    el.appendChild(node);
    node.setAttribute("onClick","addRecievedMessage()");
    node.appendChild(div);
    node.appendChild(msggrp);
    status.innerText="message snippet";
    node.appendChild(status);
    bttnwrap.appendChild(bttn);
    bttnwrap.appendChild(menu);
    node.appendChild(bttnwrap);
    status.appendChild(statuscircle);
    }
function addRecievedMessage(){
    var list = document.getElementById("chat");
    var message = document.createElement("div");
    message.setAttribute('class', 'incoming_msg');
    list.appendChild(message);
    var imagediv = document.createElement("div");
    imagediv.setAttribute('class', 'incoming_msg_img');
    var image = document.createElement("img");
    image.src = '/images/letters/letter-s.svg'
    image.setAttribute("height", "40");
    image.setAttribute("width", "40");
    image.setAttribute("alt", "lettericon");
    message.appendChild(imagediv);
    imagediv.appendChild(image);
    var rcvmsg = document.createElement("div");
    rcvmsg.setAttribute('class', 'received_msg');
    message.appendChild(rcvmsg);
    var rcvmsgcnt = document.createElement("div");
    rcvmsgcnt.setAttribute('class', 'received_withd_msg');
    rcvmsg.appendChild(rcvmsgcnt);
    var sender = document.createElement("div");
    sender.setAttribute('class', 'message_sender');
    sender.innerText="Name"
    rcvmsgcnt.appendChild(sender);
    var time = document.createElement("span");
    time.setAttribute('class', 'time_date');
    time.innerText=" 11:01 AM | June 9"
    sender.appendChild(time);
    var cont = document.createElement("p");
    cont.innerText="Why do seagulls fly over the ocean? Because if they flew over the bay, we'd call them bagels.";
    rcvmsgcnt.appendChild(cont);
}
function sendMessage(authtokn,channel,content){
    var data = JSON.stringify({
        "message": content,
        "to_channel": channel
      });
      
      var xhr = new XMLHttpRequest();
      
      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
          console.log(this.responseText);
        }
      });
      
      xhr.open("POST", "https://localhost:3000/chat/redirect");
      xhr.setRequestHeader("content-type", "application/json");
      
      xhr.send(data);
}
      