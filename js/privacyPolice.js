async function init() {
    await includeHTML();
    privacyPoliceBg();
    await loadData();
    displayUserInitials();
}

async function initSignupPrivacy() {
    await includeHTML();
    privacyPoliceBg();
}


function privacyPoliceBg() {
    document.getElementById('privacyPolice').classList.add("bgfocus");
}