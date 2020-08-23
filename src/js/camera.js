import CanvasProcessor from "./lib/canvas-processor";

window.onload = () => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    const baseCanvas = document.getElementById("baseCanvas");
    const baseContext = baseCanvas.getContext("2d");
    const video = document.getElementById("video");
    navigator.mediaDevices.getUserMedia({
            video: true
        }).then(stream => {
            video.srcObject = stream;
            video.play();
            updateCanvas();
        })
        .catch(err => {
            alert("このアプリを使用するには、カメラの使用を許可してください。");
        });

    const updateCanvas = () => {
        if (baseCanvas.width === 0) {
            baseCanvas.width = video.videoWidth;
            baseCanvas.height = video.videoHeight;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            requestAnimationFrame(updateCanvas);
            return;
        }
        baseContext.drawImage(video, 0, 0);
        pickupSkinColor();

        requestAnimationFrame(updateCanvas);
    };

    const pickupSkinColor = () =>{
        //元画像のRGB値を配列で取り出す
        const currentImageData = baseContext.getImageData(0, 0, canvas.width, canvas.height);
        //更新用のRGB値配列を作成
        const newImageData = context.createImageData(canvas.width, canvas.height);
        for (let i = 0; i < canvas.height; i++) {
            for (let j = 0; j < canvas.width; j++) {
                const r = currentImageData.data[j * 4 + i * currentImageData.width * 4];
                const g = currentImageData.data[1 + j * 4 + i * currentImageData.width * 4];
                const b = currentImageData.data[2 + j * 4 + i * currentImageData.width * 4];
                const a = currentImageData.data[3 + j * 4 + i * currentImageData.width * 4];
                const hsv = CanvasProcessor.RGB2HSV(r, g, b);

                if ((hsv.h >= 0 && hsv.h <= 20 || hsv.h >= 340) && hsv.s >= 10 && hsv.s <= 150 && hsv.v >= 60 && hsv.v <= 255) {
                    newImageData.data[j * 4 + i * newImageData.width * 4] = r;
                    newImageData.data[1 + j * 4 + i * newImageData.width * 4] = g;
                    newImageData.data[2 + j * 4 + i * newImageData.width * 4] = b;
                    newImageData.data[3 + j * 4 + i * newImageData.width * 4] = a;
                }else{
                    newImageData.data[j * 4 + i * newImageData.width * 4] = 0;
                    newImageData.data[1 + j * 4 + i * newImageData.width * 4] = 0;
                    newImageData.data[2 + j * 4 + i * newImageData.width * 4] = 0;
                    newImageData.data[3 + j * 4 + i * newImageData.width * 4] = 0;
                }
                /*
                const newRGB = CanvasProcessor.HSV2RGB(hsv.h, hsv.s, hsv.v);
                newImageData.data[j * 4 + i * newImageData.width * 4] = newRGB.r;
                newImageData.data[1 + j * 4 + i * newImageData.width * 4] = newRGB.g;
                newImageData.data[2 + j * 4 + i * newImageData.width * 4] = newRGB.b;
                newImageData.data[3 + j * 4 + i * newImageData.width * 4] = a;
                */
            }
        }
        context.putImageData(newImageData, 0, 0);
    };
};