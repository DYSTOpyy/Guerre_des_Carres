var socket = io();
    document.cookie='id='+socket.id+';';
    console.log(document.cookie);
    bouton.addEventListener('click', myfunction);

    function myfunction () {
      socket.emit('clique');
    }

    form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
      socket.emit('chat message', input.value);
      input.value = '';
    }
    });