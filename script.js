const daysCount = document.getElementById('days-count');
const hoursCount = document.getElementById('hours-count');
const minutesCount = document.getElementById('minutes-count');
const secondsCount = document.getElementById('seconds-count');

const configToggle = document.getElementById('config-toggle');
const configPanel = document.getElementById('config-panel');
const targetDateInput = document.getElementById('target-date-input');
const saveBtn = document.getElementById('save-btn');

// プログレスバー関連の要素
const progressBar = document.getElementById('progress-bar');
const runner = document.getElementById('runner');
const confettiContainer = document.getElementById('confetti-container');

let timerInterval = null;

// --- カウントダウンとプログレスバーの計算 ---
function calculateCountdown() {
    const savedDate = localStorage.getItem('targetDate');
    const startDateStr = localStorage.getItem('startDate');
    
    if (!savedDate) {
        daysCount.textContent = '--';
        hoursCount.textContent = '00';
        minutesCount.textContent = '00';
        secondsCount.textContent = '00';
        progressBar.style.width = '0%';
        runner.style.left = '0%';
        return;
    }

    const now = new Date();
    const target = new Date(savedDate + 'T00:00:00');
    const start = new Date(startDateStr);

    const diffTime = target.getTime() - now.getTime();

    // --- ゴール（日付到来）時の演出判定 ---
    if (diffTime <= 0) {
        daysCount.textContent = '0';
        hoursCount.textContent = '00';
        minutesCount.textContent = '00';
        secondsCount.textContent = '00';
        
        progressBar.style.width = '100%';
        runner.style.left = '100%';
        runner.textContent = '🏃‍♂️👑'; // 王冠をかぶる

        // ゴール演出（紙吹雪パネル）を表示
        confettiContainer.classList.remove('hidden');

        if (timerInterval) clearInterval(timerInterval);
        return;
    }

    // 通常時のゴール演出は隠す
    confettiContainer.classList.add('hidden');
    runner.textContent = '🏃‍♂️';

    // 日・時・分・秒の計算
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime / (1000 * 60 * 60)) % 24);
    const diffMinutes = Math.floor((diffTime / (1000 * 60)) % 60);
    const diffSeconds = Math.floor((diffTime / 1000) % 60);

    daysCount.textContent = diffDays;
    hoursCount.textContent = String(diffHours).padStart(2, '0');
    minutesCount.textContent = String(diffMinutes).padStart(2, '0');
    secondsCount.textContent = String(diffSeconds).padStart(2, '0');

    // --- プログレスバーとランナー位置の連動計算 ---
    const totalDuration = target.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    
    let progressPercent = (elapsed / totalDuration) * 100;
    if (progressPercent < 0) progressPercent = 0;
    if (progressPercent > 100) progressPercent = 100;

    // バーの長さとランナーの位置を同じ％で同期させる
    progressBar.style.width = `${progressPercent}%`;
    runner.style.left = `${progressPercent}%`;
}

function startUpdateTimer() {
    if (timerInterval) clearInterval(timerInterval);
    calculateCountdown();
    timerInterval = setInterval(calculateCountdown, 1000);
}

// 設定ボタンの開閉
configToggle.addEventListener('click', function() {
    configPanel.classList.toggle('hidden');
});

// 保存して開始ボタン
saveBtn.addEventListener('click', function() {
    const selectedDate = targetDateInput.value;
    
    if (selectedDate) {
        const now = new Date();
        // 1. 目標日を保存
        localStorage.setItem('targetDate', selectedDate);
        // 2. スタートした「今の瞬間」をプログレスバーの起点として保存
        localStorage.setItem('startDate', now.toISOString());
        
        startUpdateTimer();
        configPanel.classList.add('hidden');
    } else {
        alert('日付を選択してください');
    }
});

// ページ読み込み時の初期化
window.addEventListener('load', function() {
    const savedDate = localStorage.getItem('targetDate');
    if (savedDate) {
        targetDateInput.value = savedDate;
    }
    startUpdateTimer();
});
