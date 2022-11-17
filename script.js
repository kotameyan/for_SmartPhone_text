//*********************** id、グローバル変数定義 ***********************
const body_tag = document.querySelector("#body_tag");
const textarea_sentence = document.querySelector("#textarea_sentence");
const format_button = document.querySelector("#format_button");
const copy_button = document.querySelector("#copy_button");
const LINE_button = document.querySelector("#LINE_button");
const Teams_button = document.querySelector("#Teams_button");
const notification = document.querySelector("#notification");
const help_button = document.querySelector("#help_button");
const all_help_content = document.querySelectorAll(".help_content");
const help_icon = document.querySelector("#help_icon");

let service = {
    name: 'none',
    sentence_width: 0
}
let help_open = false;


//*********************** メソッド定義 ***********************
// 半角判定をするメソッド
function isHankaku(value) {
    return !value.match(/[^\x01-\x7E]/) || !value.match(/[^\uFF65-\uFF9F]/);
}

// 文章を渡すと、スマホ版の幅に合わせた文章に変えて返すメソッド
function create_LINE_sentence(input_sentence, sentence_width) {
    let result_sentence = '';
    let count_sentence = 0;
    let count_row = 0;

    while (count_sentence < input_sentence.length) {
        if (input_sentence[count_sentence] != '\n') {
            result_sentence += input_sentence[count_sentence];
            if (isHankaku(input_sentence[count_sentence])) {
                count_sentence++;
                count_row = count_row + 0.5;
            }
            else {
                count_sentence++;
                count_row++;
            }
        }
        else {
            result_sentence += input_sentence[count_sentence];
            count_sentence++;
            count_row = 0;
        }

        if (count_row >= sentence_width && input_sentence[count_sentence] != '\n') {
            result_sentence += '\n';
            count_row = 0;
        }
    }

    return result_sentence;
}

//通知を出すメソッド
function notification_on(input_sentence) {
    notification.textContent = input_sentence;
    notification.classList.add("slide");
    setTimeout(function () { notification.classList.remove("slide"); }, 2300);
}


//*********************** イベント定義 ***********************
// id:format_buttonのボタンを押すと、WEB上の文章をLINE仕様の文章に加工
format_button.addEventListener('click', () => {
    if (service.name == "none") {
        notification_on("Error : 何のアプリの幅にするか設定して下さい");
    }
    else if (textarea_sentence.value == '') {
        notification_on("Error : テキストを入力して下さい");
    }
    else {
        textarea_sentence.value = create_LINE_sentence(textarea_sentence.value, service.sentence_width);
        textarea_sentence.classList.add("active");
        setTimeout(function () { textarea_sentence.classList.remove("active"); }, 200);
        notification_on(`スマホ版 ${service.name} 用に整形しました`);
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

//id:LINE_buttonのボタンを押すと、LINE用の幅に変更
LINE_button.addEventListener('click', () => {
    service.name = 'LINE';
    service.sentence_width = 17;
    body_tag.classList.remove(...body_tag.classList);
    body_tag.classList.add("LINE");
    notification_on(`${service.name} 用の幅に変更しました`);
});

//id:Teams_buttonのボタンを押すと、Teams用の幅に変更
Teams_button.addEventListener('click', () => {
    service.name = 'Teams';
    service.sentence_width = 18;
    body_tag.classList.remove(...body_tag.classList);
    body_tag.classList.add("Teams");
    notification_on(`${service.name} 用の幅に変更しました`)
});

//id:help_buttonのボタンを押すと、ヘルプを出現 or 削除
help_button.addEventListener('click', () => {
    if (!help_open) {
        help_icon.src = "./icon/close.svg";
        all_help_content.forEach(function (help_content) {
            help_content.classList.add("active");
        });
        help_open = true;
    }
    else {
        help_icon.src = "./icon/help.svg";
        all_help_content.forEach(function (help_content) {
            help_content.classList.remove("active");
        });
        help_open = false;
    }
});


//*********************** 改善案 ***********************
//共有機能実装