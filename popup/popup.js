function listenForClicks() {
    document.addEventListener("click", (e) => {
        function setRun(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {
                command: "run",
                type: selectedType,
                targetNum: targetNum,
                min: minTime,
                max: maxTime
            });
        }

        function setStop(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {
                command: "stop"
            });
        }

        function reportError(error) {
            console.error(`发生错误了: ${error}`);
        }

        if (e.target.tagName !== "BUTTON") {
            return;
        }
        
        if (e.target.id === "run") {            
            targetNum = document.getElementById("input").value
            minTime = document.getElementById("min").value
            maxTime = document.getElementById("max").value
            selectedType = document.querySelector('input[name="type"]:checked').value;
            if(targetNum === "" || minTime === "" || maxTime === ""){
                console.error("数据没写完整")
                document.body.className = "error"
            }
            else{ 
                document.body.className = "yes"
                console.log("成功点击了run按钮");
                chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                    if (chrome.runtime.lastError) {
                        reportError(chrome.runtime.lastError);
                    } else {
                        setRun(tabs);
                    }
                });                
            }
        } 
        else if (e.target.id === "stop"){
            console.log("检测到了stop")
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                if(chrome.runtime.lastError) {
                    reportError(chrome.runtime.lastError);
                }
                else {
                    setStop(tabs);
                }
            });
        }
    });
}

function reportExecuteScriptError(error) {
    console.error(`发生错误了: ${error.message}`);
}


chrome.tabs.executeScript({
    file: "d5.js"
}, (result) => {
    if (chrome.runtime.lastError) {
        console.error(`发生错误: ${chrome.runtime.lastError.message}`);
    } else {
        console.log("脚本注入成功");
        listenForClicks();
    }
});