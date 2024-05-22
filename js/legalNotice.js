async function init() {
    await includeHTML();
    legalNoticeBg();
    await loadData();
    displayUserInitials();
}

async function initSignupLegal() {
    await includeHTML();
    legalNoticeBg();
}


function legalNoticeBg() {
    document.getElementById('legalNotice').classList.add("bgfocus");
}