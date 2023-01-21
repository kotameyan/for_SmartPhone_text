//*********************** id、グローバル変数定義 ***********************
const body_tag = document.querySelector("#body_tag");
const textarea_sentence = document.querySelector("#textarea_sentence");
const format_button = document.querySelector("#format_button");
const copy_button = document.querySelector("#copy_button");
const custom_button = document.querySelector("#custom_button");
const LINE_button = document.querySelector("#LINE_button");
const Teams_button = document.querySelector("#Teams_button");
const notification = document.querySelector("#notification");
const help_button = document.querySelector("#help_button");
const all_help_content = document.querySelectorAll(".help_content");
const help_icon = document.querySelector("#help_icon");

let help_open = false;
let changed_text = "none";
let service_name = "none";



//*********************** メソッド定義 ***********************
//通知を出すメソッド
function notification_on(input_sentence) {
    notification.textContent = input_sentence;
    notification.classList.add("slide");
    setTimeout(function () { notification.classList.remove("slide"); }, 2300);
}

// flask側のAPIを呼び出すメソッド
async function flaskAPI(root) {
    const response = await fetch(root);
    const data = await response.json();
    let js_variable = data.flask_variable;
    return js_variable;
}


//*********************** イベント定義 ***********************
// id:format_buttonのボタンを押すと、WEB上の文章をスマホ仕様に加工
format_button.addEventListener('click', async () => {
    if (service_name == "none") {
        notification_on("Error : 何のアプリの幅にするか設定して下さい");
    }
    else if (textarea_sentence.value == '') {
        notification_on("Error : テキストを入力して下さい");
    }
    else {
        // flask側のAPI使用
        changed_text = await flaskAPI(`/execution/${textarea_sentence.value}`);

        textarea_sentence.value = changed_text;
        textarea_sentence.classList.add("active");
        setTimeout(function () { textarea_sentence.classList.remove("active"); }, 200);
        notification_on("整形しました");
    }
});

// id:copy_buttonのボタンを押すと、クリップボードにコピー
copy_button.addEventListener('click', () => {
    if (textarea_sentence.value == "") {
        notification_on("Error : テキストを入力して下さい");
    }
    else {
        navigator.clipboard.writeText(textarea_sentence.value);
        textarea_sentence.classList.add("active");
        setTimeout(function () { textarea_sentence.classList.remove("active"); }, 200);
        notification_on("コピーしました");
    }
});

// 未実装
//id:custom_buttonのボタンを押すと、オリジナルの幅に変更
// custom_button.addEventListener('click', async () => {
//     // flask側のAPI使用
//     service_name = await flaskAPI("/service/switch/custom/10");

//     body_tag.classList.remove(...body_tag.classList);
//     body_tag.classList.add("custom");
//     notification_on(`${service_name} の幅に変更しました`);
// });

//id:LINE_buttonのボタンを押すと、LINE用の幅に変更
LINE_button.addEventListener('click', async () => {
    // flask側のAPI使用
    service_name = await flaskAPI("/service/switch/LINE");

    body_tag.classList.remove(...body_tag.classList);
    body_tag.classList.add("LINE");
    notification_on(`${service_name} の幅に変更しました`);
});

//id:Teams_buttonのボタンを押すと、Teams用の幅に変更
Teams_button.addEventListener('click', async () => {
    // flaskのAPI使用
    service_name = await flaskAPI("/service/switch/Teams");

    body_tag.classList.remove(...body_tag.classList);
    body_tag.classList.add("Teams");
    notification_on(`${service_name} の幅に変更しました`);
});

//id:help_buttonのボタンを押すと、ヘルプを出現 or 削除
help_button.addEventListener('click', () => {
    if (!help_open) {
        help_icon.src = "/static/icon/close.svg";
        all_help_content.forEach(function (help_content) {
            help_content.classList.add("active");
        });
        help_open = true;
    }
    else {
        help_icon.src = "/static/icon/help.svg";
        all_help_content.forEach(function (help_content) {
            help_content.classList.remove("active");
        });
        help_open = false;
    }
});
