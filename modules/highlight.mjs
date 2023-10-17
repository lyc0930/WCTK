// 高亮显示区域
function highlightCells(cells, className, listener = null)
{
    for (const cell of cells)
    {
        cell.classList.add(className);
        if (className === "reachable" || className === "landable" || className === "targetable")
        {
            cell.addEventListener("click", listener);
        }
    }
}

// 高亮显示区域
function highlightPieces(pieces, className, listener = null)
{
    for (const piece of pieces)
    {
        piece.parentElement.classList.add(className);
        if (className === "targetable")
        {
            piece.removeEventListener("click", clickPiece);
            piece.removeEventListener("mouseenter", onMouseEnterPiece);
            piece.removeEventListener("mouseleave", onMouseLeavePiece);
            piece.addEventListener("click", listener);
        }
    }
}

// 移除高亮显示
function removeHighlight(className, listener = null)
{
    for (const cell of document.getElementsByClassName("cell"))
    {
        cell.classList.remove(className);
        if (className === "reachable" || className === "landable")
        {
            cell.removeEventListener("click", listener);
        }
    }
    if (className === "targetable")
    {
        for (const piece of document.getElementsByClassName("piece"))
        {
            piece.removeEventListener("click", listener);
            piece.addEventListener("click", clickPiece);
            piece.addEventListener("mouseenter", onMouseEnterPiece);
            piece.addEventListener("mouseleave", onMouseLeavePiece);
        }
    }
}

function isHighlighting(className = null)
{
    if (className != null)
    {
        return document.getElementsByClassName(className).length > 0;
    }
    else
    {
        const highlights = ["reachable", "landable", "targetable"];
        for (const highlight of highlights)
        {
            if (document.getElementsByClassName(highlight).length > 0)
            {
                return true;
            }
        }
    }
}

export { highlightCells, highlightPieces, removeHighlight, isHighlighting };
