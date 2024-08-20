function listenForClicks() {
    document.addEventListener("click", (e) => {
        function setRun(tabs){
            browser.tabs.sendMessage(tabs[0].id, {
                command: "run",
                type: selectedType,
                targetNum: targetNum,
                min: minTime,
                max: maxTime
            });
        }

        function setStop(tabs){
            browser.tabs.sendMessage(tabs[0].id, {
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
                console.log("成功点击了run按钮")
                browser.tabs.query({ active: true, currentWindow: true })
                    .then(setRun)
                    .catch(reportError);
            }
        } 
        else if (e.target.id === "stop"){
            console.log("检测到了stop")
            browser.tabs.query({ active: true, currentWindow: true })
                .then(setStop)
                .catch(reportError);
        }
    });
}

function reportExecuteScriptError(error) {
    console.error(`发生错误了: ${error.message}`);
}

browser.tabs.executeScript({ file: "/d5.js" })
    .then(listenForClicks)
    .catch(reportExecuteScriptError);
