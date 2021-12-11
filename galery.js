setTimeout(() => {
    if (db) {
        // retrieving data
        // video
        let dbTransaction = db.transaction("video","readonly");
        let videoStore = dbTransaction.objectStore("video");
        let videoRequest = videoStore.getAll();
        videoRequest.onsuccess = (e) => {
            let videoResult = videoRequest.result;

            let galleryCont = document.querySelector(".gallery-cont");

            console.log(videoResult)
            videoResult.forEach((videoObj) => {
                let mediaElem = document.createElement("div");
                mediaElem.setAttribute("class","media-cont");
                mediaElem.setAttribute("id",videoObj.id);

                let url = URL.createObjectURL(videoObj.blobData);

                mediaElem.innerHTML = `
                <div class="media">
                <video autoplay loop src="${url}"></video>
                </div>
                <div class="delete action-btn">DELETE</div>
                <div class="download action-btn">DOWNLOAD</div>
                `
                galleryCont.appendChild(mediaElem);

                let deletebtn = mediaElem.querySelector(".delete");
                deletebtn.addEventListener("click",deleteListener);
                let downloadbtn = mediaElem.querySelector(".download");
                downloadbtn.addEventListener("click",downloadListener);
                
            })
        }

        //image
        let dbTransactionimg = db.transaction("image","readonly");
        let imageStore = dbTransactionimg.objectStore("image");
        let imageRequest = imageStore.getAll();
        imageRequest.onsuccess = (e) => {
            let imageResult = imageRequest.result;

            let galleryCont = document.querySelector(".gallery-cont");

            console.log(imageResult)
            imageResult.forEach((imageObj) => {
                let mediaElem = document.createElement("div");
                mediaElem.setAttribute("class","media-cont");
                mediaElem.setAttribute("id",imageObj.id);

                let url = imageObj.url;

                mediaElem.innerHTML = `
                <div class="media">
                <img src="${url}"></img>
                </div>
                <div class="delete action-btn">DELETE</div>
                <div class="download action-btn">DOWNLOAD</div>
                `
                galleryCont.appendChild(mediaElem);

                let deletebtn = mediaElem.querySelector(".delete");
                deletebtn.addEventListener("click",deleteListener);
                let downloadbtn = mediaElem.querySelector(".download");
                downloadbtn.addEventListener("click",downloadListener);
                galleryCont.appendChild(mediaElem);
            })
        }
    }
},100)

// ui remove and db remove
function deleteListener(e){
    // db removal
    let id = e.target.parentElement.getAttribute("id");
    let type = id.slice(0,3);
    if(type === "vid"){
        let dbTransaction = db.transaction("video","readwrite");
        let videoStore = dbTransaction.objectStore("video");
        videoStore.delete(id);
    }else if(type == "img"){
        let dbTransactionimg = db.transaction("image","readwrite");
        let imageStore = dbTransactionimg.objectStore("image");
        imageStore.delete(id);
    }

    //ui removal
    e.target.parentElement.remove();
}

function downloadListener(e){
    let id = e.target.parentElement.getAttribute("id");
    let type = id.slice(0,3);
    if(type === "vid"){
        let dbTransaction = db.transaction("video","readwrite");
        let videoStore = dbTransaction.objectStore("video");
        let videoRequest = videoStore.get(id);
        videoRequest.onsuccess = (e) => {
            let videoResult = videoRequest.result;
            console.log(videoResult);
        
         let videourl = URL.createObjectURL(videoResult.blobData);

         let a = document.createElement("a");
         a.href = videourl;
         a.download = "stream.mp4";
         a.click();
        }
    }else if(type === "img"){
        let imgdbTransaction = db.transaction("image","readwrite");
        let imageStore = imgdbTransaction.objectStore("image");
        let imageRequest = imageStore.get(id);
        imageRequest.onsuccess = (e) => {
            let imageResult = imageRequest.result;
            console.log(imageResult);

                let a = document.createElement("a");
                a.href = imageResult.url;
                a.download = "image.jpg";
                a.click();
    }
}
}