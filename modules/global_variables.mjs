var Pieces = [];



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

export { Pieces, currentPlayer, setCurrentPlayer, currentPhase, setCurrentPhase };