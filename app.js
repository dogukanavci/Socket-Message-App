var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var nicknames= {};
function addNickname(id,name){
  nicknames[id] = name;
}
//18 adjectives 14 nouns
var adjectives = ["angry","sad","unlucky","bored","ecstatic","odd","direct","underground","naked","extremely immensely religious","lord commander of the","hungry","thirsty","crazy","social","flying","overconfident","ambitious","young","half fish"];
var nouns = ["trash","banana","koala","panda","villager","traveler","guy","knight","cat","failure","bird","professor","pikachu","charizard","shoes"];
function  getRandomNickname(){
  return adjectives[Math.floor(Math.random() * 17)] + " " + nouns[Math.floor(Math.random() * 13)];
}

io.on('connection', function(socket){
  console.log(socket.id);
  socket.on('picked name', function(msg){
    var response = "";
    if (nicknames[socket.id]) {
      response = nicknames[socket.id] + " changed its nickname to "+msg;
      addNickname(socket.id, msg);
    }
    else {
      addNickname(socket.id, msg);
      response = nicknames[socket.id] + " joined the chat";
    }
    io.emit('picked name', response);
  });
  socket.on('chat message', function(msg){
    var sender = getRandomNickname();
    if (nicknames[socket.id] != undefined) {
      sender = nicknames[socket.id];
    }
    else {
      addNickname(socket.id, sender);
      io.emit('picked name', nicknames[socket.id] + " joined the chat");
    }
    io.emit('chat message', sender + ": " + msg);
  });
  socket.on('disconnect', function(){
    if (nicknames[socket.id]) {
      io.emit('chat message', nicknames[socket.id] + " disconnected the chat");
    }
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
