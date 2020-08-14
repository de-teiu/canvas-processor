import CanvasProcessor from "./lib/canvas-processor";

import IMAGE_PATH from "../images/kakapo.png";
window.onload = () => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    const baseCanvas = document.getElementById("baseCanvas");
    const baseContext = baseCanvas.getContext("2d");
    loadImage(IMAGE_PATH, (image) => {
        baseCanvas.width = image.width;
        baseCanvas.height = image.height;
        canvas.width = image.width;
        canvas.height = image.height;
        baseContext.drawImage(image,0,0,canvas.width,canvas.height);
        updateCanvas();
    });

    const hueDom = document.getElementById("hue");
    const saturationDom = document.getElementById("saturation");
    const brightnessDom = document.getElementById("brightness");

    const updateCanvas = () => {
        const hueMod = Number(hueDom.value);
        const saturationMod = Number(saturationDom.value);
        const brightnessMod = Number(brightnessDom.value);
        
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
                hsv.h += Number(hueMod);
                if (hsv.h >= 360) {
                    hsv.h -= 360;
                }else if(hsv.h < 0){
                    hsv.h += 360;
                }
                hsv.s *= saturationMod;
                hsv.v *= brightnessMod;

                const newRGB = CanvasProcessor.HSV2RGB(hsv.h, hsv.s, hsv.v);
                newImageData.data[j * 4 + i * newImageData.width * 4] = newRGB.r;
                newImageData.data[1 + j * 4 + i * newImageData.width * 4] = newRGB.g;
                newImageData.data[2 + j * 4 + i * newImageData.width * 4] = newRGB.b;
                newImageData.data[3 + j * 4 + i * newImageData.width * 4] = a;
            }
        }
        context.putImageData(newImageData, 0, 0);
    };

    hueDom.addEventListener("input", updateCanvas);
    saturationDom.addEventListener("input", updateCanvas);
    brightnessDom.addEventListener("input", updateCanvas);
};

/**
 * 指定したファイルパスの画像を読み込む
 * @param {*} path ファイルパス
 * @param {*} callback 読み込み完了時のコールバック
 */
const loadImage = (path,callback) =>{
    const image = new Image();
    image.src = path;
    image.onload = () => {
        callback(image);
    };
};