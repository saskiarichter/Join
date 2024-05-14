async function init() {
    await includeHTML();
    privacyPoliceBg();
    await loadData();
    displayUserInitials();
}


function privacyPoliceBg() {
    document.getElementById('privacyPolice').classList.add("bgfocus");
}