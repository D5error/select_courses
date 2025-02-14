// 菜单中的选课按钮
function getXuanKeButton() {
    return document.getElementsByClassName("ant-tag ant-tag-checkable")[0];
}

// 校级公选按钮
function getGongXuanButton() {
    return document.getElementsByClassName("ant-tag ant-tag-checkable")[8];
}

// 跨专业按钮
function getKuaZhuanYeButton() {
    return document.getElementsByClassName("ant-tag ant-tag-checkable")[9];
}
// 本专业-专必按钮
function getZhuanBiButton() {
    return document.getElementsByClassName("ant-tag ant-tag-checkable")[10];
}

// 本专业-专选按钮
function getZhuanXuanButton() {
    return document.getElementsByClassName("ant-tag ant-tag-checkable")[11];
}

// 本专业-公必（体育）按钮
function getTiYuButton() {
    return document.getElementsByClassName("ant-tag ant-tag-checkable")[13]; 
}

// 收藏按钮
function getShouCangButton() {
    return document.getElementsByClassName("ant-checkbox-input")[3]; 
}
// 查询按钮
function getCheckButton(){
    return document.getElementsByClassName("ant-btn ant-input-search-button ant-btn-primary ant-btn-two-chinese-chars")[0]; 
}

// 抢课按钮
function getSelectButton(successNum){
    const selectButton = document.getElementsByClassName("stu-xk-bot-r-filtrate");
    if(selectButton.length){
        const btn = selectButton[successNum].getElementsByTagName("span")[0];
        return btn;
    }
    return selectButton;
}

// 选课成功后的"我知道了"按钮
function getIKnownButton(){
    return document.getElementsByClassName("ant-btn ant-btn-primary")[2];
}

// 生成随机数
function getRandom(min, max){
    min = parseInt(min)
    max = parseInt(max)
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// 获取当前时间
function getTime() {
    const time = new Date()
    const hour = time.getHours()
    const minute = time.getMinutes()
    const second = time.getSeconds()
    return hour + "点" + minute + "分" + second + "秒"
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////


sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

// 选课主逻辑
async function run(target, type, min, max){
    await sleep(1000)



    // 点击选课菜单按钮
    getXuanKeButton().click();
    await sleep(1000)



    // 点击对应的课程类别按钮
    type = parseInt(type)
    switch (type) {
        case 1: 
            getGongXuanButton().click()
            break;
        case 2:
            getKuaZhuanYeButton().click()
            break;
        case 3:
            getZhuanBiButton().click()
            break;
        case 4:
            getZhuanXuanButton().click()
            break;
        case 5:
            getTiYuButton().click()
            break;
        default:
            console.error("type错误");    
    }
    await sleep(2000);
    
    

    // 点击收藏按钮
    console.log("打开只显示收藏")
    getShouCangButton().click();
    await sleep(2000);



    const targetNum = target; // 期望的选课数量
    let successNum = 0; // 已成功选课数量
    while(isRunning && successNum < targetNum){
        getCheckButton().click();
        await sleep(1500);  

        const selectButton = getSelectButton(successNum);
        if(selectButton && selectButton.textContent === "选课"){
            selectButton.click();
            console.log("选！课！成！功！");
            await sleep(2000);
            const iKnownButton = getIKnownButton()
            iKnownButton.click()
            successNum += 1;
            if(successNum === targetNum){
                isRunning = false;
            }
        }

        console.log("刷新选课界面成功，期望" + targetNum + "门课，目前已成功选上" + successNum + "门课");
        const randNum = getRandom(min, max);
        console.log("等待" + randNum + "秒后刷新选课界面：" + getTime());
        await sleep(randNum * 1000); // 将随机秒数乘以1000转换为毫秒
        if(!isRunning){
            console.log("运行结束");
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
            console.log("启动插件...")
            isRunning = true;
            run(message.targetNum, message.type, message.min, message.max);
        }
        else if (message.command === "stop"){
            console.log("停止插件...")
            isRunning = false;
        }
    });
})();
