async function init() {
    await includeHTML();
    privacyPoliceBg();
}


function privacyPoliceBg() {
    document.getElementById('privacyPolice').classList.add("bgfocus");
}