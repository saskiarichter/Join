async function initSummary() {
    await includeHTML();
    summaryBg();
}

function summaryBg() {
    document.getElementById('summary').classList.add("bgfocus");
}



