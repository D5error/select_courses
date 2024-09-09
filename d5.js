sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

function getCheckButton(){
    return document.getElementsByClassName("ant-btn ant-input-search-button ant-btn-primary ant-btn-two-chinese-chars")[0];
}

function getSelectButton(successNum){
    const selectButton = document.getElementsByClassName("stu-xk-bot-r-filtrate");
    if(selectButton.length){
        const btn = selectButton[successNum].getElementsByTagName("span")[0];
        return btn;
    }
    return selectButton;
}

function getRandom(min, max){
    min = parseInt(min)
    max = parseInt(max)
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getIKnownButton(){
    return document.getElementsByClassName("ant-btn ant-btn-primary")[2];
}

function getTime() {
    const time = new Date()
    const hour = time.getHours()
    const minute = time.getMinutes()
    const second = time.getSeconds()
    return hour + "点" + minute + "分" + second + "秒"
}

async function run(target, type, min, max){
    await sleep(1000)
    console.log("正在进入指定网页")
    type = parseInt(type)
    const btns = document.getElementsByClassName("ant-tag ant-tag-checkable");
    if(type === 1){
        btns[8].click()
    }
    else if(type === 2){
        btns[9].click()
    }
    else if(type === 3){
        btns[10].click()
    }
    else if(type === 4){
        btns[11].click()
    }
    else if(type === 5){
        btns[13].click()
    }
    else{
        console.error("type错误");
    }
    await sleep(8000);
    console.log("成功到达指定界面");
    const favi = document.getElementsByClassName("ant-checkbox-input")[3];
    favi.click();
    await sleep(2000);
    console.log("成功打开收藏")

    const targetNum = target;
    let successNum = 0;
    while(isRunning && successNum < targetNum){
        const checkButton = getCheckButton();
        checkButton.click();
        console.log("等待html刷新中...");
        await sleep(1500);  
        console.log("等待html完毕");

        const selectButton = getSelectButton(successNum);
        if(selectButton && selectButton.textContent === "选课"){
            selectButton.click();
            console.log("选！课！成！功！");
            await sleep(2000);
            const iKnownButton = getIKnownButton()
            iKnownButton.click()
            successNum += 1;
            if(successNum === targetNum){
                isRunning = true;
            }
        } else {
            console.log("没有发现任何选课按钮");
        }
        console.log("刷新选课界面成功，期望" + targetNum + "门课，目前已成功选上" + successNum + "门课");
        const randNum = getRandom(min, max);
        console.log("等待" + randNum + "秒后刷新选课界面，当前时间：" + getTime());
        await sleep(randNum * 1000); // 将随机秒数乘以1000转换为毫秒
        if(!isRunning){
            console.log("已停止运行");
        }
    }
} 

(function () {
    if (window.hasRun) {
        return;
    }
    console.log("select courses脚本加载成功");
    window.hasRun = true;
    isRunning = false;
    chrome.runtime.onMessage.addListener(async (message) => {
        if (message.command === "run") {
            console.log("已检测到运行指令，开始启动...")
            isRunning = true;
            run(message.targetNum, message.type, message.min, message.max);
        }
        else if (message.command === "stop"){
            console.log("已检测到暂停指令，准备停止...")
            isRunning = false;
        }
    });
})();
