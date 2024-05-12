async function init() {
    await includeHTML();
    privacyPoliceBg();
    await loadData();
}


function privacyPoliceBg() {
    document.getElementById('privacyPolice').classList.add("bgfocus");
}