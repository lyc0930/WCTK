import { Area } from "./area.mjs";
import { isHighlighting } from "./utils.mjs";

// 标记类
// 仅抽象放置于场上的、非工事或控制标记的、非帅旗的标记
class Token
{
    constructor(name, area, color = null, dragable = true, background_image = null, initial = name[0], initial_color = 'white')
    {
        this.name = name;
        this.initial = initial;
        this.initial_color = initial_color;

        this.color = color;
        this.piece = this._create_piece(background_image);
        this.area = area; // 所在区域

        this.dragable = dragable; // 是否可拖动
        this._dragging = false; // 是否正在拖动
    }

    set area(value)
    {
        if (value instanceof Area)
        {
            this._area = value;
            this._area.cell.appendChild(this.piece);
        }
        else
        {
            this._area = null;
        }
    }

    get area()
    {
        return this._area;
    }

    set dragging(value)
    {
        if (this._dragging !== value)
        {
            this._dragging = value;
            if (value) // 开始拖动
            {
                document.body.appendChild(this.piece);
            }
            else // 结束拖动
            {
                this.piece.style.left = null;
                this.piece.style.top = null;
            }
        }
    }

    get dragging()
    {
        return this._dragging;
    }

    _create_piece(background_image)
    {
        const piece = document.createElement("div");
        piece.style.backgroundImage = background_image;
        piece.className = "piece token";

        piece.textContent = this.initial;
        piece.style.color = this.initial_color;

        if (this.color !== null)
        {
            piece.classList.add(this.color === "Red" ? "red-piece" : "blue-piece");
        }

        piece.token = this;

        const cell_at = (X, Y) =>
        {
            let nearest_cell = null;
            let min_d_sqr = 100000000;
            for (const cell of document.getElementsByClassName("cell"))
            {
                const { left, top, width, height } = cell.getBoundingClientRect()
                const centerX = left + width / 2
                const centerY = top + height / 2
                const d_sqr = Math.pow(X - centerX, 2) + Math.pow(Y - centerY, 2)
                if (d_sqr < min_d_sqr)
                {
                    min_d_sqr = d_sqr;
                    nearest_cell = cell;
                }
            }
            return nearest_cell;
        }

        // 添加鼠标事件
        piece.addEventListener("mousedown", (event) =>
        {
            // 正在等待响应
            if (isHighlighting()) return;
            if (!this.dragable) return;

            if (event.cancelable) event.preventDefault();
            // event.stopPropagation();

            const rect = piece.getBoundingClientRect();

            const shiftX = event.clientX - (rect.left + 0.5 * rect.width);
            const shiftY = event.clientY - (rect.top + 0.5 * rect.height);

            const phantom_piece = document.createElement("div");
            phantom_piece.className = "phantom piece token";
            phantom_piece.id = "phantom_piece";

            const onmousemove = (event) =>
            {
                if (event.cancelable) event.preventDefault();
                // event.stopPropagation();

                this.dragging = true;

                this.piece.style.left = event.clientX - shiftX + window.scrollX + 'px';
                this.piece.style.top = event.clientY - shiftY + window.scrollY + 'px';

                const nearest_cell = cell_at(event.clientX, event.clientY);
                nearest_cell.appendChild(phantom_piece);
            }

            const onmouseup = (event) =>
            {
                event.stopPropagation();
                document.removeEventListener('mousemove', onmousemove);

                phantom_piece.remove();

                if (this.dragging)
                {
                    this.dragging = false;

                    const chessboardRect = document.getElementById("chessboard").getBoundingClientRect();

                    if (event.clientX >= chessboardRect.left && event.clientX <= chessboardRect.right && event.clientY >= chessboardRect.top && event.clientY <= chessboardRect.bottom) // 在棋盘范围内
                    {
                        const nearest_cell = cell_at(event.clientX, event.clientY);
                        this.area = nearest_cell.area;
                    }
                    else
                    {
                        this.remove();
                    }
                }
            }

            document.addEventListener('mousemove', onmousemove);

            document.addEventListener('mouseup', onmouseup, { once: true });
        });

        // 添加触摸事件
        piece.addEventListener("touchstart", (event) =>
        {
            if (event.touches.length > 1) return;
            if (isHighlighting()) return;
            if (!this.dragable) return;

            event.stopPropagation();

            piece.style.scale = "0.75";

            const rect = piece.getBoundingClientRect();

            const shiftX = event.touches[0].clientX - (rect.left + 0.5 * rect.width);
            const shiftY = event.touches[0].clientY - (rect.top + 0.5 * rect.height);

            const phantom_piece = document.createElement("div");
            phantom_piece.className = "phantom piece token";
            phantom_piece.id = "phantom_piece";

            const ontouchmove = (event) =>
            {
                if (event.touches.length > 1) return;

                if (event.cancelable) event.preventDefault();
                // event.stopPropagation();

                this.dragging = true;

                this.piece.style.left = event.touches[0].clientX - shiftX + window.scrollX + 'px';
                this.piece.style.top = event.touches[0].clientY - shiftY + window.scrollY + 'px';

                const nearest_cell = cell_at(event.touches[0].clientX, event.touches[0].clientY);
                nearest_cell.appendChild(phantom_piece);
            }

            const ontouchend = (event) =>
            {
                if (event.changedTouches.length > 1) return;

                if (event.cancelable) event.preventDefault();
                // event.stopPropagation();
                piece.removeEventListener("touchmove", ontouchmove);

                phantom_piece.remove();

                piece.style.scale = "0.70";

                if (this.dragging)
                {
                    this.dragging = false;

                    const chessboardRect = document.getElementById("chessboard").getBoundingClientRect();


                    if (event.changedTouches[0].clientX >= chessboardRect.left && event.changedTouches[0].clientX <= chessboardRect.right && event.changedTouches[0].clientY >= chessboardRect.top && event.changedTouches[0].clientY <= chessboardRect.bottom) // 在棋盘范围内
                    {
                        const nearest_cell = cell_at(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
                        this.area = nearest_cell.area;
                    }
                    else
                    {
                        this.remove();
                    }
                }
            }

            piece.addEventListener("touchmove", ontouchmove, { passive: false });

            piece.addEventListener("touchend", ontouchend, { once: true });
        }, { passive: false });

        return piece;
    }

    remove()
    {
        this.piece.remove();
        delete this;
    }
}

// 步旅
class infantry extends Token
{
    constructor(area, color)
    {
        super("步旅", area, color, true, `url(https://lyc-sgs.oss-accelerate.aliyuncs.com/zq/Token/infantry_${color}.webp)`, '旅', (color === "Red") ? 'rgba(255, 100, 100, 0.8)' : 'rgba(100, 135, 255, 0.8)');
    }

    set area(value)
    {
        if (value instanceof Area)
        {
            // 步旅”只能进入校场（包括前锋校场）和平原地形。
            // “步旅”可以进入空区域、有己方角色的区域或仅有“步旅”的区域，不可以进入有敌方角色的区域。
            if ((value.terrain === "校场" || value.terrain === "前锋校场" || value.terrain === "平原") && !value.heroes.some(hero => hero.color !== this.color))
            {
                // 当一个己方“步旅”移动进入有敌方“步旅”的区域时，移除该区域的双方的各一个“步旅”。
                for (const token of value.tokens)
                {
                    if (token.name === "步旅" && token.color !== this.color)
                    {
                        token.remove();
                        this.remove();
                        return;
                    }
                }
                this._area = value;
                this._area.cell.appendChild(this.piece);
            }
            else
            {
                this._area.cell.appendChild(this.piece);
            }
        }
        else
        {
            this._area = null;
        }
    }

    get area()
    {
        return this._area;
    }

}

// 工厂函数
function create_token(name, area, creator)
{
    let token = null;
    switch (name)
    {
        case "稻草人":
            token = new Token(name, area, null, false, `url(https://lyc-sgs.oss-accelerate.aliyuncs.com/zq/Token/scarecrow.webp)`, '草', 'rgba(239, 238, 19, 0.8)');
            break;
        case "傀儡":
            token = new Token(name, area, creator.color, false, `url(https://lyc-sgs.oss-accelerate.aliyuncs.com/zq/Token/puppet.webp)`, '傀', 'rgba(255, 255, 255, 0.8)');
            break;
        case "步旅":
            token = new infantry(area, creator.color);
            break;
        default:
            token = new Token(name, area);
            break;
    }
    return token;
}

export { Token, create_token, infantry };