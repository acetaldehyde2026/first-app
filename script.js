// 画面の要素を捕まえる
const configToggle = document.getElementById('config-toggle');
const configPanel = document.getElementById('config-panel');
const targetDateInput = document.getElementById('target-date-input');
const saveBtn = document.getElementById('save-btn');

const daysCount = document.getElementById('days-count');
const hoursCount = document.getElementById('hours-count');
const minutesCount = document.getElementById('minutes-count');
const secondsCount = document.getElementById('seconds-count');
const timeDisplay = document.getElementById('time-display');

let timerInterval = null; // 1秒ごとのタイマーを管理する変数

// 1. 設定パネルの表示・非表示を切り替える
configToggle.addEventListener('click', () => {
    configPanel.classList.toggle('hidden');
    if (!configPanel.classList.contains('hidden')) {
        targetDateInput.focus();
        targetDateInput.click();
    }
});

// 2. 残り時間（日・時・分・秒）を計算して画面に表示する関数
function calculateCountdown() {
    const savedDate = localStorage.getItem('targetDate');
    
    if (!savedDate) {
        daysCount.textContent = '--';
        timeDisplay.style.visibility = 'hidden'; // 日付がない時は時間を隠す
        return;
    }

    const now = new Date();
    // 目標日の「深夜0時0分0秒」をターゲットにする
    const target = new Date(savedDate + 'T00:00:00');

    // ミリ秒単位の差分
    const diffTime = target.getTime() - now.getTime();
    
    if (diffTime <= 0) {
        // すでに目標日を過ぎている、または当日の場合
        daysCount.textContent = '0';
        hoursCount.textContent = '00';
        minutesCount.textContent = '00';
        secondsCount.textContent = '00';
        clearInterval(timerInterval); // タイマーを止める
        return;
    }

    timeDisplay.style.visibility = 'visible';

    // ミリ秒から「日・時・分・秒」を細かく計算する
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime / (1000 * 60 * 60)) % 24);
    const diffMinutes = Math.floor((diffTime / (1000 * 60)) % 60);
    const diffSeconds = Math.floor((diffTime / 1000) % 60);

    // 画面の文字を書き換える（1桁のときは 01, 02 のように頭に0をつける）
    daysCount.textContent = diffDays;
    hoursCount.textContent = String(diffHours).padStart(2, '0');
    minutesCount.textContent = String(diffMinutes).padStart(2, '0');
    secondsCount.textContent = String(diffSeconds).padStart(2, '0');
}

// 3. タイマーを新しく起動（または再起動）する関数
function startUpdateTimer() {
    // すでに動いているタイマーがあれば一度クリアする
    if (timerInterval) clearInterval(timerInterval);
    
    // 最初に1回計算する
    calculateCountdown();
    
    // その後、1000ミリ秒（1秒）ごとにずっと計算を繰り返す
    timerInterval = setInterval(calculateCountdown, 1000);
}

// 4. 保存ボタンを押したときの処理
saveBtn.addEventListener('click', () => {
    const selectedDate = targetDateInput.value;
    
    if (selectedDate) {
        localStorage.setItem('targetDate', selectedDate);
        startUpdateTimer(); // タイマーを再始動
        configPanel.classList.add('hidden');
    } else {
        alert('日付を選択してください');
    }
});

// 5. アプリが起動した時の最初の処理
window.addEventListener('load', () => {
    const savedDate = localStorage.getItem('targetDate');
    if (savedDate) {
        targetDateInput.value = savedDate;
    }
    startUpdateTimer(); // タイマーを開始
});
