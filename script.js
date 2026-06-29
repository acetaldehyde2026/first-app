// 画面の要素を捕まえる
const daysCount = document.getElementById('days-count');
const hoursCount = document.getElementById('hours-count');
const minutesCount = document.getElementById('minutes-count');
const secondsCount = document.getElementById('seconds-count');

// 目標の日付（例として2024年の12月31日を設定していますが、本来は設定から取得します）
// ここでは例として、今日から32日後の日付を自動で設定します。
const targetDate = new Date();
targetDate.setDate(targetDate.getDate() + 32); 
targetDate.setHours(0, 0, 0, 0); // 深夜0時を目標にする

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

// ページを読み込んだ瞬間に一度計算して表示する
calculateCountdown();

// 1秒（1000ミリ秒）ごとに calculateCountdown 関数をずっと繰り返す
const timerInterval = setInterval(calculateCountdown, 1000);
