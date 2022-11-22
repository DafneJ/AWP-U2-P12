


console.log("app importado");
// const btnCamera = document.getElementById("btnCamera");
// const videoCamera = document.getElementById("videoCamera");
// const btnTakePhoto = document.getElementById("btnTakePhoto");
// const carouselContentInner = document.getElementById("carouselContentInner");

// const camera = new Camera(videoCamera);
// const video = document.getElementById('video')
// const photo = document.getElementById('photo')
// btnCamera.addEventListener('click', ()=> {
//     console.log("open camera");
//     camera.power();

// })

// btnTakePhoto.addEventListener('click', ()=> {
//     console.log("take photo");
//     let picture = camera.takePhoto();
//     console.log(picture);
//     camera.off();

//     photo.setAttribute("src".picture)
// })

const ROOT_PATH = "/AWP-U2-P12";
 
if (navigator.serviceWorker) {
    navigator.serviceWorker.register(`${ROOT_PATH}/sw.js`);
  //  navigator.serviceWorker.register("/sw.js");
}

const btnCamera = document.getElementById("btnCamera");
const videoCamera = document.getElementById("videoCamera");
const btnTakePhoto = document.getElementById("btnTakePhoto");
const carouselContentInner = document.getElementById("carouselContentInner");

// Elements to show message
const divToast = document.getElementById("divToast");
const divToastMessage = document.getElementById("divToastMessage");

let firstTime = true;

const camera = new Camera(videoCamera);

const showToast = (status, message) => {
    // Limpia el toast
    divToast.classList.remove('text-bg-success', 'text-bg-danger');

    // Asigna la información
    divToast.classList.add(`text-bg-${status ? 'success' : 'danger'}`);
    divToastMessage.innerHTML = message;

    // Muestra el toast
    new bootstrap.Toast(divToast).show();
}


btnCamera.addEventListener('click', async (event) => {
    const status = await camera.power();
    console.log("ok");
});
 
btnTakePhoto.addEventListener('click', (event) => {

    if (camera.isPowerOn()) {
        let photo = camera.takePhoto();
        camera.off();
    
        console.log(carouselContentInner.innerHTML);
    
        carouselContentInner.innerHTML += `
            <div class="carousel-item ${firstTime ? ' active' : ''}">
                <img src="${photo}" class="d-block w-100">
            </div>  
        `;
    
        firstTime = false;
    } else {
        console.log("Encender camaras");
       
    }
});