const net = require('net');

let players = [];
let userOnline = 0;
let nextMove = {};
let field = [
    [" ", " ", " "],
    [" ", " ", " "],
    [" ", " ", " "],
  ];

const server = net.createServer(socket => {

    const startGame = () => {
        field = [
            [" ", " ", " "],
            [" ", " ", " "],
            [" ", " ", " "],
          ];
          show(field);
    }

    const playerTurn = (position, field) => {
        let pos = position.split(' ');
        const x = Number(pos[0]);
        const y = Number(pos[1]);
        if(x <= 2 && x >= 0 && y >= 0 && y <= 2) {
        if (field[x][y] === ' ') {
            field[x][y] = nextMove.symbol;
            show(field);
            if (checkConditionGame(field, nextMove.symbol)) {
                nextMove = {
                    socket: nextMove.socket === players[0].socket ? players[1].socket : players[0].socket,
                    symbol: nextMove.symbol === 'x' ? 'o' : 'x'
                }
                players.map(player => {
                    if (player.socket === nextMove.socket) {
                        player.socket.write('You move');
                        player.socket.write('\n')
                    }
                }); 
            } else {
                players.map(player => {
                    if (player.socket === nextMove.socket) {
                        player.socket.write('YOU WIN')
                    }
                    else {
                        player.socket.write('YOU LOSE');
                    }
                })
                startGame();
            }
        }
    }
    }

    const checkConditionGame = (field, symbol) => {
        if (field[0].includes(' ') === false && field[1].includes(' ') === false && field[2].includes(' ') === false) {
            console.log('DRAW!');
            return false;
        } else {
            return !(field[0][0] === symbol && field[1][0] === symbol && field[2][0] === symbol ||
                field[0][1] === symbol && field[1][1] === symbol && field[2][1] === symbol ||
                field[0][2] === symbol && field[1][2] === symbol && field[2][2] === symbol ||
                field[0][0] === symbol && field[0][1] === symbol && field[0][2] === symbol ||
                field[1][0] === symbol && field[1][1] === symbol && field[1][2] === symbol ||
                field[2][0] === symbol && field[2][1] === symbol && field[2][2] === symbol ||
                field[0][0] === symbol && field[1][1] === symbol && field[2][2] === symbol ||
                field[0][2] === symbol && field[1][1] === symbol && field[2][0] === symbol);
        }
    }
    
    const show = (field) => {
        let fieldView = '';
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if ((i === 1 && j === 1) || (i === 2 && j === 1) || (i === 0 && j === 1)) {
                  fieldView += "| " + field[i][j] + " |";
                } else {
                  fieldView += " " + field[i][j];
                }
            }
                if (i !== 2) {
                    fieldView += '\n--+---+--\n';
                }
            }
            players.map(player => {
                player.socket.write('\n')
                player.socket.write(fieldView)
                player.socket.write('\n')
            })
        }

    userOnline++;

    if (userOnline === 1) {
        players.push({ socket: socket, symbol: 'x', move: 1 });
    }
    else if (userOnline === 2) {
        players.push({ socket: socket, symbol: 'o', move: 2 });
        startGame();
    } else if (userOnline > 2) {
        socket.disconnect(true);
        userOnline--;
    }

    socket.on('data', message => {
        if (nextMove.socket === undefined) {
            nextMove = {socket: socket, symbol: players.find(player => player.socket === socket).symbol};
        } 
        if (socket === nextMove.socket) {
            playerTurn(message.toString(), field);
        }
        
    })
    
});

server.listen(1337, '10.0.0.227');