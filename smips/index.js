var index = {};

const MAX_ITEMS = 10;

fetch('items.json')
    .then((response) => response.json())
    .then((json) => {
        index = convertToIndex(json);
        const items = index.slice(0, MAX_ITEMS);
        console.log(items);
        render(items);
    });

const ItemType = {
    "CONSUMABLE": "CONSUMABLE",
    "COMBAT_ITEM": "COMBAT_ITEM",
    "NON_COMBAT_ITEM": "NON_COMBAT_ITEM",
    "SUMMONING_ITEM": "SUMMONING_ITEM",
    "GAME_CHANGING_ITEM": "GAME_CHANGING_ITEM"
}

function convertToIndex(json) {
    console.log(json);
    let consumables = Object.entries(json.consumables).map(it => convertToItem(it, ItemType.CONSUMABLE));
    let combatItems = Object.entries(json.combatItems).map(it => convertToItem(it, ItemType.COMBAT_ITEM));
    let nonCombatItems = Object.entries(json.nonCombatItems).map(it => convertToItem(it, ItemType.NON_COMBAT_ITEM));
    let summoningItems = Object.entries(json.summoningItems).map(it => convertToItem(it, ItemType.SUMMONING_ITEM));
    let gamechangingItems = Object.entries(json.gamechangingItems).map(it => convertToItem(it, ItemType.GAME_CHANGING_ITEM));
    return consumables.concat(combatItems).concat(nonCombatItems).concat(summoningItems).concat(gamechangingItems);
}

function convertToItem(it, itemType) {
    return { 
        normalizedName: it[0].toLowerCase(),
        name: it[0],
        price: it[1], 
        type: itemType
    };
}

function find(query) {
    const tokens = query.split(/[\s,-]+/);
    return tokens.reduce((items, token) => {
        return items.filter(it => it.normalizedName.includes(token));
    }, index);
}

function onSearchChanged(event) {
    const query = event.target.value.toLowerCase();
    const found = find(query);
    const trimmed = found.slice(0, MAX_ITEMS);
    render(trimmed);
}

function render(items) {
    document.getElementById("content").innerHTML = createHtml(items);
}

function createHtml(items) {
    return `<table>
        <thead>
            <tr>
                <td>Name</td>
                <td>Price</td>
                <td>type</td>
            </tr>
        </thead>
        <tbody>
            ${items.map((item) => `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.price}</td>
                    <td>${item.type}</td>
                </tr>
            `).join("")}
        </tbody>
    </table>`;
}