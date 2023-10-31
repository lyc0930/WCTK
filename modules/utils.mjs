import { HERO_DATA, weapons, armors, horses } from './data.mjs';
import { currentPlayer, currentPhase } from "./global_variables.mjs";
import { redFlag, blueFlag } from './flags.mjs';
import { Hero } from './hero.mjs';
import { Area } from './area.mjs';

// 计算距离
function distance(P, Q)
{
    var area_P = P;
    var area_Q = Q;
    if (P instanceof Hero)
    {
        area_P = P.area;
    }
    if (Q instanceof Hero)
    {
        area_Q = Q.area;
    }
    return Math.abs(area_P.row - area_Q.row) + Math.abs(area_P.col - area_Q.col);
}

// 是否位于同一直线
function isOnSameLine(P, Q)
{
    var area_P = P;
    var area_Q = Q;
    if (P instanceof Hero)
    {
        area_P = P.area;
    }
    if (Q instanceof Hero)
    {
        area_Q = Q.area;
    }
    return area_P.row === area_Q.row || area_P.col === area_Q.col;
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

// 血量颜色
function HPColor(HP, maxHP)
{
    var factor = HP / maxHP;

    var color1 = { r: 255, g: 50, b: 50 }; // 红色
    var color2 = { r: 255, g: 127, b: 0 }; // 橙色
    var color3 = { r: 50, g: 160, b: 50 }; // 绿色

    var result = {};

    if (factor >= 0.5)
    {
        // 血量在一半以上，从橙色插值到绿色
        factor = (factor - 0.5) * 2; // 调整因子，使其在0到1之间
        result.r = Math.round(color2.r + factor * (color3.r - color2.r));
        result.g = Math.round(color2.g + factor * (color3.g - color2.g));
        result.b = Math.round(color2.b + factor * (color3.b - color2.b));
    } else
    {
        // 血量在一半以下，从红色插值到橙色
        factor = factor * 2; // 调整因子，使其在0到1之间
        result.r = Math.round(color1.r + factor * (color2.r - color1.r));
        result.g = Math.round(color1.g + factor * (color2.g - color1.g));
        result.b = Math.round(color1.b + factor * (color2.b - color1.b));
    }

    return 'rgb(' + result.r + ',' + result.g + ',' + result.b + ')';
}

// 绘制移动
function drawArrow(line, color = 'rgba(50, 50, 50)', isArrow = true)
{
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    var cellSize = canvas.width / 7; // 计算每个单元格的大小
    const width = 20;
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = color;
    for (let i = 1; i < line.length; i++)
    {

        const Px = line[i - 1][1] * cellSize + cellSize / 2;
        const Py = line[i - 1][0] * cellSize + cellSize / 2;
        const Qx = line[i][1] * cellSize + cellSize / 2;
        const Qy = line[i][0] * cellSize + cellSize / 2;
        if (Px === Qx && Py === Qy)
        {
            continue;
        }

        ctx.moveTo(Px, Py);
        ctx.lineTo(Qx, Qy);
    }
    ctx.stroke();
    if (isArrow)
    {
        ctx.lineCap = "butt";
        ctx.lineJoin = "miter";
        for (let i = 1; i < line.length; i++)
        {

            const Px = line[i - 1][1] * cellSize + cellSize / 2;
            const Py = line[i - 1][0] * cellSize + cellSize / 2;
            const Qx = line[i][1] * cellSize + cellSize / 2;
            const Qy = line[i][0] * cellSize + cellSize / 2;

            if (Px === Qx && Py === Qy)
            {
                continue;
            }

            ctx.moveTo(Px, Py);
            ctx.lineTo(Qx, Qy);

            var dx = Qx - Px;
            var dy = Qy - Py;
            var angle = Math.atan2(dy, dx);

            ctx.beginPath();
            ctx.moveTo((Px + (Qx - Px) * 0.55) - 0.5 * width * Math.cos(angle + Math.PI / 6), (Py + (Qy - Py) * 0.55) - 0.5 * width * Math.sin(angle + Math.PI / 6));
            ctx.lineTo((Px + (Qx - Px) * 0.55), (Py + (Qy - Py) * 0.55));
            ctx.lineTo((Px + (Qx - Px) * 0.55) - 0.5 * width * Math.cos(angle - Math.PI / 6), (Py + (Qy - Py) * 0.55) - 0.5 * width * Math.sin(angle - Math.PI / 6));
            ctx.closePath();
            ctx.stroke();
        }
    }
}

// 绘制转移
function drawTeleport(line, color = 'rgba(50, 50, 50)')
{
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    var cellSize = canvas.width / 7; // 计算每个单元格的大小

    const Px = line[0][1] * cellSize + cellSize / 2;
    const Py = line[0][0] * cellSize + cellSize / 2;
    const Qx = line[1][1] * cellSize + cellSize / 2;
    const Qy = line[1][0] * cellSize + cellSize / 2;
    if (Px === Qx && Py === Qy)
    {
        return;
    }

    const width = 10;
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.setLineDash([5, 20]);
    ctx.strokeStyle = color;

    ctx.moveTo(Px, Py);
    ctx.lineTo(Qx, Qy);

    ctx.stroke();

    ctx.lineWidth = width / 2;
    ctx.setLineDash([]);

    var dx = Qx - Px;
    var dy = Qy - Py;

    // 起点优弧
    ctx.beginPath();
    var angle = Math.atan2(dy, dx);
    ctx.moveTo(line[0][1] * cellSize + cellSize / 2 + 50 * Math.cos(angle + Math.PI / 5), line[0][0] * cellSize + cellSize / 2 + 50 * Math.sin(angle + Math.PI / 5));
    ctx.arc(line[0][1] * cellSize + cellSize / 2, line[0][0] * cellSize + cellSize / 2, 50, angle + Math.PI / 5, angle - Math.PI / 5);

    ctx.stroke();

    // 终点优弧
    ctx.beginPath();
    angle = Math.atan2(-dy, -dx);
    ctx.moveTo(line[1][1] * cellSize + cellSize / 2 + 50 * Math.cos(angle + Math.PI / 5), line[1][0] * cellSize + cellSize / 2 + 50 * Math.sin(angle + Math.PI / 5));
    ctx.arc(line[1][1] * cellSize + cellSize / 2, line[1][0] * cellSize + cellSize / 2, 50, angle + Math.PI / 5, angle - Math.PI / 5);

    ctx.stroke();
}

// 清空画布
function cls(delay = 0)
{
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    if (delay > 0)
    {
        setTimeout(() =>
        {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }, delay);
    }
    else
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

// 对局记录
function record(message)
{
    console.info(message);
}

export { distance, isOnSameLine, isHighlighting, HPColor, drawArrow, drawTeleport, cls, record };