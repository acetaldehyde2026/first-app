const daysCount = document.getElementById('days-count');
const hoursCount = document.getElementById('hours-count');
const minutesCount = document.getElementById('minutes-count');
const secondsCount = document.getElementById('seconds-count');

const configToggle = document.getElementById('config-toggle');
const configPanel = document.getElementById('config-panel');
const targetDateInput = document.getElementById('target-date-input');
const saveBtn = document.getElementById('save-btn');

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

    // ミリ秒単位での残り時間
    const diffTime = target.getTime() - now.getTime();

    // --- ゴール（日付到来）時の演出 ---
    if (diffTime <= 0) {
        daysCount.textContent = '0';
        hoursCount.textContent = '00';
        minutesCount.textContent = '00';
        secondsCount.textContent = '00';
        
        progressBar.style.width = '100%';
        runner.style.left = '100%';
        runner.textContent = '🏃‍♂️👑'; 

        confettiContainer.classList.remove('hidden');

        if (timerInterval) clearInterval(timerInterval);
        return;
    }

    confettiContainer.classList.add('hidden');
    runner.textContent = '🏃‍♂️';

    // 1秒単位で綺麗に数字を出すため、端数を丸めて計算
    const diffSecondsTotal = Math.floor(diffTime / 1000);
    
    const diffDays = Math.floor(diffSecondsTotal / (60 * 60 * 24));
    const diffHours = Math.floor((diffSecondsTotal / (60 * 60)) % 24);
    const diffMinutes = Math.floor((diffSecondsTotal / 60) % 60);
    const diffSeconds = diffSecondsTotal % 60;

    daysCount.textContent = diffDays;
    hoursCount.textContent = String(diffHours).padStart(2, '0');
    minutesCount.textContent = String(diffMinutes).padStart(2, '0');
    secondsCount.textContent = String(diffSeconds).padStart(2, '0');

    // --- 【1秒単位】プログレスバーとランナーの同期計算 ---
    // ミリ秒の細かいズレを無視し、1秒単位のタイムスタンプで進捗率を出す
    const totalSeconds = Math.floor((target.getTime() - start.getTime()) / 1000);
    const elapsedSeconds = Math.floor((now.getTime() - start.getTime()) / 1000);
    
    let progressPercent = (elapsedSeconds / totalSeconds) * 100;
    if (progressPercent < 0) progressPercent = 0;
    if (progressPercent > 100) progressPercent = 100;

    // 1秒単位の％を適用
    progressBar.style.width = `${progressPercent}%`;
    runner.style.left = `${progressPercent}%`;
}

function startUpdateTimer() {
    if (timerInterval) clearInterval(timerInterval);
    calculateCountdown();
    // 1秒（1000ミリ秒）ごとに正確に実行
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
        localStorage.setItem('targetDate', selectedDate);
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
