const cards = [];

function create_card(content)
{
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = content;

    // 添加鼠标事件
    card.addEventListener("mousedown", (event) =>
    {
        card.style.zIndex = 99;

        const card_rect = card.getBoundingClientRect();

        // var rotate_angle = 0;
        // if (card.style.transform.match(/rotate\((.*)deg\)/))
        // {
        //     rotate_angle = parseFloat(card.style.transform.match(/rotate\((.*)deg\)/)[1]) * Math.PI / 180;
        // }
        // const shiftX = _shiftX * Math.cos(rotate_angle) - _shiftY * Math.sin(rotate_angle);
        // const shiftY = _shiftY * Math.cos(rotate_angle) + _shiftX * Math.sin(rotate_angle);

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
        if (event.touches.length > 1)
        {
            return;
        }

        card.style.zIndex = 99;
        card.style.boxShadow = `0 0 8.8px 8.8px rgba(0, 0, 0, 0.10)`;

        const card_rect = card.getBoundingClientRect();

        var rotate_angle = 0;
        if (card.style.transform.match(/rotate\((.*)deg\)/))
        {
            rotate_angle = parseFloat(card.style.transform.match(/rotate\((.*)deg\)/)[1]) * Math.PI / 180;
        }

        const shiftX = event.touches[0].clientX - (card_rect.left + card_rect.right) / 2;
        const shiftY = event.touches[0].clientY - (card_rect.top + card_rect.bottom) / 2;

        card.style.transform = `rotate(0deg) translate(${shiftX}px, ${shiftY}px) scale(1.1)`;

        const ontouchmove = (event) =>
        {
            if (event.touches.length > 1)
            {
                return;
            }

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
            if (event.changedTouches.length > 1)
            {
                return;
            }

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
            card.style.transform = 'none';
            card.style.top = 'auto';
            card.style.bottom = `0px`;
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
            card.style.bottom = `${-Math.pow((i + 0.5 - n / 2), 2) * Math.min(200 / Math.pow(n, 2), 10)}px`;
        }
    }

}

!function init(n = 3)
{
    const hand = document.getElementById("hand");

    for (let i = 0; i < n; i++)
    {
        cards.push(create_card(i));
    }

    cards.forEach((card) =>
    {
        hand.appendChild(card);
    });

    arrange_cards();

    window.addEventListener("resize", arrange_cards);
    screen.orientation.addEventListener("change", () => setTimeout(arrange_cards, 100));

}(10);