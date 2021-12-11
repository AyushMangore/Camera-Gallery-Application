let video = document.querySelector("video");
let recordBtnCont = document.querySelector(".record-btn-cont");
let captureBtnCont = document.querySelector(".capture-btn-cont");
let recordBtn = document.querySelector(".record-btn");
let captureBtn = document.querySelector(".capture-btn");

let transparentcolor = "transparent";

let recordFlag = false;


let recorder;
let chunks = []; // media data in chunks

let constraints = {
    video: true,
    audio: true
}

// navigator is a global object
// which tells browser info it contains window information
// media devices is a browser api to connect media hardware
// get user media ask for turning on camera and micophone if turned true

navigator.mediaDevices.getUserMedia(constraints)
.then((stream) => {
    video.srcObject = stream;


    // stream comes in chunks not whole at a time
    recorder = new MediaRecorder(stream);
    recorder.addEventListener("start",(e) => {
        chunks = [];
    })
    recorder.addEventListener("dataavailable",(e) => {
        chunks.push(e.data);
    })
    recorder.addEventListener("stop",(e) => {
        // conversion of chuhnk to video
        let blob = new Blob(chunks,{ type: "video/mp4" });

        if (db) {

            let videoId = shortid(); 
            let dbTransaction = db.transaction("video","readwrite");
            let videoStore = dbTransaction.objectStore("video");
            let videoEntry = {
                id: `vid-${videoId}`,
                blobData: blob
            }
            videoStore.add(videoEntry);

        }

        // let videourl = URL.createObjectURL(blob);

        // let a = document.createElement("a");
        // a.href = videourl;
        // a.download = "stream.mp4";
        // a.click();
    })
})

recordBtnCont.addEventListener("click", (e) => {
    if(!recorder) return;

    recordFlag = !recordFlag;

    if(recordFlag === true){
        //start
        recorder.start();
        recordBtn.classList.add("scale-record");
        startTimer();
    }else{
        //stop
        recorder.stop();
        recordBtn.classList.remove("scale-record");
        stopTimer();
    }

})

captureBtnCont.addEventListener("click", (e) => {

    captureBtn.classList.add("scale-capture");

    let canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    // get context returns a drawing context
    let tool = canvas.getContext("2d");
    // drawimage provides different ways to draw image on canvas
    // start from top left 0 0 
    // fill complete therefore canvas height and width 
    tool.drawImage(video,0,0,canvas.width,canvas.height);

    // filtering
    tool.fillStyle = transparentcolor;
    tool.fillRect(0,0,canvas.width,canvas.height);

    let imageURL = canvas.toDataURL();
    // let a = document.createElement("a");
    //     a.href = imageURL;
    //     a.download = "image.jpg";
    //     a.click();
    if (db) {

        let imageId = shortid(); 
        let dbTransaction = db.transaction("image","readwrite");
        let imageStore = dbTransaction.objectStore("image");
        let imageEntry = {
            id: `img-${imageId}`,
            url: imageURL
        }
        imageStore.add(imageEntry);

    }
    setTimeout(() => {
        captureBtn.classList.remove("scale-capture");
    }, 500);
})

let timer = document.querySelector(".timer");
let timerID;
let counter = 0; // total seconds

function startTimer(){
    timer.style.display = "block";
    function displayTimer(){
        
        let totalseconds = counter;

        let hours = Number.parseInt(totalseconds/3600);
        totalseconds = totalseconds%3600;
        let minutes = Number.parseInt(totalseconds/60);
        totalseconds = totalseconds%60;
        let seconds = totalseconds;

        hours = (hours < 10) ? `0${hours}` : hours;
        minutes = (minutes < 10) ? `0${minutes}` : minutes;
        seconds = (seconds < 10) ? `0${seconds}` : seconds;

        timer.innerText = `${hours}:${minutes}:${seconds}`;

        counter++;

    }
    timerID = setInterval(displayTimer,1000);
}

function stopTimer(){
    timer.style.display = "none";
    clearInterval(timerID);
    timer.innerText = "00:00:00";
}

// filtering
let allfilters = document.querySelectorAll(".filter");
let filterLayer = document.querySelector(".filter-layer");
allfilters.forEach((filterelem) => {
    filterelem.addEventListener("click", (e) => {
         // fetch background color of elements
         transparentcolor = getComputedStyle(filterelem).getPropertyValue("background-color");
         filterLayer.style.background = transparentcolor;
    })
})

