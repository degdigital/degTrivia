const audioPlayer = function() {

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const audioFiles = [
        {
            id: 'countdown',
            url: '/audio/countdown.mp3',
            buffer: null
        },
        {
            id: 'ticktock',
            url: '/audio/ticktock.mp3',
            buffer: null
        }
    ];
    let filesPlaying = [];

    function init() {
        audioFiles.forEach(audioFile => {
            fetchAudioFile(audioFile.url)
                .then(buffer => {
                    audioFile.buffer = buffer;
                    if(audioFile.playOnLoad) {
                        playAudio(audioFile.id);
                    }
                });
        });
    }

    function fetchAudioFile(src) {
        return fetch(src).then(response => {
            return response.arrayBuffer().then(buffer => {
                return audioContext.decodeAudioData(buffer);
            });
        });
    }

    function createAudioBufferSource(buffer, {loop=false, playbackRate=1.0, delay=0}) { 
        const audioBufferSource = audioContext.createBufferSource();
        audioBufferSource.buffer = buffer;
        audioBufferSource.loop = loop;
        audioBufferSource.playbackRate.value = playbackRate;
        audioBufferSource.connect(audioContext.destination);
        audioBufferSource.start(audioContext.currentTime + delay);
        return audioBufferSource;
    }

    function playAudio(id, options) {
        const audioFile = getAudioFile(id);
        if (audioFile) {
            if (audioFile.buffer) {
                audioFile.audioBufferSource = createAudioBufferSource(audioFile.buffer, Object.assign({}, options, {loop: audioFile.loop}));
            } else {
                audioFile.playOnLoad = true;
            }
            filesPlaying.push(id);
        }
    }

    function stopAudio(id) {
        const audioFile = getAudioFile(id);
        if (audioFile && audioFile.audioBufferSource) {
            audioFile.audioBufferSource.stop();
            audioFile.audioBufferSource = null;
            filesPlaying.splice(filesPlaying.indexOf(id), 1);
        }
    }

    function getAudioFile(id) {
        return audioFiles.find(audioFile => audioFile.id === id);
    }

    function play(audioId, options) {
        stopAll();
        playAudio(audioId, options);
    }

    function stop(audioId) {
        stopAudio(audioId);
    }

    function stopAll() {
        filesPlaying.forEach(id => stop(id));
    }

    init();

    return {
        play: play, 
        stop: stop,
        stopAll: stopAll
    }
}

const instance = audioPlayer();

export default instance;