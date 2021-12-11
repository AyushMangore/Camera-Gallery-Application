setTimeout(() => {
    // to add some delay we will encapsulate our code in set time out function
    if (db) {
        // retrieving data
        // video first
        // acquiring transaction for the video as read only option
        // and then acquiring video store for the video
        // funally we will get all the elements
        let dbTransaction = db.transaction("video","readonly");
        let videoStore = dbTransaction.objectStore("video");
        let videoRequest = videoStore.getAll();
        videoRequest.onsuccess = (e) => {
            // iterating through the videos stored in the data base
            let videoResult = videoRequest.result;

            let galleryCont = document.querySelector(".gallery-cont");

            console.log(videoResult)
            videoResult.forEach((videoObj) => {
                // we will create a div element and the nadd a class of media-cont
                // then we will set unique id which is stored in the database
                let mediaElem = document.createElement("div");
                mediaElem.setAttribute("class","media-cont");
                mediaElem.setAttribute("id",videoObj.id);

                // here is the url accessng through the data base
                let url = URL.createObjectURL(videoObj.blobData);

                // creating the video element and passing url to add the functionality of video autoplay
                mediaElem.innerHTML = `
                <div class="media">
                <video autoplay loop src="${url}"></video>
                </div>
                <div class="delete action-btn">DELETE</div>
                <div class="download action-btn">DOWNLOAD</div>
                `
                // finally we will assign this in our gallery container
                galleryCont.appendChild(mediaElem);

                // if delete or download button will be clicked these operation will be handled in different function
                let deletebtn = mediaElem.querySelector(".delete");
                deletebtn.addEventListener("click",deleteListener);
                let downloadbtn = mediaElem.querySelector(".download");
                downloadbtn.addEventListener("click",downloadListener);
                
            })
        }

        //image
        // Now we will add images in gallery container
        // first we will open the transaction for image as read only
        // then we will open the image store for the image option
        // then get all the data with image as  key
        let dbTransactionimg = db.transaction("image","readonly");
        let imageStore = dbTransactionimg.objectStore("image");
        let imageRequest = imageStore.getAll();
        imageRequest.onsuccess = (e) => {
            let imageResult = imageRequest.result;

            let galleryCont = document.querySelector(".gallery-cont");

            console.log(imageResult)
            imageResult.forEach((imageObj) => {
                // iterating through all the image elements we will create a image element for them
                let mediaElem = document.createElement("div");
                mediaElem.setAttribute("class","media-cont");
                mediaElem.setAttribute("id",imageObj.id);

                // accessing url data from the database
                let url = imageObj.url;

                // now we will create the inner html as same as video element but tag will be different
                mediaElem.innerHTML = `
                <div class="media">
                <img src="${url}"></img>
                </div>
                <div class="delete action-btn">DELETE</div>
                <div class="download action-btn">DOWNLOAD</div>
                `
                // now we will append the element in gallery container
                galleryCont.appendChild(mediaElem);

                // delete and download operation will be handled separately
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
    // fetching id of the html element
    // first three letter of the id contains either vid or img
    let id = e.target.parentElement.getAttribute("id");
    let type = id.slice(0,3);
    if(type === "vid"){
        // if type is vid
        // acquiring the transaction
        // then acquiring the video store
        // and finaaly delete the element with the help of id
        let dbTransaction = db.transaction("video","readwrite");
        let videoStore = dbTransaction.objectStore("video");
        videoStore.delete(id);
    }else if(type == "img"){
        // if type is img
        // acquiring the transaction
        // then acquiring the image store
        // and finaaly delete the element with the help of id
        let dbTransactionimg = db.transaction("image","readwrite");
        let imageStore = dbTransactionimg.objectStore("image");
        imageStore.delete(id);
    }

    //ui removal
    e.target.parentElement.remove();
}

// If download button will be clicked
function downloadListener(e){
    // first fetching the html element id
    let id = e.target.parentElement.getAttribute("id");
    let type = id.slice(0,3);
    if(type === "vid"){
        // if the type is vid
        // acquiring the transaction
        // acquiring the object store
        // now getting the particular video element with the help of unique id
        let dbTransaction = db.transaction("video","readwrite");
        let videoStore = dbTransaction.objectStore("video");
        let videoRequest = videoStore.get(id);
        videoRequest.onsuccess = (e) => {
            let videoResult = videoRequest.result;
            console.log(videoResult);
        // we need a url to download which is there in the data base
         let videourl = URL.createObjectURL(videoResult.blobData);

        //  creating an anchor element and adding link as our url and finaaly download as stram.mp4 file
         let a = document.createElement("a");
         a.href = videourl;
         a.download = "stream.mp4";
         a.click();
        }
    }else if(type === "img"){
        // if the type is img
        // acquiring the transaction
        // acquiring the object store
        // now getting the particular image element with the help of unique id
        let imgdbTransaction = db.transaction("image","readwrite");
        let imageStore = imgdbTransaction.objectStore("image");
        let imageRequest = imageStore.get(id);
        imageRequest.onsuccess = (e) => {
            let imageResult = imageRequest.result;
            console.log(imageResult);
                // we need a url to download which is there in the data base
                //  creating an anchor element and adding link as our url and finaaly download as image.jpg file
                let a = document.createElement("a");
                a.href = imageResult.url;
                a.download = "image.jpg";
                a.click();
    }
}
}