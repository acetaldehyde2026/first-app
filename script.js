// --- 1. 画面の要素を捕まえる ---
const daysCount = document.getElementById('days-count');
const hoursCount = document.getElementById('hours-count');
const minutesCount = document.getElementById('minutes-count');
const secondsCount = document.getElementById('seconds-count');

const configToggle = document.getElementById('config-toggle'); // 設定ボタン
const configPanel = document.getElementById('config-panel');   // 設定パネル
const targetDateInput = document.getElementById('target-date-input'); // 日付入力欄
const saveBtn = document.getElementById('save-btn');           // 保存して開始ボタン

let timerInterval = null; // 1秒ごとのタイマーを管理する変数

// --- 2. 残り時間を計算して画面に表示する関数 ---
function calculateCountdown() {
    // ローカルストレージから保存されている日付（YYYY-MM-DD）を取得
    const savedDate = localStorage.getItem('targetDate');
    
    // まだ日付が設定されていない場合の初期表示
    if (!savedDate) {
        daysCount.textContent = '--';
        hoursCount.textContent = '00';
        minutesCount.textContent = '00';
        secondsCount.textContent = '00';
        return;
    }

    const now = new Date();
    // 設定された日の「深夜0時0分0秒」をターゲットにする
    const target = new Date(savedDate + 'T00:00:00');

    // ミリ秒単位での差分を計算
    const diffTime = target.getTime() - now.getTime();

    // 目標日を過ぎた、または当日の場合の処理
    if (diffTime <= 0) {
        daysCount.textContent = '0';
        hoursCount.textContent = '00';
        minutesCount.textContent = '00';
        secondsCount.textContent = '00';
        if (timerInterval) clearInterval(timerInterval); // タイマーを止める
        return;
    }

    // ミリ秒から「日・時・分・秒」を細かく計算
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime / (1000 * 60 * 60)) % 24);
    const diffMinutes = Math.floor((diffTime / (1000 * 60)) % 60);
    const diffSeconds = Math.floor((diffTime / 1000) % 60);

    // 画面の文字を書き換える（1桁のときは頭に0をつける）
    daysCount.textContent = diffDays;
    hoursCount.textContent = String(diffHours).padStart(2, '0');
    minutesCount.textContent = String(diffMinutes).padStart(2, '0');
    secondsCount.textContent = String(diffSeconds).padStart(2, '0');
}

// --- 3. タイマーを新しく動かす（または再起動する）関数 ---
function startUpdateTimer() {
    // すでに動いているタイマーがあれば一度クリアする（二重起動防止）
    if (timerInterval) clearInterval(timerInterval);
    
    // 最初に1回計算して表示
    calculateCountdown();
    
    // その後、1秒（1000ミリ秒）ごとにずっと計算を繰り返す
    timerInterval = setInterval(calculateCountdown, 1000);
}

// --- 4. 【復活】設定ボタンを押したときの開閉処理 ---
configToggle.addEventListener('click', function() {
    configPanel.classList.toggle('hidden');
    // パネルが開いたら、iPad等でカレンダーを押しやすくするためにフォーカスを当てる
    if (!configPanel.classList.contains('hidden')) {
        targetDateInput.focus();
        targetDateInput.click();
    }
});

// --- 5. 【復活＆修正】保存して開始ボタンを押したときの処理 ---
saveBtn.addEventListener('click', function() {
    const selectedDate = targetDateInput.value; // カレンダーで選ばれた日付（例: "2026-08-01"）
    
    if (selectedDate) {
        // ブラウザ（LocalStorage）に日付を保存
        localStorage.setItem('targetDate', selectedDate);
        
        // 新しい日付で1秒ごとのカウントダウンを再始動
        startUpdateTimer();
        
        // 設定パネルを閉じる
        configPanel.classList.add('hidden');
    } else {
        alert('日付を選択してください');
    }
});

// --- 6. アプリが起動（ページ読み込み）した時の最初の処理 ---
window.addEventListener('load', function() {
    // すでに過去に保存した日付があれば、カレンダー入力欄に最初から入れておく
    const savedDate = localStorage.getItem('targetDate');
    if (savedDate) {
        targetDateInput.value = savedDate;
    }
    // カウントダウン処理を開始
    startUpdateTimer();
});
