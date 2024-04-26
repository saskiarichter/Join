async function init() {
    await includeHTML();
    legalNoticeBg();
}


function legalNoticeBg() {
    document.getElementById('legalNotice').classList.add("bgfocus");
}