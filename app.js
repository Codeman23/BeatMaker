class DrumKit {
  constructor() {
    this.pads = document.querySelectorAll(".sequencer__pad");
    this.playBtn = document.querySelector(".play");
    this.kickAudio = document.querySelector(".kickSound");
    this.snareAudio = document.querySelector(".snareSound");
    this.hihatAudio = document.querySelector(".hihatSound");
    this.index = 0;
    this.bpm = 150;
    this.isPlaying = null;
    this.selects = document.querySelectorAll("select");
    this.muteBtns = document.querySelectorAll(".sequencer__mute");
    this.tempoSlider = document.querySelector(".tempo__slider");
  }

  activePad() {
    this.classList.toggle("active");
  }

  repeat() {
    let step = this.index % 8;
    const activeBars = document.querySelectorAll(`.b${step}`);
    //Loop over the bars
    activeBars.forEach((bar) => {
      bar.style.animation = `playTrack .3s alternate ease-in-out 2`;
      if (bar.classList.contains("active")) {
        //check each sound
        if (bar.closest(".sequencer__pads_kick")) {
          this.kickAudio.currentTime = 0;
          this.kickAudio.play();
        } else if (bar.closest(".sequencer__pads_snare")) {
          this.snareAudio.currentTime = 0;
          this.snareAudio.play();
        } else if (bar.closest(".sequencer__pads_hihat")) {
          this.hihatAudio.currentTime = 0;
          this.hihatAudio.play();
        }
      }
    });

    this.index++;
  }

  start() {
    const interval = (60 / this.bpm) * 1000;
    //Check if its playing
    if (this.isPlaying) {
      //Clear Interval
      clearInterval(this.isPlaying);
      this.isPlaying = null;
    } else {
      this.isPlaying = setInterval(() => {
        this.repeat();
      }, interval);
    }
  }

  updateBtn() {
    if (this.isPlaying) {
      this.playBtn.innerText = "Play";
      this.playBtn.classList.remove("active");
    } else {
      this.playBtn.innerText = "Stop";
      this.playBtn.classList.add("active");
    }
  }

  changeSound(e) {
    const selectionName = e.target.name;
    const selectionValue = e.target.value;

    switch (selectionName) {
      case "kickSelect":
        this.kickAudio.src = selectionValue;
        break;
      case "snareSelect":
        this.snareAudio.src = selectionValue;
        break;
      case "hihatSelect":
        this.hihatAudio.src = selectionValue;
        break;
    }
  }

  mute(e) {
    const muteIndex = e.target.getAttribute("data-track");
    e.target.classList.toggle("active");

    if (e.target.classList.contains("active")) {
      switch (muteIndex) {
        case "0":
          this.kickAudio.volume = 0;
          break;
        case "1":
          this.snareAudio.volume = 0;
          break;
        case "2":
          this.hihatAudio.volume = 0;
          break;
      }
    } else {
      switch (muteIndex) {
        case "0":
          this.kickAudio.volume = 1;
          break;
        case "1":
          this.snareAudio.volume = 1;
          break;
        case "2":
          this.hihatAudio.volume = 1;
          break;
      }
    }
  }

  changeTempo(e) {
    const tempText = document.querySelector(".tempo__number");
    const tempNumbers = e.target.value;
    tempText.innerText = tempNumbers;
    this.bpm = tempNumbers;
  }

  updateTempo(e) {
    clearInterval(this.isPlaying);
    this.isPlaying = null;
    if (this.playBtn.classList.contains("active")) {
      this.start();
    }
  }
}

const drumKit = new DrumKit();

//Event Listeners
drumKit.pads.forEach((pad) => {
  pad.addEventListener("click", drumKit.activePad);
  pad.addEventListener("animationend", function () {
    this.style.animation = "";
  });
});

drumKit.playBtn.addEventListener("click", function () {
  drumKit.updateBtn();
  drumKit.start();
});

drumKit.selects.forEach((select) => {
  select.addEventListener("change", function (e) {
    drumKit.changeSound(e);
  });
});

drumKit.muteBtns.forEach((btn) => {
  btn.addEventListener("click", function (e) {
    drumKit.mute(e);
  });
});

drumKit.tempoSlider.addEventListener("input", function (e) {
  drumKit.changeTempo(e);
});

drumKit.tempoSlider.addEventListener("change", function (e) {
  drumKit.updateTempo(e);
});

document.addEventListener("DOMContentLoaded", () => drumKit.tempoSlider.value = 150);
