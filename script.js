// 画面の要素を捕まえる
const configToggle = document.getElementById('config-toggle');
const configPanel = document.getElementById('config-panel');
const targetDateInput = document.getElementById('target-date-input');
const saveBtn = document.getElementById('save-btn');
const daysCount = document.getElementById('days-count');

// 1. 設定パネルの表示・非表示を切り替える
configToggle.addEventListener('click', () => {
    configPanel.classList.toggle('hidden');
});

// 2. 残り日数を計算して画面に表示する関数
function calculateCountdown() {
    // 保存されている日付を取得
    const savedDate = localStorage.getItem('targetDate');
    
    if (!savedDate) {
        daysCount.textContent = '--';
        return;
    }

    const now = new Date();
    const target = new Date(savedDate);

    // 時間のズレをなくすため、両方の「時・分・秒・ミリ秒」をゼロ（深夜0時）に揃える
    now.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    // ミリ秒単位の差分を計算
    const diffTime = target.getTime() - now.getTime();
    
    // ミリ秒を「日」に変換 (1日 = 24時間 * 60分 * 60秒 * 1000ミリ秒)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
        daysCount.textContent = diffDays;
    } else if (diffDays === 0) {
        daysCount.textContent = '0'; // 当日
    } else {
        daysCount.textContent = '終'; // すでに過ぎている場合
    }
}

// 3. 保存ボタンを押したときの処理
saveBtn.addEventListener('click', () => {
    const selectedDate = targetDateInput.value;
    
    if (selectedDate) {
        // ブラウザに日付を保存
        localStorage.setItem('targetDate', selectedDate);
        // カウントダウンを再計算
        calculateCountdown();
        // 設定パネルを閉じる
        configPanel.classList.add('hidden');
    } else {
        alert('日付を選択してください');
    }
});

// 4. アプリが起動した時の最初の処理
window.addEventListener('load', () => {
    // すでに保存された日付があれば、入力欄に初期値として入れる
    const savedDate = localStorage.getItem('targetDate');
    if (savedDate) {
        targetDateInput.value = savedDate;
    }
    // 表示を更新
    calculateCountdown();
});
