import { createServer } from 'net';

let players = [];
let userOnline = 0;
let nextMove = {};
let field = [
    [" ", " ", " "],
    [" ", " ", " "],
    [" ", " ", " "],
  ];

  const startGame = () => {
    field = [
        [" ", " ", " "],
        [" ", " ", " "],
        [" ", " ", " "],
      ];
      players.forEach(player => { 
          player.socket.write('\n')   
          player.socket.write('NEW GAME') 
        });
      if (userOnline == 2) show(field);
}

const playerTurn = (position, field) => {
    let pos = position.split(' ');
    const y = Number(pos[0]);
    const x = Number(pos[1]);
    if(x <= 2 && x >= 0 && y >= 0 && y <= 2) {
    if (field[x][y] === ' ') {
        field[x][y] = nextMove.symbol;
        show(field);
        if (checkConditionGame(field, nextMove.symbol)) {
            nextMove = {
                socket: nextMove.socket === players[0].socket ? players[1].socket : players[0].socket,
                symbol: nextMove.symbol === 'x' ? 'o' : 'x'
            }
            players.forEach(player => {
                if (player.socket === nextMove.socket) {
                    player.socket.write('You move');
                    player.socket.write('\n')
                }
            }); 
        } else {
            players.forEach(player => {
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

export const checkConditionGame = (field, symbol) => {
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
        players.forEach(player => {
            player.socket.write('\n')
            player.socket.write(fieldView)
            player.socket.write('\n')
        })
    }


const server = createServer(socket => {
    userOnline++;

    if (userOnline === 1) {
        players.push({ socket: socket, symbol: 'x'});
    }
    else if (userOnline === 2) {
        players.push({ socket: socket, symbol: players[0].symbol !== 'x' ? 'x' : 'o'});
        startGame();
    } 
    
    socket.on('data', message => {
        if (nextMove.socket === undefined) {
            nextMove = {socket: socket, symbol: players.find(player => player.socket === socket).symbol};
        } 
        if (socket === nextMove.socket) {
            playerTurn(message.toString(), field);
        } 
    });

    socket.on('close', () => {
        userOnline--;
        nextMove = {};
        players.splice(players.findIndex(player => player.socket === socket), 1);
    })
    
});

server.maxConnections = 2;
server.listen(1338, '10.0.0.227');