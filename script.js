// Acquiring all necesarry HTML elements using query selector
let video = document.querySelector("video");
let recordBtnCont = document.querySelector(".record-btn-cont");
let captureBtnCont = document.querySelector(".capture-btn-cont");
let recordBtn = document.querySelector(".record-btn");
let captureBtn = document.querySelector(".capture-btn");

let transparentcolor = "transparent";

// for implementing toggling effect of record button, this falg will be used
let recordFlag = false;


let recorder;
let chunks = []; // media data in chunks

// These are the constraints which will be passed while rendering media,
// video audio true means both of them will be accessed
let constraints = {
    video: true,
    audio: true
}

// navigator is a global object
// which tells browser info, it contains window information
// The navigator object contains information about the browser.

// The location object is a property of the window object.

// The navigator object is accessed with:

// window.navigator or just navigator:

// The Navigator. mediaDevices read-only property returns a MediaDevices object, 
// which provides access to connected media input devices like cameras and microphones, 
// as well as screen sharing.
// media devices is a browser api to connect media hardware
// get user media ask for turning on camera and micophone if turned true

navigator.mediaDevices.getUserMedia(constraints)
.then((stream) => {
    // after getting the stream we will pass this stream object to our src field of video html element
    video.srcObject = stream;


    // stream comes in chunks not whole at a time therefore an array called chunks will be used
    recorder = new MediaRecorder(stream);
    // at start array will be empty
    recorder.addEventListener("start",(e) => {
        chunks = [];
    })
    // on data available event listener we will simply push the data in chunks array
    recorder.addEventListener("dataavailable",(e) => {
        chunks.push(e.data);
    })
    // on stop event listener conversion will take place with the help of blob this will convert 
    // the chunk array into our mp4 video format
    recorder.addEventListener("stop",(e) => {
        // conversion of chuhnk to video
        // The Blob object represents a blob, which is a file-like object of immutable, 
        // raw data; they can be read as text or binary data, or converted into a ReadableStream 
        // so its methods can be used for processing the data. Blobs can represent data that 
        // isn't necessarily in a JavaScript-native format.
        let blob = new Blob(chunks,{ type: "video/mp4" });

        // if db instance is active that means not null, we will save our video in data base
        if (db) {

            // with the help of shortid function we will generate random id
            // then we will acquire the transaction as readwrite option
            // then we will acquire the our object store for stroing video
            // then video entry object will contain two parameters unique id and blob data 
            let videoId = shortid(); 
            let dbTransaction = db.transaction("video","readwrite");
            let videoStore = dbTransaction.objectStore("video");
            let videoEntry = {
                id: `vid-${videoId}`,
                blobData: blob
            }
            videoStore.add(videoEntry);

        }

        // below code represents, how we can download the video
        // let videourl = URL.createObjectURL(blob);
        // let a = document.createElement("a");
        // a.href = videourl;
        // a.download = "stream.mp4";
        // a.click();
    })
})

// Below is the record button listener whnever it will be clicked we either have to record the video or to stop the recording
recordBtnCont.addEventListener("click", (e) => {
    // if recorder is null then return
    if(!recorder) return;

    // record flag will be toggled
    recordFlag = !recordFlag;

    // if record falg is true then we will start the recording
    if(recordFlag === true){
        //start
        recorder.start();
        // below code add a class on the record button html element, on which animation is defined in css file
        recordBtn.classList.add("scale-record");
        // now we will start our timer as well
        startTimer();
    }else{
        //stop
        recorder.stop();
        // now we will remove the class on which animation was assigned
        recordBtn.classList.remove("scale-record");
        // once recording is stopped timer will also finish
        stopTimer();
    }

})

// Below is the function which which contains click listener on capture button
captureBtnCont.addEventListener("click", (e) => {

    captureBtn.classList.add("scale-capture");

    // with the help of canvas we will try to implement filters, will assign the width and height of
    // the canvas same as that of video element
    let canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    // get context returns a drawing context
    // canvas can be used for 3d drawing as well
    let tool = canvas.getContext("2d");
    // drawimage provides different ways to draw image on canvas
    // start from top left 0 0 
    // fill complete therefore canvas height and width 
    tool.drawImage(video,0,0,canvas.width,canvas.height);

    // filtering
    // we will fill the canvas with our color
    tool.fillStyle = transparentcolor;
    tool.fillRect(0,0,canvas.width,canvas.height);

    // we have to create a url for downloading the images, canavas has built in function
    // called to data url 
    let imageURL = canvas.toDataURL();
    // below code is to directly download the imagewith the help of image url
    // let a = document.createElement("a");
    //     a.href = imageURL;
    //     a.download = "image.jpg";
    //     a.click();
    if (db) {

        // In the same way as we have stored the video we will store image as well
        // first we will open the database transaction for image as readwrite option
        // then we will open our object store for image option
        // then we will create an object which contains unique id and url for image
        // finally we will store the image object in image store
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

// below is the code to implement the timer
let timer = document.querySelector(".timer");
let timerID;
let counter = 0; // total seconds

function startTimer(){
    // whenever start timer will be called then we will display the timer
    timer.style.display = "block";
    function displayTimer(){
        
        // counter will be incremented representing seconds
        let totalseconds = counter;

        // dividing total seconds with 3600 represents 60 min and 60 sec we will get hours
        // now we have taken out hours then left time can be collected by modulous operation
        let hours = Number.parseInt(totalseconds/3600);
        totalseconds = totalseconds%3600;
        // now dividing total seconds left by 60 we will get the minutes and finally seconds
        let minutes = Number.parseInt(totalseconds/60);
        totalseconds = totalseconds%60;
        let seconds = totalseconds;

        hours = (hours < 10) ? `0${hours}` : hours;
        minutes = (minutes < 10) ? `0${minutes}` : minutes;
        seconds = (seconds < 10) ? `0${seconds}` : seconds;

        // finally we will represent the text in the timer element
        timer.innerText = `${hours}:${minutes}:${seconds}`;

        counter++;

    }
    // we have implemented a timer with the interval of 1 seconds at every one seconds this function will be called
    timerID = setInterval(displayTimer,1000);
}

// we have assigned the reference of set interval function in a timer id variable, which will be used in stop timer
// function to stop the setinterval function
function stopTimer(){
    timer.style.display = "none";
    clearInterval(timerID);
    timer.innerText = "00:00:00";
}

// filtering
// first we will acquire all filters then our filter layer class as well
let allfilters = document.querySelectorAll(".filter");
let filterLayer = document.querySelector(".filter-layer");
allfilters.forEach((filterelem) => {
    // when ever filter element will be clicked we will manipulate the back ground color accordinglt 
    // and change the style of our filter layer
    filterelem.addEventListener("click", (e) => {
         // fetch background color of elements
         transparentcolor = getComputedStyle(filterelem).getPropertyValue("background-color");
         filterLayer.style.background = transparentcolor;
    })
})

