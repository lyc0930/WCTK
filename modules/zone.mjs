import { Card } from './card.mjs';

// 区域类
class Zone
{
    constructor()
    {
        this._cards = [];
    }

    get cards()
    {
        return this._cards;
    }

    add(value, index = -1)
    {
        if (value instanceof Card)
        {
            value.zone = this;
            if (index === -1)
            {
                this.cards.push(value);
                this.zone_element.appendChild(value.card_element);
            }
            else
            {
                this.cards.splice(index, 0, value);
                this.zone_element.insertBefore(value.card_element, this.zone_element.children[index]);
            }
        }
        else if (value instanceof Array)
        {
            for (const card of value)
            {
                this.add(card, index);
            }
        }
        else
        {
            throw new Error("Invalid value type");
        }
    }

    remove(card)
    {
        card.zone = null;
        const index = this.cards.indexOf(card);
        if (index >= 0)
        {
            this.cards.splice(index, 1);
            this.zone_element.removeChild(card.card_element);
        }
    }

    remove_all()
    {
        for (const card of this.cards)
        {
            this.remove(card);
        }
    }

}

class Hand_Zone extends Zone
{
    constructor(zone_element)
    {
        super();
        this.zone_element = zone_element;
        zone_element.zone = this;

        window.addEventListener("resize", this.arrange);
        screen.orientation.addEventListener("change", () => setTimeout(this.arrange, 100));
    }

    get cards()
    {
        return this.hero.hand;
    }

    get length()
    {
        return this.cards.length;
    }

    add(value, index = -1)
    {
        super.add(value, index);
        this.arrange();
    }

    remove(card)
    {
        super.remove(card);
        this.arrange();
    }

    hide()
    {
        for (const card of this.cards)
        {
            card.zone = null;
        }
        this.hero = null;
        this.zone_element.innerHTML = "";
        this.zone_element.style.display = "none";
    }

    show(hero)
    {
        this.hero = hero;

        for (const card of this.cards)
        {
            card.zone = this;
            this.zone_element.appendChild(card.card_element);
        }

        this.zone_element.style.display = "block";
        this.arrange();
    }

    arrange()
    {
        if (this.cards.length === 0) return;

        const hand_rect = this.zone_element.getBoundingClientRect();
        const card_style = window.getComputedStyle(this.cards[0].card_element);
        const card_width = 2 / 3 * parseFloat(card_style.height) + 2 * parseFloat(card_style.borderWidth);
        const card_margin = 10;

        const n = this.cards.length;

        if (hand_rect.width >= n * card_width + (n - 1) * card_margin)
        {
            for (let i = 0; i < n; i++)
            {
                const card = this.cards[i].card_element;
                card.style.zIndex = i;
                card.style.transform = '';
                card.style.top = 'auto';
                card.style.bottom = `10px`;
            }

            if (n % 2 === 0)
            {
                for (let i = 0; i < n / 2; i++)
                {
                    const card1 = this.cards[i].card_element;
                    card1.style.left = (hand_rect.width / 2 - ((n / 2) - i) * (card_width + card_margin)) + 'px';

                    const card2 = this.cards[n - i - 1].card_element;
                    card2.style.left = (hand_rect.width / 2 + ((n / 2) - i - 1) * (card_width + card_margin)) + 'px';
                }
            }
            else
            {
                for (let i = 0; i < n / 2; i++)
                {
                    const card1 = this.cards[i].card_element;
                    card1.style.left = (hand_rect.width / 2 - (parseInt(n / 2) - i + 0.5) * (card_width + card_margin)) + 'px';

                    const card2 = this.cards[n - i - 1].card_element;
                    card2.style.left = (hand_rect.width / 2 + (parseInt(n / 2) - i - 0.5) * (card_width + card_margin)) + 'px';
                }
            }
        }
        else
        {
            const interval = (hand_rect.width - card_width - 4) / (n - 1);
            for (let i = 0; i < n; i++)
            {
                const card = this.cards[i].card_element;
                card.style.left = (i * interval + 2) + 'px';
                card.style.zIndex = i;
                card.style.transform = `rotate(${(i + 0.5 - n / 2) * Math.min(60 / n, 10)}deg)`;
                card.style.top = 'auto';
                card.style.bottom = `${card_margin - Math.pow((i + 0.5 - n / 2), 2) * Math.min(1.5 * card_style.height / Math.pow(n, 2), card_margin)}px`;
            }
        }
    }
}

// 工厂函数
function create_zone(type)
{
    switch (type)
    {
        case "hand":
            const hand_zone = document.getElementById("hand-zone");
            return new Hand_Zone(hand_zone);
        default:
            return new Zone();
    }
}

export { create_zone };