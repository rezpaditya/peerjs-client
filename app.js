const peer = new Peer();

peer.on('open', function (id) {
  console.log('My PeerJS ID is: ' + id);
  $('#myId').text(id)
});

function connect() {
  const peerId = $('#peerId').val();
  const connection = peer.connect(peerId, {host: 'http://rtc-server.respa.nl/', port: '80'});

  connection.on('open', function () {
    console.log('Connected to: ' + connection.peer);

    // Receive and display chat messages
    connection.on('data', function (data) {
      displayMessage(connection.peer, data);
    });
  });
}

peer.on('connection', function (connection) {
  connection.on('open', function () {
    console.log('Connected to: ' + connection.peer);

    // Receive and display chat messages
    connection.on('data', function (data) {
      displayMessage(connection.peer, data);
    });
  });
});

function sendMessage() {
  const message = $('#messageInput').val();
  $('#messageInput').val('');

  // Send chat message to all connected peers
  Object.keys(peer.connections).forEach(function (peerId) {
    peer.connections[peerId].forEach(function (connection) {
      connection.send(message);
    });
  });

  displayMessage('Me', message);
}

function displayMessage(sender, message) {
  const formattedMessage = sender + ': ' + message;
  $('#messages').append(formattedMessage + '\n');
}