function init() {
    includeHTML();
}

async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}

function changeBg(clickedElement) {
    // Alle Links holen
    let links = document.querySelectorAll('.links, .linksNav');

    // Für jeden Link prüfen, ob er angeklickt wurde und die Klasse entsprechend hinzufügen/entfernen
    Array.from(links).forEach(link => {
        if (link === clickedElement.parentElement || link === clickedElement) {
            // Dem angeklickten Link die Klasse hinzufügen
            link.classList.add('bgfocus');
        } else {
            // Allen anderen Links die Klasse entfernen
            link.classList.remove('bgfocus');
        }
    });
}