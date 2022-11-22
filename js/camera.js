// class Camera {
//     constructor(videoNode) {
//         this.videoNode = videoNode;
//     }

//     isPowerOn() {
//         return this._videoNode.srcObject && this._stream;
//     }

//     async power() {
//         navigator.mediaDevices.getUserMedia(
//             {
//                 audio: false,
//                 video: {
//                     width: 300,
//                     height: 300
//                 }
//             }
//         ).then((stream => {
//             this.videoNode.srcObject = stream;
//             this.stream = stream;
//         }))

//     }

//     off() {

//         this.videoNode.pause();

//         if (this._stream) {
//             this._stream.getTracks()[0].stop();
//         }
//     }

//     takePhoto() {

//         let canvas = document.createElement("canvas");

//         canvas.setAttribute("width", 300);
//         canvas.setAttribute("height", 300);

//         let context = canvas.getContext("2d");

//         context.drawImage(this.videoNode, 0, 0, canvas.width, canvas.height);

//         this.photo = context.canvas.toDataURL();

//         canvas = context = null;

//         return this.photo;
//     }
// }

class Camera {
    constructor(videoNode) {
        this._videoNode = videoNode;
    }

    isPowerOn() {
        return this._videoNode.srcObject && this._stream;
    }

    async power() {

        const stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                width: 300,
                height: 300
            }
        });

        if (stream) {

            this._videoNode.srcObject = stream;
            this._stream = stream;

            return true;
        }

        return false;
    }

    off() {

        this._videoNode.pause();

        if (this._stream) {
            this._stream.getTracks()[0].stop();
        }
    }

    takePhoto() {
        let canvas = document.createElement("canvas");

        canvas.setAttribute("width", 300);
        canvas.setAttribute("height", 300);

        let context = canvas.getContext("2d");

        context.drawImage(this._videoNode, 0, 0, canvas.width, canvas.height);

        this._photo = context.canvas.toDataURL();

        canvas = context = null;

        return this._photo;
    }
}