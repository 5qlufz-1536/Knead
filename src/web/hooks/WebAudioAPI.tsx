// 一旦わからん過ぎるから過去にjsで書いてたやつをほぼそのまま持ってきてみる


const audioContext = window.AudioContext || window.webkitAudioContext;
const context = new audioContext();
if (context.decodeAudioData.length !== 1) {
  const originalDecodeAudioData = context.decodeAudioData.bind(context);
  context.decodeAudioData = buffer =>
    new Promise((resolve, reject) =>
      originalDecodeAudioData(buffer, resolve, reject)
    );
}


let source = context.createBufferSource();

const volumeControler = context.createGain();

let audioTime = 0;
let startTime = 0;
let resumeTime = 0;
let dispTime = 0;
let dispTimeCache = 0;

let playing = false;
let pausing = false;
let ended = false;
let seekbarStart = false;


// Web Audio APIを利用した再生等の処理
const VolumeChange = (volume: number) => {
    if (typeof volumeControler !== 'undefined') {
        volumeControler.gain.value = volume;
    }

}
const loadSample = (url: URL) => {
    return fetch(url)
        .then(response => response.arrayBuffer())
        .then(buffer => context.decodeAudioData(buffer));
}
const playSample = (sample: AudioBuffer, rate: number, volume: number) => {
    source = context.createBufferSource();
    source.connect(volumeControler);
    source.buffer = sample
    source.playbackRate.value = rate;
    volumeControler.connect(context.destination);
    volumeControler.gain.value = volume;
    if (!playing || ended) {
        resumeTime = dispTime = 0;
        audioTime = startTime = context.currentTime;
        playing = true;
        ended = false;
    } else if (seekbarStart) {
        seekbarStart = false;
        dispTime = resumeTime;
        audioTime = context.currentTime;
    } else {
        dispTime = dispTimeCache;
        audioTime = context.currentTime;
    }
    //console.log(audioTime + "," + startTime);
    source.connect(context.destination);
    pausing = false;
    // maxTime.innerHTML = parseTime(source.buffer.duration / rate);
    // AudioSeekbar.max = source.buffer.duration / rate;
    displayTime(audioTime);
    playerStatus();
    source.start(0, resumeTime);
    source.onended = () => {
        //console.log(AudioSeekbar.value)
        // contextの時間経過を停止
        if (!pausing) {
            //AudioSeekbar.value = parseFloat(AudioSeekbar.max);
            //context.suspend().then(function () {
            ended = true;
            audioStop();
            //});
        }
    }
}
export const audioPlay = () => {
    loadSample(AudioPlayer.src).then(sample => {
        if (AudioSpeed.checkValidity()) {
            playSample(sample, AudioSpeed.value, AudioVolume.value);
        }
    })
}
export const audioStop = () => {
    if (playing) {
        if (!pausing) {
            source.stop(0);
        }
        if (ended) {
            dispTime = 0;
            pausing = true;
        } else {
            playing = false;
            pausing = false;
            dispTime = 0;
            displayTime(0);
            //AudioSeekbar.value = 0;
            //AudioSeekbar.max = 100;
            //maxTime.innerHTML = `00:00:00`;
            //currentTime.innerHTML = `00:00:00`;
        }
        playerStatus();
    }
}
export const audioPauseToggle = () => {
    if (playing) {
        if (pausing) {
            //console.log(AudioSeekbar.value)
            //audioTime = context.currentTime;
            audioPlay();
        } else {
            audioPause();
        }
    }
}
export const audioPause = () => {
    resumeTime = context.currentTime - startTime;
    pausing = true;
    source.stop(0);
}
export const displayTime = (audio) => {
    if (playing && !pausing) {
        AudioSeekbar.value = dispTimeCache = dispTime + context.currentTime - audio;
        currentTime.innerHTML = parseTime(AudioSeekbar.value);
        export setTimeout(const () =  { displayTime(audio) }, 1);
    } else {
        clearTimeout(displayTime);
    }
}
// 表示する時間を作成
export const parseTime = (time) => {
    let returnTime;
    let second = ("0" + Math.floor(time % 60)).slice(-2);
    let minutes = ("0" + Math.floor(time / 60) % 60).slice(-2);
    //let hour = ("0" + Math.floor((time / 60) / 60)).slice(-2);
    returnTime = minutes + ":" + second;
    return returnTime;
}
export const playerStatus = () => {
    if (playing) {
        if (!pausing) {
            playButton.style.display = "none";
            pauseButton.style.display = "";
        } else {
            playButton.style.display = "";
            pauseButton.style.display = "none";
        }
    }
}
