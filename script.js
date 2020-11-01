var makePaperClip = document.getElementById("btnMakePaperclip");
var btnBuyWire = document.getElementById("btnBuyWire");
var btnAddProc = document.getElementById("btnAddProc");
var btnAddMem = document.getElementById("btnAddMem");
function botLoop () {
    makePaperClip.click();
    
    if (wire < 1000) {
        btnBuyWire.click();
    }

    if (btnAddProc.disabled) {
        if (processors < 6) {
            btnAddProc.click();
        } else if (memory < 30) {
            btnAddMem.click();
        } else if (processors <= memory) {
            btnAddProc.click();
        } else {
            btnAddMem.click();
        }
    }
}

var timeout = 10;
if (window.runId) {
    clearInterval(runId);
}
setInterval(botLoop, timeout);