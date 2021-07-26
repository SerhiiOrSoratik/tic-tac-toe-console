const { throws } = require('assert/strict');
const net = require('net');
const stream = require('stream');

let players = [];
let userOnline = 0;
const server = net.createServer(socket => {

    const clientInfo = `${socket.remoteAddress}:${socket.remotePort}`;
    console.log(`+ ${clientInfo} - connected`);
    userOnline++;

    if (userOnline === 1) {
        players.push({ id: socket.remotePort, symbol: 'x', move: 1 });
        field = [
            [" ", " ", " "],
            [" ", " ", " "],
            [" ", " ", " "],
          ];
        socket
          .pipe(new ticTacToe(field, socket, players)) // convert client messages to upper case
          .pipe(socket); 
    }
    else if (userOnline === 2) {
        players.push({ id: socket.remotePort, symbol: 'o', move: 2 });
        
          socket
          .pipe(new ticTacToe(field, socket, players)) // convert client messages to upper case
          .pipe(socket); // forwards uppercased text back to client
    } else if (userOnline > 2) {
        socket.disconnect(true);
        userOnline--;
    }
    console.log("online user: " + userOnline);

    socket.write('Echo server\r\n');
    
    socket.on('data', message => {
        process.stdout.write(`> ${clientInfo} : ${message}`);
    })

    socket.on('close', () => {
        console.log(`- ${clientInfo} - closed`)
    })
});

server.listen(1337, '10.0.0.227');

class ticTacToeGame {
    field = [
        [" ", " ", " "],
        [" ", " ", " "],
        [" ", " ", " "],
      ];
    players;
    constructor(player1, player2) {
        this.players.push(player1);
        this.players.push(player2);
    }

    
}

class Player {
    socketIp;
    moveType;
    constructor(socketIp, moveType) {
        this.socketIp = socketIp;
        this.moveType = moveType;
    }

}

// class ticTacToe extends stream.Transform {
//     field;
//     socket;
//     players;
//     userOnline = 0;
//     lastMove = 0;

//     constructor(field, socket, players) {
//         super()
//         this.field = field;
//         this.socket = socket;
//         this.players = players;
//     }

//     _transform(chunk, enc, done) {
//         this.move('0 0')
//         this.push(this.socket.id)
//         done();
//     }

//     move(data) {
//         if (this.lastMove !== this.players.find((pl) => pl.id === socket.remoteAddress).move) {
//             const position = data.position.split(' ');
    
//             if (position[0] >= 0 && position[0] <= 2 && position[1] >= 0 && position[1] <= 2) {
//                const x = position[1];
//                const y = position[0];
//                 if (field[x][y] === ' ') {
                        
//                         field[x][y] = players.find((pl) => pl.id === socket.remoteAddress).symbol.toString();
//                         io.sockets.emit("move complete", {field: field, nextMove: lastMove === 1 ? 'o' : 'x'});     
//                         checkConditionGame(field, players.find((pl) => pl.id === socket.remoteAddress).symbol.toString());
//                         lastMove = players.find((pl) => pl.id === socket.remoteAddress).move;
                     
//                 }
//                 else {
//                      console.log('wrong move')
//                 }
//             }
//         }
//     }

//     show(chunk) {
//         let fieldView = "";
//         for (let i = 0; i < 3; i++) {
//           for (let j = 0; j < 3; j++) {
//             if ((i === 1 && j === 1) || (i === 2 && j === 1) || (i === 0 && j === 1)) {
//               fieldView += "| " + this.field[i][j] + " |";
//             } else {
//               fieldView += " " + this.field[i][j];
//             }
//           }
//           if (i !== 2) {
//             fieldView += "\n--+---+--\n";
//           }
//         }
//         console.clear();
//         console.log(fieldView)
//     }

//     checkConditionGame(symbol) {
//         if (field[0].includes(" ") === false && field[1].includes(" ") === false && field[2].includes(" ") === false) {
//             return "Draw!";
//       } else if (
//             (this.field[0][0] === symbol && this.field[1][0] === symbol && this.field[2][0] === symbol) ||
//             (this.field[0][1] === symbol && this.field[1][1] === symbol && this.field[2][1] === symbol) ||
//             (this.field[0][2] === symbol && this.field[1][2] === symbol && this.field[2][2] === symbol) ||
//             (this.field[0][0] === symbol && this.field[0][1] === symbol && this.field[0][2] === symbol) ||
//             (this.field[1][0] === symbol && this.field[1][1] === symbol && this.field[1][2] === symbol) ||
//             (this.field[2][0] === symbol && this.field[2][1] === symbol && this.field[2][2] === symbol) ||
//             (this.field[0][0] === symbol && this.field[1][1] === symbol && this.field[2][2] === symbol) ||
//             (this.field[0][2] === symbol && this.field[1][1] === symbol && this.field[2][0] === symbol)) {
//             console.log("Win!");
//            return "Winner: " + symbol;
//         }
//     }
// }