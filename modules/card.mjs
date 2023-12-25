import { isHighlighting } from "./utils.mjs";

// 游戏牌类
class Card
{
    constructor(number = null, suit = null, name, name_fanti, color = null)
    {
        this.number = number;
        this.suit = suit;
        switch (suit)
        {
            case "黑桃":
                this.color = "黑";
                break;
            case "红桃":
                this.color = "红";
                break;
            case "梅花":
                this.color = "黑";
                break;
            case "方块":
                this.color = "红";
                break;
            default:
                this.color = color;
                break;
        }
        this._full_name = name;
        this._full_name_fanti = name_fanti;

        this.card_element = this._create_card();

        this._dragging = false; // 是否正在拖动
        this._focused = false; // 是否被选中
    }

    get name()
    {
        const left = this._full_name.indexOf("【");
        const right = this._full_name.indexOf("】");
        if (left === -1 || right === -1)
        {
            return this._full_name;
        }
        else
        {
            return this._full_name.substr(left + 1, right - left - 1);
        }
    }

    get name_fanti()
    {
        const left = this._full_name_fanti.indexOf("【");
        const right = this._full_name_fanti.indexOf("】");
        if (left === -1 || right === -1)
        {
            return this._full_name_fanti;
        }
        else
        {
            return this._full_name_fanti.substr(left + 1, right - left - 1);
        }
    }

    get attribute()
    {
        const left = this._full_name_fanti.indexOf("【");
        if (left !== 0)
        {
            return this._full_name.substr(0, left);
        }
        else
        {
            return null;
        }
    }

    get attribute_fanti()
    {
        const left = this._full_name_fanti.indexOf("【");
        if (left !== 0)
        {
            return this._full_name_fanti.substr(0, left);
        }
        else
        {
            return null;
        }
    }

    set focused(value)
    {
        if (this._focused === value) return;

        this._focused = value;
        if (value)
        {
            this.card_element.style.zIndex = 200;
            this.card_element.style.transform = this.card_element.style.transform + `scale(1.1)`;
            this.card_element.style.boxShadow = `0 0 8.8px 8.8px rgba(0, 0, 0, 0.10)`;
        }
        else
        {
            this.card_element.style.transform = this.card_element.style.transform.replace(/scale\(1\.1\)/, '');
            this.card_element.style.boxShadow = `0 0 8px 8px rgba(0, 0, 0, 0.10)`;

            if (this.zone === null) return;

            const index = this.zone.cards.indexOf(this.card_element);
            if (index !== -1)
            {
                this.card_element.style.zIndex = index;
            }
        }
    }

    get focused()
    {
        return this._focused;
    }

    set dragging(value)
    {
        if (this._dragging !== value)
        {
            this._dragging = value;
            if (value) // 开始拖动
            {
                this._old_zone = this.zone;
                this.card_element.style.transition = 'none';

                if (this.zone === null) return;
                this.zone.remove(this);
                document.body.appendChild(this.card_element);
            }
            else // 结束拖动
            {
                setTimeout(() => this.card_element.style.transition = "all 100ms ease-in-out", 100);
                this.card_element.style.left = null;
                this.card_element.style.top = null;

                this._old_zone = null;

                // 判断是否在手牌区
                const hand_zone = document.getElementById("hand-zone").zone;
                if (hand_zone.zone_element.style.display === "none") return;

                const zone_rect = hand_zone.zone_element.getBoundingClientRect();
                const card_rect = this.card_element.getBoundingClientRect();

                const X = (card_rect.left + card_rect.right) / 2
                const Y = (card_rect.top + card_rect.bottom) / 2

                if (X >= zone_rect.left && X <= zone_rect.right && Y >= zone_rect.top && Y <= zone_rect.bottom)
                {
                    console.log(X, zone_rect.left, zone_rect.right);
                    console.log(Y, zone_rect.top, zone_rect.bottom);
                    if (hand_zone.cards.length === 0)
                    {
                        hand_zone.add(this);
                    }
                    else
                    {
                        for (let i = 0; i < hand_zone.cards.length; i++)
                        {
                            const card_i_rect = hand_zone.cards[i].card_element.getBoundingClientRect();
                            const card_i_center = card_i_rect.left + 0.5 * card_i_rect.width;

                            if (i === 0 && X <= card_i_center)
                            {
                                hand_zone.add(this, 0);
                                break;
                            }
                            else if (i === hand_zone.cards.length - 1 && X >= card_i_center)
                            {
                                hand_zone.add(this, -1);
                                break;
                            }
                            else
                            {
                                const card_j_rect = hand_zone.cards[i + 1].card_element.getBoundingClientRect();
                                const card_j_center = card_j_rect.left + 0.5 * card_j_rect.width;

                                if (X >= card_i_center && X <= card_j_center)
                                {
                                    hand_zone.add(this, i + 1);
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    get dragging()
    {
        return this._dragging;
    }

    _create_card()
    {
        const card = document.createElement("div");
        card.className = "card";

        const card_info = document.createElement("div");
        card_info.className = "card-info";

        const card_number = document.createElement("span");
        card_number.className = "card-number";
        card_number.innerText = this.number;

        const card_color = document.createElement("span");
        card_color.className = "card-color";
        if (this.suit === "黑桃")
        {
            card_number.style.color = "#000000";
            card_color.style.color = "#000000";
            card_color.innerHTML = '♠';
        }
        else if (this.suit === "红桃")
        {
            card_number.style.color = "#ff2e2e";
            card_color.style.color = "#ff2e2e";
            card_color.innerHTML = '♥';
        }
        else if (this.suit === "梅花")
        {
            card_number.style.color = "#000000";
            card_color.style.color = "#000000";
            card_color.innerHTML = '♣';
        }
        else if (this.suit === "方块")
        {
            card_number.style.color = "#ff2e2e";
            card_color.style.color = "#ff2e2e";
            card_color.innerHTML = '♦';
        }
        else
        {
            card_color.innerHTML = ' ';
        }

        card_info.appendChild(card_number);
        card_info.appendChild(card_color);

        const card_name = document.createElement("span");
        card_name.className = "card-name";

        const left_bracket = document.createElement("span");
        left_bracket.className = "left-bracket";
        left_bracket.innerHTML = "【";

        const name_text = document.createElement("span");
        name_text.className = "card-name-text";

        const right_bracket = document.createElement("span");
        right_bracket.className = "right-bracket";
        right_bracket.innerHTML = "】";

        if (["射【殺】", "迅【閃】"].includes(this._full_name_fanti))
        {
            const prefix = document.createElement("span");
            prefix.className = "prefix";
            prefix.innerHTML = this.attribute_fanti;
            card_name.appendChild(prefix);

            left_bracket.style.fontSize = "1.2em";
            left_bracket.style.transform = "translateX(-0.15em)";

            name_text.style.fontSize = "1.5em";
            name_text.style.transform = "translateX(0.05em)";
            name_text.innerHTML = this.name_fanti;

            right_bracket.style.fontSize = "1.2em";
            right_bracket.style.transform = "translateX(-0.15em)";
        }
        else
        {
            if (this.name.length === 1)
            {
                name_text.style.fontSize = "1.8em";
                name_text.innerHTML = this.name_fanti;
            }
            else if (this.name.length === 2)
            {
                left_bracket.style.fontSize = "1.2em";
                left_bracket.style.transform = "translateX(-0.3em)";

                name_text.style.fontSize = "1.2em";
                name_text.style.transform = "translateX(-0.15em)";
                name_text.style.textWrap = "nowrap";
                name_text.innerHTML = this.name_fanti;

                right_bracket.style.fontSize = "1.2em";
                right_bracket.style.transform = "translateX(-0.1em)";
            }
            else if (this.name.length === 3)
            {
                left_bracket.style.fontSize = "0.8em";
                left_bracket.style.transform = "translateX(-0.3em)";

                name_text.style.fontSize = "0.9em";
                name_text.style.transform = "translateX(-0.4em)";
                name_text.style.textWrap = "nowrap";
                name_text.innerHTML = this.name_fanti;

                right_bracket.style.fontSize = "0.8em";
                right_bracket.style.transform = "translateX(0.2em)";
            }
            else if (this.name.length === 4)
            {
                name_text.style.fontSize = "0.9em";
                name_text.innerHTML = this.name_fanti;
            }
            else if (this.name.length === 5)
            {
                left_bracket.style.fontSize = "1.2em";
                left_bracket.style.transform = "translateX(-0.15em)";

                name_text.style.fontSize = "0.8em";
                name_text.style.width = "3em";
                name_text.style.textWrap = "nowrap";
                name_text.innerHTML = this.name_fanti.substr(0, 2) + "<br>" + this.name_fanti.substr(2, 3);

                right_bracket.style.fontSize = "1.2em";
                right_bracket.style.transform = "translateX(-0.3em)";
            }
        }

        card.appendChild(card_info);
        card_name.appendChild(left_bracket);
        card_name.appendChild(name_text);
        card_name.appendChild(right_bracket);
        card.appendChild(card_name);

        // 添加鼠标事件
        card.addEventListener("mousedown", (event) =>
        {
            // 正在等待响应
            if (isHighlighting()) return;

            if (event.cancelable) event.preventDefault();
            // event.stopPropagation();

            this.focused = true;

            const card_rect = card.getBoundingClientRect();

            const shiftX = event.clientX - (card_rect.left + card_rect.right) / 2;
            const shiftY = event.clientY - (card_rect.top + card_rect.bottom) / 2;

            card.style.transform = `rotate(0deg) translate(${shiftX}px, ${shiftY}px) scale(1.1)`;

            const onmousemove = (event) =>
            {
                if (event.cancelable) event.preventDefault();
                // event.stopPropagation();

                this.dragging = true;

                const card_rect = card.getBoundingClientRect();
                card.style.left = event.clientX - card_rect.width / 2 + window.scrollX + 'px';
                card.style.top = event.clientY - card_rect.height / 2 + window.scrollY + 'px';
            }

            const onmouseup = (event) =>
            {
                if (event.cancelable) event.preventDefault();
                event.stopPropagation();

                document.removeEventListener('mousemove', onmousemove);
                this.focused = false;

                if (!this.dragging) return;

                this.dragging = false;
            }

            document.addEventListener('mousemove', onmousemove);

            card.addEventListener('mouseup', onmouseup, { once: true });
        });

        card.addEventListener("mouseover", (event) =>
        {
            this.focused = true;
        });

        card.addEventListener("mouseout", (event) =>
        {
            this.focused = false;
        });

        // 添加触摸事件
        card.addEventListener("touchstart", (event) =>
        {
            if (event.touches.length > 1) return;

            // 正在等待响应
            if (isHighlighting()) return;

            if (event.cancelable) event.preventDefault();
            // event.stopPropagation();

            this.focused = true;

            const card_rect = card.getBoundingClientRect();

            const shiftX = event.touches[0].clientX - (card_rect.left + card_rect.right) / 2;
            const shiftY = event.touches[0].clientY - (card_rect.top + card_rect.bottom) / 2;

            card.style.transform = `rotate(0deg) translate(${shiftX}px, ${shiftY}px) scale(1.1)`;

            const ontouchmove = (event) =>
            {
                if (event.touches.length > 1) return;

                if (event.cancelable) event.preventDefault();
                // event.stopPropagation();

                this.dragging = true;

                const card_rect = card.getBoundingClientRect();
                card.style.left = event.touches[0].clientX - card_rect.width / 2 + window.scrollX + 'px';
                card.style.top = event.touches[0].clientY - card_rect.height / 2 + window.scrollY + 'px';
            }

            const ontouchend = (event) =>
            {
                if (event.changedTouches.length > 1) return;

                if (event.cancelable) event.preventDefault();
                event.stopPropagation();

                document.removeEventListener("touchmove", ontouchmove);
                this.focused = false;

                if (!this.dragging) return;

                this.dragging = false;
            }

            document.addEventListener("touchmove", ontouchmove, { passive: false });

            card.addEventListener("touchend", ontouchend, { once: true });
        }, { passive: false });

        return card;
    }
}

// 工厂函数
function create_card(number = null, suit = null, name, name_fanti, color = null)
{
    return new Card(number, suit, name, name_fanti, color);
}

export { Card, create_card };