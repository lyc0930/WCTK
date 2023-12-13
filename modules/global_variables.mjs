var Heroes = [];

var Areas = [];
for (let row = 0; row < 7; row++)
{
    Areas.push([]);
    for (let col = 0; col < 7; col++)
    {
        Areas[row].push(null);
    }
}

var currentMode = null; // 模式
function setCurrentMode(mode)
{
    currentMode = mode;
}

var currentPlayer = null; // 当前回合玩家
function setCurrentPlayer(player)
{
    currentPlayer = player;
}

var currentPhase = null; // 当前阶段
function setCurrentPhase(phase)
{
    currentPhase = phase;
}

export { Heroes, Areas, currentMode, setCurrentMode, currentPlayer, setCurrentPlayer, currentPhase, setCurrentPhase };