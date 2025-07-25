// ==UserScript==
// @name         CeleScript - Shelter Selector
// @namespace    https://pokefarm.com/user/:L6k
// @version      2025-07-25
// @description  Select all Pokémon or Eggs in the Shelter based on the following criteria: Egg/Pokémon Species, Nature or Flavour Preference (if Pokémon), Gender (if Pokémon), Level (if Pokémon), Shiny or Albino or Melanistic (if Pokémon), Nickname (if Pokémon), Type, and/or by the person who donated it. You may select multiple Pokémon and/or Eggs, each by multiple criteria on an individual basis. The script will highlight the Pokémon (plural) or Eggs that match the criteria in the colour of your choice, which can be set in the settings. You can then shuffle through the highlighted Pokémon or Eggs by pressing the "m" key, then choose to adopt by hitting Enter twice. The script will also have persistent settings that will be saved across sessions and devices. This script is made by Cele, who is/was a member of the PokéFarm Q team at the time of writing. If you have any questions or need help, please send me a PM on PokéFarm. Enjoy!
// @author       Cele
// @match        https://pokefarm.com/shelter
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pokefarm.com
// @grant        none
// ==/UserScript==

'use strict';

// sekrits
const aypeeeye = new PFQAPI('');

// turn the PFQAPI library stuff on
aypeeeye.enable('lib-api');
aypeeeye.enable('lib-persistent-config');

// big ol map o natures
const NATURES = {
    All: 0, 
    Serious: 1, Lonely: 2, Adamant: 3, Naughty: 4, Brave: 5,
    Bold: 6, Hardy: 7, Impish: 8, Lax: 9, Relaxed: 10,
    Modest: 11, Mild: 12, Bashful: 13, Rash: 14, Quiet: 15,
    Calm: 16, Gentle: 17, Careful: 18, Docile: 19, Sassy: 20,
    Timid: 21, Hasty: 22, Jolly: 23, Naive: 24, Quirky: 25,
};
// alternate spelling for Naive because that word can't just be normal
NATURES[24] = ["Naive", "Naïve"];

// settings blahblahblah
const SETTINGSES = 'CeleScriptShelterSelectorSettings';

// we likes persistent config, yes we do
// if the persistent config doesn't exist, we go local
async function loadSettingses() {
    try {
        // persistent stuff pls
        const stored = await aypeeeye.config.get(SETTINGSES);
        if (stored) return stored;
        // rip, ok, do local
        const local = JSON.parse(localStorage.getItem(SETTINGSES));
        return local || { entries: [], highlightColor: '#d5e265' };
    } catch {
        return { entries: [], highlightColor: '#d5e265' };
    }
}

async function saveSettingses(settings) {
    // save persistent
    await aypeeeye.config.set(SETTINGSES, settings);
    // update local bc wynaut, fallbacks are neat
    localStorage.setItem(SETTINGSES, JSON.stringify(settings));
}

// insert my gd button! 
function gimmeSettingsesButtonses() {
    // wait for thingies to exist
    const commands = document.getElementById('sheltercommands');
    if (!commands) {
        setTimeout(gimmeSettingsesButtonses, 300);
        return;
    }

    // make the buttonses
    const btn = document.createElement('button');
    btn.title = 'CeleScript Settings';
    btn.style.background = 'none';
    btn.style.border = 'none';
    btn.style.padding = '0 8px 0 0';
    btn.style.margin = '0';
    btn.style.cursor = 'pointer';
    btn.style.display = 'flex';
    btn.style.alignItems = 'center';

    // draw a Cele in it
    const img = document.createElement('img');
    img.src = 'https://pokefarm.com/upload/:L6k/art/Cele_minisprite.png';
    img.alt = 'CeleScript Settings';
    img.style.height = '32px';
    img.style.verticalAlign = 'middle';
    img.style.display = 'block';

    btn.appendChild(img);

    btn.addEventListener('click', saySettingses);

    // make it the first baby 'cause it's the bestest
    commands.insertBefore(btn, commands.firstChild);
}

// settings stuff
async function saySettingses() {
    // eat old dialog
    const oldDialog = document.getElementById('cele-says');
    if (oldDialog) oldDialog.remove();

    const settings = await loadSettingses();

    const dialog = document.createElement('div');
    dialog.id = 'cele-says';
    dialog.className = 'cele-says';
    dialog.style.position = 'fixed';
    dialog.style.left = '50%';
    dialog.style.top = '50%';
    dialog.style.transform = 'translate(-50%, -50%)';
    dialog.style.background = '#222';
    dialog.style.color = '#fff';
    dialog.style.padding = '24px';
    dialog.style.borderRadius = '12px';
    dialog.style.zIndex = 10001;
    dialog.style.minWidth = '350px';
    dialog.style.boxShadow = '0 2px 16px #000a';

    dialog.innerHTML = `
        <h2 style="margin-top:0;">CeleScript Settings</h2>
        <label>Highlight Color: <input type="color" id="cele-colorpick" value="${settings.highlightColor}"></label>
        <hr>
        <div id="cele-picked"></div>
        <button id="cele-lick">Add Entry</button>
        <hr>
        <button id="cele-stash">Save</button>
        <button id="cele-binIt">Cancel</button>
    `;

    document.body.appendChild(dialog);

    // do the entry-makey thingy
    function spitOutEntries() {
        const entriesDiv = dialog.querySelector('#cele-picked');
        entriesDiv.innerHTML = '';
        settings.entries.forEach((entry, idx) => {
            const entryDiv = document.createElement('div');
            entryDiv.style.marginBottom = '8px';
            entryDiv.innerHTML = `
                <input type="text" placeholder="Species/Name" value="${entry.species || ''}" style="width:100px;">
                <input type="text" placeholder="Nature/Flavour" value="${entry.nature || ''}" style="width:90px;">
                <input type="text" placeholder="Gender" value="${entry.gender || ''}" style="width:60px;">
                <input type="text" placeholder="Level" value="${entry.level || ''}" style="width:50px;">
                <input type="text" placeholder="Type" value="${entry.type || ''}" style="width:70px;">
                <input type="text" placeholder="Donated By" value="${entry.donatedBy || ''}" style="width:90px;">
                <button data-idx="${idx}" class="cele-yeets">Remove</button>
            `;
            entriesDiv.appendChild(entryDiv);
        });

        // eat the entry
        entriesDiv.querySelectorAll('.cele-yeets').forEach(btn => {
            btn.onclick = function() {
                settings.entries.splice(Number(this.dataset.idx), 1);
                spitOutEntries();
            };
        });

        // update entry thingies
        entriesDiv.querySelectorAll('input').forEach((input, i) => {
            input.oninput = function() {
                const entryIdx = Math.floor(i / 6);
                const fieldIdx = i % 6;
                const fields = ['species', 'nature', 'gender', 'level', 'type', 'donatedBy'];
                settings.entries[entryIdx][fields[fieldIdx]] = this.value;
            };
        });
    }

    spitOutEntries();

    // add stuff
    dialog.querySelector('#cele-lick').onclick = function() {
        settings.entries.push({ species: '', nature: '', gender: '', level: '', type: '', donatedBy: '' });
        spitOutEntries();
    };

    // save stuff
    dialog.querySelector('#cele-stash').onclick = async function() {
        settings.highlightColor = dialog.querySelector('#cele-colorpick').value;
        await saveSettingses(settings);
        dialog.remove();
        highlightMatches();
    };

    // cancel stuff
    dialog.querySelector('#cele-binIt').onclick = function() {
        dialog.remove();
    };
}

// shelter parser for 'mons n eggs n stuff
function sniffTheMons(el) {
    // el is .tooltip_content[data-adopt] but like whatever let's go
    const shortlink = el.getAttribute('data-adopt');
    // grab them natures
    let natureNum = '';
    let natureStr = '';
    const pokeEl = el.previousElementSibling && el.previousElementSibling.classList.contains('pokemon')
        ? el.previousElementSibling
        : null;
    if (pokeEl) {
        natureNum = pokeEl.getAttribute('data-nature');
        if (natureNum) {
            const nat = NATURES[natureNum];
            if (Array.isArray(nat)) {
                natureStr = nat.join('|');
            } else {
                natureStr = nat || '';
            }
        }
    }
    // grab other stuff from tooltip
    const tooltipText = el.textContent || '';
    return {
        shortlink,
        species: (tooltipText.match(/^([^\(]+)/) || [,''])[1]?.trim(),
        nature: natureStr,
        gender: (tooltipText.match(/gender_([fm])/i) || [,''])[1] === 'f' ? 'Female' : ((tooltipText.match(/gender_([fm])/i) || [,''])[1] === 'm' ? 'Male' : ''),
        level: (tooltipText.match(/Lv\.\s*(\d+)/i) || [,''])[1],
        type: '', // add type parsing
        // dono's data will be attached in highlightMatches
    };
}

// entry matchy stuff with case-sensitive shortlink yadda yadda
function hasMatchyBits(data, entries) {
    return entries.some(entry => {
        // let users pick nature stuff or use numbers without case sensitivity
        let natureMatch = true;
        if (entry.nature) {
            const entryNature = entry.nature.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            const dataNature = (data.nature || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            natureMatch = dataNature.includes(entryNature);
        }
        // dono matchy... shortlink is case-sensitive, un is not
        let donorMatch = true;
        if (entry.donatedBy) {
            donorMatch =
                (data.donatedBy && data.donatedBy.toLowerCase().includes(entry.donatedBy.toLowerCase())) ||
                (data.donatedByShortlink && data.donatedByShortlink.includes(entry.donatedBy)) ||
                (data.donorError && data.donorError.toLowerCase().includes(entry.donatedBy.toLowerCase()));
        }
        return (!entry.species || data.species?.toLowerCase().includes(entry.species.toLowerCase()))
            && natureMatch
            && (!entry.gender || data.gender?.toLowerCase().includes(entry.gender.toLowerCase()))
            && (!entry.level || data.level?.toLowerCase().includes(entry.level.toLowerCase()))
            && (!entry.type || data.type?.toLowerCase().includes(entry.type.toLowerCase()))
            && donorMatch;
    });
}

// whomst the hecketh did the dono
let donoMappo = {};

async function gimmeDonoDeets() {
    const adoptEls = Array.from(document.querySelectorAll('#shelterarea .tooltip_content[data-adopt]'));
    const adoptIds = adoptEls.map(el => el.getAttribute('data-adopt')).filter(Boolean);
    if (adoptIds.length === 0) return;

    try {
        const response = await aypeeeye.get('/pokemon/shelter/donors', { adopts: adoptIds.join(',') });
        donoMappo = {};
        if (response && response.adopts) {
            response.adopts.forEach(entry => {
                donoMappo[entry.shortlink] = entry;
            });
        }
    } catch (e) {
        console.error('CeleScript: Error fetching donor data.', e);
    }
}

async function highlightMatches() {
    const settings = await loadSettingses();
    await gimmeDonoDeets();

    document.querySelectorAll('#shelterarea .pokemon').forEach(el => {
        el.style.outline = '';
        el.style.boxShadow = '';
        el.classList.remove('cele-points');
    });

    document.querySelectorAll('#shelterarea .tooltip_content[data-adopt]').forEach(el => {
        const data = sniffTheMons(el);
        // if I got dono data, yeet it in there
        const donor = donoMappo[data.shortlink];
        if (donor) {
            data.donatedBy = donor.user_name || '';
            data.donatedByShortlink = donor.user_shortlink || '';
            data.donorError = donor.error || '';
        }
        if (hasMatchyBits(data, settings.entries)) {
            // locate parent 'mon, do highlight things
            const pokeEl = el.previousElementSibling && el.previousElementSibling.classList.contains('pokemon')
                ? el.previousElementSibling
                : null;
            if (pokeEl) {
                pokeEl.style.outline = `3px solid ${settings.highlightColor}`;
                pokeEl.style.boxShadow = `0 0 10px 2px ${settings.highlightColor}`;
            }
        }
    });
}

// navigate via "m" key
let highlightyStuff = [];
let idRotato = -1;

function updateHighlightyBits() {
    highlightyStuff = Array.from(document.querySelectorAll('#shelterarea .pokemon')).filter(el =>
        el.style.outline && el.style.outline !== ''
    );
}

function nextHighlightyBit() {
    updateHighlightyBits();
    if (highlightyStuff.length === 0) return;
    idRotato = (idRotato + 1) % highlightyStuff.length;
    highlightyStuff.forEach(el => el.classList.remove('cele-points'));
    const el = highlightyStuff[idRotato];
    el.classList.add('cele-points');
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// do the actual highlighty stylin'
const drip = document.createElement('style');
drip.textContent = `
    .cele-points {
        outline: 4px solid #00eaff !important;
        box-shadow: 0 0 16px 4px #00eaff !important;
    }
    .cele-says input[type="text"] {
        background: #333; color: #fff; border: 1px solid #555; border-radius: 4px; padding: 2px 4px;
    }
    .cele-says button {
        background: #444; color: #fff; border: none; border-radius: 4px; padding: 4px 10px; margin-left: 4px;
    }
`;
document.head.appendChild(drip);

// if the shelter refreshes, do things again n make sure the old stuff is cleared out
const icu = new MutationObserver(() => {
    highlightMatches();
    updateHighlightyBits();
});
icu.observe(document.getElementById('shelterarea'), { childList: true, subtree: true });

// "m" button listener
document.addEventListener('keydown', e => {
    if (e.key.toLowerCase() === 'm' && !e.repeat) {
        nextHighlightyBit();
    }
});

window.addEventListener('load', () => {

    // listen for stuff to load, do things when loaded

    gimmeSettingsesButtonses();
    highlightMatches();
});

