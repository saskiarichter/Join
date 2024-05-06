async function init() {
    await includeHTML();
    legalNoticeBg();
    await loadData();
}


function legalNoticeBg() {
    document.getElementById('legalNotice').classList.add("bgfocus");
}