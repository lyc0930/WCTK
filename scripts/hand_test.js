import { DECK } from "../modules/data.mjs";

const cards = [];

function create_card(content)
{
    const card = document.createElement("div");
    card.className = "card";

    const card_info = document.createElement("div");
    card_info.className = "card-info";

    const card_number = document.createElement("span");
    card_number.className = "card-number";
    card_number.innerText = content.number;

    const card_color = document.createElement("span");
    card_color.className = "card-color";
    if (content.color === "黑桃")
    {
        card_number.style.color = "#000000";
        card_color.style.color = "#000000";
        card_color.innerHTML = '♠';
    }
    else if (content.color === "红桃")
    {
        card_number.style.color = "#ff2e2e";
        card_color.style.color = "#ff2e2e";
        card_color.innerHTML = '♥';
    }
    else if (content.color === "梅花")
    {
        card_number.style.color = "#000000";
        card_color.style.color = "#000000";
        card_color.innerHTML = '♣';
    }
    else if (content.color === "方块")
    {
        card_number.style.color = "#ff2e2e";
        card_color.style.color = "#ff2e2e";
        card_color.innerHTML = '♦';
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

    if (["射【殺】", "迅【閃】"].includes(content.fanti))
    {
        const prefix = document.createElement("span");
        prefix.className = "prefix";
        prefix.innerHTML = content.fanti.substr(0, 1);
        card_name.appendChild(prefix);

        left_bracket.style.fontSize = "1.2em";
        left_bracket.style.transform = "translateX(-0.15em)";

        name_text.style.fontSize = "1.5em";
        name_text.style.transform = "translateX(0.05em)";
        name_text.innerHTML = content.fanti.substr(2, 1);

        right_bracket.style.fontSize = "1.2em";
        right_bracket.style.transform = "translateX(-0.15em)";
    }
    else
    {
        const text = content.fanti.substr(1, content.fanti.length - 2);
        if (text.length === 1)
        {
            name_text.style.fontSize = "1.8em";
            name_text.innerHTML = text;
        }
        else if (text.length === 2)
        {
            left_bracket.style.fontSize = "1.2em";
            left_bracket.style.transform = "translateX(-0.3em)";

            name_text.style.fontSize = "1.2em";
            name_text.style.transform = "translateX(-0.15em)";
            name_text.style.textWrap = "nowrap";
            name_text.innerHTML = text;

            right_bracket.style.fontSize = "1.2em";
            right_bracket.style.transform = "translateX(-0.1em)";
        }
        else if (text.length === 3)
        {
            left_bracket.style.fontSize = "0.8em";
            left_bracket.style.transform = "translateX(-0.3em)";

            name_text.style.fontSize = "0.9em";
            name_text.style.transform = "translateX(-0.4em)";
            name_text.style.textWrap = "nowrap";
            name_text.innerHTML = text;

            right_bracket.style.fontSize = "0.8em";
            right_bracket.style.transform = "translateX(0.2em)";
        }
        else if (text.length === 4)
        {
            name_text.style.fontSize = "0.9em";
            name_text.innerHTML = text;
        }
        else if (text.length === 5)
        {
            left_bracket.style.fontSize = "1.2em";
            left_bracket.style.transform = "translateX(-0.15em)";

            name_text.style.fontSize = "0.8em";
            name_text.style.width = "3em";
            name_text.style.textWrap = "nowrap";
            name_text.innerHTML = text.substr(0, 2) + "<br>" + text.substr(2, 3);

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
        card.style.zIndex = 99;

        const card_rect = card.getBoundingClientRect();

        const shiftX = event.clientX - (card_rect.left + card_rect.right) / 2;
        const shiftY = event.clientY - (card_rect.top + card_rect.bottom) / 2;

        card.style.transform = `rotate(0deg) translate(${shiftX}px, ${shiftY}px) scale(1.1)`;

        const onmousemove = (event) =>
        {
            if (event.cancelable) event.preventDefault();
            if (!card.dragging)
            {
                card.dragging = true;
                card.style.transition = 'none';
                card.style.transform = 'scale(1.1)';
                const index = cards.indexOf(card);
                if (index !== -1)
                {
                    cards.splice(index, 1);
                    document.body.appendChild(card);
                }
            }
            arrange_cards();
            const card_rect = card.getBoundingClientRect();
            card.style.left = event.clientX - card_rect.width / 2 + window.scrollX + 'px';
            card.style.top = event.clientY - card_rect.height / 2 + window.scrollY + 'px';
        }

        const onmouseup = (event) =>
        {
            document.removeEventListener('mousemove', onmousemove);

            if (card.dragging)
            {
                if (event.cancelable) event.preventDefault();
                card.dragging = false;

                // 判断是否在手牌区
                const hand = document.getElementById("hand");
                const hand_rect = hand.getBoundingClientRect();

                if (event.clientX >= hand_rect.left && event.clientX <= hand_rect.right && event.clientY >= hand_rect.top && event.clientY <= hand_rect.bottom)
                {
                    hand.appendChild(card);
                    if (cards.length === 0)
                    {
                        cards.push(card);
                    }
                    else
                    {
                        for (let i = 0; i < cards.length; i++)
                        {
                            const card_i_rect = cards[i].getBoundingClientRect();
                            const card_i_center = card_i_rect.left + 0.5 * card_i_rect.width;

                            if (i === 0 && event.clientX <= card_i_center)
                            {
                                cards.splice(0, 0, card);
                                break;
                            }
                            else if (i === cards.length - 1 && event.clientX >= card_i_center)
                            {
                                cards.push(card);
                                break;
                            }
                            else
                            {
                                const card_j_rect = cards[i + 1].getBoundingClientRect();
                                const card_j_center = card_j_rect.left + 0.5 * card_j_rect.width;

                                if (event.clientX >= card_i_center && event.clientX <= card_j_center)
                                {
                                    cards.splice(i + 1, 0, card);
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            arrange_cards();
            setTimeout(() => card.style.transition = "all 100ms ease-in-out", 100);
        }

        document.addEventListener('mousemove', onmousemove);

        card.addEventListener('mouseup', onmouseup, { once: true });
    });

    card.addEventListener("mouseover", (event) =>
    {
        card.style.zIndex = 99;
        card.style.transform = card.style.transform + `scale(1.1)`;
        card.style.boxShadow = `0 0 8.8px 8.8px rgba(0, 0, 0, 0.10)`;
    });

    card.addEventListener("mouseout", (event) =>
    {
        const index = cards.indexOf(card);
        if (index !== -1)
        {
            card.style.zIndex = index;
        }
        card.style.transform = card.style.transform.replace(/scale\(1\.1\)/, '');
        card.style.boxShadow = `0 0 8px 8px rgba(0, 0, 0, 0.10)`;
    });

    // 添加触摸事件
    card.addEventListener("touchstart", (event) =>
    {
        if (event.touches.length > 1) return;

        card.style.zIndex = 99;
        card.style.boxShadow = `0 0 8.8px 8.8px rgba(0, 0, 0, 0.10)`;

        const card_rect = card.getBoundingClientRect();

        const shiftX = event.touches[0].clientX - (card_rect.left + card_rect.right) / 2;
        const shiftY = event.touches[0].clientY - (card_rect.top + card_rect.bottom) / 2;

        card.style.transform = `rotate(0deg) translate(${shiftX}px, ${shiftY}px) scale(1.1)`;

        const ontouchmove = (event) =>
        {
            if (event.touches.length > 1) return;

            if (event.cancelable) event.preventDefault();
            if (!card.dragging)
            {
                card.dragging = true;
                card.style.transition = 'none';
                card.style.transform = 'scale(1.1)';
                const index = cards.indexOf(card);
                if (index !== -1)
                {
                    cards.splice(index, 1);
                    document.body.appendChild(card);
                }
            }
            arrange_cards();
            const card_rect = card.getBoundingClientRect();
            card.style.left = event.touches[0].clientX - card_rect.width / 2 + window.scrollX + 'px';
            card.style.top = event.touches[0].clientY - card_rect.height / 2 + window.scrollY + 'px';
        }

        const ontouchend = (event) =>
        {
            if (event.changedTouches.length > 1) return;

            card.removeEventListener("touchmove", ontouchmove);

            if (card.dragging)
            {
                if (event.cancelable) event.preventDefault();
                card.dragging = false;

                // 判断是否在手牌区
                const hand = document.getElementById("hand");
                const hand_rect = hand.getBoundingClientRect();

                if (event.changedTouches[0].clientX >= hand_rect.left && event.changedTouches[0].clientX <= hand_rect.right && event.changedTouches[0].clientY >= hand_rect.top && event.changedTouches[0].clientY <= hand_rect.bottom)
                {
                    hand.appendChild(card);
                    if (cards.length === 0)
                    {
                        cards.push(card);
                    }
                    else
                    {
                        for (let i = 0; i < cards.length; i++)
                        {
                            const card_i_rect = cards[i].getBoundingClientRect();
                            const card_i_center = card_i_rect.left + 0.5 * card_i_rect.width;

                            if (i === 0 && event.changedTouches[0].clientX <= card_i_center)
                            {
                                cards.splice(0, 0, card);
                                break;
                            }
                            else if (i === cards.length - 1 && event.changedTouches[0].clientX >= card_i_center)
                            {
                                cards.push(card);
                                break;
                            }
                            else
                            {
                                const card_j_rect = cards[i + 1].getBoundingClientRect();
                                const card_j_center = card_j_rect.left + 0.5 * card_j_rect.width;

                                if (event.changedTouches[0].clientX >= card_i_center && event.changedTouches[0].clientX <= card_j_center)
                                {
                                    cards.splice(i + 1, 0, card);
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            card.style.boxShadow = `0 0 8px 8px rgba(0, 0, 0, 0.10)`;
            arrange_cards();
            setTimeout(() => card.style.transition = "all 100ms ease-in-out", 100);
        }

        card.addEventListener("touchmove", ontouchmove, { passive: false });

        card.addEventListener("touchend", ontouchend, { once: true });
    }, { passive: false });

    return card;
}

function arrange_cards()
{
    if (cards.length === 0) return;

    const hand = document.getElementById("hand");
    const hand_rect = hand.getBoundingClientRect();
    const card_style = window.getComputedStyle(cards[0]);
    const card_width = parseFloat(card_style.width) + 2 * parseFloat(card_style.borderWidth);
    const card_margin = 10;

    const n = cards.length;

    if (hand_rect.width >= n * card_width + (n - 1) * card_margin)
    {
        for (let i = 0; i < n; i++)
        {
            const card = cards[i];
            card.style.zIndex = i;
            card.style.transform = '';
            card.style.top = 'auto';
            card.style.bottom = `10px`;
        }

        if (n % 2 === 0)
        {
            for (let i = 0; i < n / 2; i++)
            {
                const card1 = cards[i];
                card1.style.left = (hand_rect.width / 2 - ((n / 2) - i) * (card_width + card_margin)) + 'px';

                const card2 = cards[n - i - 1];
                card2.style.left = (hand_rect.width / 2 + ((n / 2) - i - 1) * (card_width + card_margin)) + 'px';

            }
        }
        else
        {
            for (let i = 0; i < n / 2; i++)
            {
                const card1 = cards[i];
                card1.style.left = (hand_rect.width / 2 - (parseInt(n / 2) - i + 0.5) * (card_width + card_margin)) + 'px';

                const card2 = cards[n - i - 1];
                card2.style.left = (hand_rect.width / 2 + (parseInt(n / 2) - i - 0.5) * (card_width + card_margin)) + 'px';
            }
        }
    }
    else
    {
        const interval = (hand_rect.width - card_width - 4) / (n - 1);
        for (let i = 0; i < n; i++)
        {
            const card = cards[i];
            card.style.left = (i * interval + 2) + 'px';
            card.style.zIndex = i;
            card.style.transform = `rotate(${(i + 0.5 - n / 2) * Math.min(60 / n, 10)}deg)`;
            card.style.top = 'auto';
            card.style.bottom = `${10 -Math.pow((i + 0.5 - n / 2), 2) * Math.min(200 / Math.pow(n, 2), 10)}px`;
        }
    }

}

!function init(n = 3)
{
    const hand = document.getElementById("hand");
    for (let i = 0; i < n; i++)
    {
        let index = Math.floor(Math.random() * (DECK.length - i));
        cards.push(create_card(DECK[index]));
    }

    cards.forEach((card) =>
    {
        hand.appendChild(card);
    });

    arrange_cards();

    window.addEventListener("resize", arrange_cards);
    screen.orientation.addEventListener("change", () => setTimeout(arrange_cards, 100));

}(10);