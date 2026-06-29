// --- 画面の要素を捕まえる ---
// メインのカウントダウン表示
const daysCount = document.getElementById('days-count');
const hoursCount = document.getElementById('hours-count');
const minutesCount = document.getElementById('minutes-count');
const secondsCount = document.getElementById('seconds-count');

// 設定ボタンと設定パネル
const configToggle = document.getElementById('config-toggle'); // 設定ボタン（歯車と「設定」の文字）
const configPanel = document.getElementById('config-panel'); // 設定パネル（日付入力欄）

// --- 目標日付（本来は設定から取得） ---
// ここでは例として、今日から32日後の日付を設定します。
const targetDate = new Date();
targetDate.setDate(targetDate.getDate() + 32); 
targetDate.setHours(0, 0, 0, 0); // 深夜0時を目標にする

// --- カウントダウンを計算して表示する関数 ---
function calculateCountdown() {
    const now = new Date();
    const diffTime = targetDate.getTime() - now.getTime();

    // タイマーが終了した場合の処理
    if (diffTime <= 0) {
        daysCount.textContent = '0';
        hoursCount.textContent = '00';
        minutesCount.textContent = '00';
        secondsCount.textContent = '00';
        clearInterval(timerInterval); // タイマーを止める
        return;
    }

    // ミリ秒から「日・時・分・秒」を細かく計算
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

// --- 【修正のポイント】設定パネルを表示・非表示にする機能 ---
// 設定ボタンがクリックされた時の動きを登録します。
// これにより、カウントダウンが動いている状態でも、設定ボタンが反応します。
configToggle.addEventListener('click', function() {
    // 設定パネルに 'hidden' というクラスがついているかどうかをチェックし、
    // ついていれば外し、ついていなければ付けることで、表示・非表示を切り替えます。
    if (configPanel.classList.contains('hidden')) {
        configPanel.classList.remove('hidden');
    } else {
        configPanel.classList.add('hidden');
    }
});

// --- タイマーを動かす（1秒ごとに繰り返す） ---
// ページを読み込んだ瞬間に一度計算して表示する
calculateCountdown();

// 1秒（1000ミリ秒）ごとに calculateCountdown 関数をずっと繰り返す
const timerInterval = setInterval(calculateCountdown, 1000);
