const cdAudio = document.getElementById("cd-audio");
const cdPlay = document.getElementById("cd-play");
const cdPrev = document.getElementById("cd-prev");
const cdNext = document.getElementById("cd-next");
const cdProgress = document.getElementById("cd-progress");
const cdCurrentTime = document.getElementById("cd-current-time");
const cdDuration = document.getElementById("cd-duration");
const cdTrackSelect = document.getElementById("cd-track-select");
const cdCoverImg = document.getElementById("cd-cover-img");

if (
    cdAudio &&
    cdPlay &&
    cdPrev &&
    cdNext &&
    cdProgress &&
    cdCurrentTime &&
    cdDuration &&
    cdTrackSelect &&
    cdCoverImg
) {
    const tracks = Array.from(cdTrackSelect.options);
    const defaultCover = cdCoverImg.getAttribute("src");
    let currentTrack = 0;

    const formatTime = (seconds) => {
        if (isNaN(seconds)) return "0:00";

        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60)
            .toString()
            .padStart(2, "0");

        return `${mins}:${secs}`;
    };

    const setPlayButton = (isPlaying) => {
        if (isPlaying) {
            cdPlay.textContent = "||";
            cdPlay.classList.add("playing");
        } else {
            cdPlay.textContent = "â–¶";
            cdPlay.classList.remove("playing");
        }
    };

    const loadTrack = (index, autoplay = false) => {
        currentTrack = index;

        const track = tracks[currentTrack];

        cdTrackSelect.selectedIndex = currentTrack;
        cdAudio.src = track.value;

        cdCoverImg.src = track.dataset.cover || defaultCover;

        cdCurrentTime.textContent = "0:00";
        cdDuration.textContent = "0:00";

        cdProgress.value = 0;
        cdProgress.max = 100;

        cdAudio.load();

        if (autoplay) {
            const playPromise = cdAudio.play();

            if (playPromise !== undefined) {
                playPromise
                    .then(() => setPlayButton(true))
                    .catch(() => setPlayButton(false));
            } else {
                setPlayButton(true);
            }
        } else {
            setPlayButton(false);
        }
    };

    cdPlay.addEventListener("click", () => {
        if (cdAudio.paused) {
            const playPromise = cdAudio.play();

            if (playPromise !== undefined) {
                playPromise
                    .then(() => setPlayButton(true))
                    .catch(() => setPlayButton(false));
            } else {
                setPlayButton(true);
            }
        } else {
            cdAudio.pause();
            setPlayButton(false);
        }
    });

    cdPrev.addEventListener("click", () => {
        currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
        loadTrack(currentTrack, true);
    });

    cdNext.addEventListener("click", () => {
        currentTrack = (currentTrack + 1) % tracks.length;
        loadTrack(currentTrack, true);
    });

    cdTrackSelect.addEventListener("change", () => {
        loadTrack(cdTrackSelect.selectedIndex, true);
    });

    cdAudio.addEventListener("loadedmetadata", () => {
        cdDuration.textContent = formatTime(cdAudio.duration);
        cdProgress.max = Math.floor(cdAudio.duration || 0);
    });

    cdAudio.addEventListener("timeupdate", () => {
        cdCurrentTime.textContent = formatTime(cdAudio.currentTime);
        cdProgress.value = Math.floor(cdAudio.currentTime || 0);
    });

    cdProgress.addEventListener("input", () => {
        cdAudio.currentTime = cdProgress.value;
    });

    cdAudio.addEventListener("ended", () => {
        currentTrack = (currentTrack + 1) % tracks.length;
        loadTrack(currentTrack, true);
    });

    loadTrack(0, false);
}