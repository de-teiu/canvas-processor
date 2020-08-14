/**
 * 色相を計算する
 * @param {*} r 赤
 * @param {*} g 緑
 * @param {*} b 青
 * @param {*} max RGBの最大値
 * @param {*} min RGBの最小値
 * @returns {*} 色相
 */
const calcHue = (r, g, b,max,min) => {
    let h;
    let offset;
    let c1;
    let c2;
    if (r >= g && r >= b) {
        //Rが最大の時
        offset = 0;
        c1 = g;
        c2 = b;
    } else if (g >= r && g >= b) {
        //Gが最大の時
        offset = 120;
        c1 = b;
        c2 = r;
    } else {
        //Bが最大の時
        offset = 240;
        c1 = r;
        c2 = g;
    }
    h = Math.round(60 * ((c1 - c2) / (max - min)) + offset);

    if (h < 0) {
        h += 360;
    }
    return h;
};

const CanvasProcessor = {};

/**
 * RGB値をHSV値に変換する
 * @param {*} r 赤
 * @param {*} g 緑
 * @param {*} b 青
 * @returns {*} HSV値
 */
CanvasProcessor.RGB2HSV = (r,g,b) => {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    //色相(H)
    const h = calcHue(r,g,b,max,min);
    //彩度(S)
    const s = Math.round((max - min) / max * 255);
    //明度(V)
    const v = max;

    return {h,s,v};
};

/**
 * HSV値をRGB値に変換
 * @param {*} h 色相
 * @param {*} s 彩度
 * @param {*} v 明度
 * @returns RGB値
 */
CanvasProcessor.HSV2RGB = (h,s,v) => {
    const max = v;
    const min = Math.round(max - ((s / 255) * max));

    if (h < 60) {
        return {
            r: max,
            g: Math.round((h / 60) * (max - min) + min),
            b: min
        }
    } else if (h < 120) {
        return {
            r: Math.round(((120 - h) / 60) * (max - min) + min),
            g: max,
            b: min
        }
    } else if (h < 180) {
        return {
            r: min,
            g: max,
            b: Math.round(((h - 120) / 60) * (max - min) + min)
        }
    } else if (h < 240) {
        return {
            r: min,
            g: Math.round(((240 - h) / 60) * (max - min) + min),
            b: max
        }
    } else if (h < 300) {
        return {
            r: Math.round(((h - 240) / 60) * (max - min) + min),
            g: min,
            b: max
        }
    } else {
        return {
            r: max,
            g: min,
            b: Math.round(((360 - h) / 60) * (max - min) + min)
        }
    }
};

/**
 * RGB値をグレースケール値に変換
 * @param {*} r 赤
 * @param {*} g 緑
 * @param {*} b 青
 * @returns {*} グレースケール値
 */
CanvasProcessor.RGB2Gray = (r,g,b) =>{
    return Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
};

/**
 * RGB値をセピア色に変換
 * @param {*} r 赤
 * @param {*} g 緑
 * @param {*} b 青
 * @returns {*} 変換後のRGB値
 */
CanvasProcessor.RGB2Sepia = (r,g,b) => {
    const gray = CanvasProcessor.RGB2Gray(r,g,b);
    const newR = Math.round(gray * 0.95);
    const newG = Math.round(gray * 0.7);
    const newB = Math.round(gray * 0.4);
    return {
        r: newR,g:newG,b:newB
    };
};

/**
 * RGB値を指定した閾値で二値化
 * @param {*} r 赤
 * @param {*} g 緑
 * @param {*} b 青
 * @param {*} threshold 閾値
 */
CanvasProcessor.binarization = (r,g,b,threshold) =>{
    const gray = CanvasProcessor.RGB2Gray(r,g,b);
    return gray > threshold ? 255 : 0;
};



export default CanvasProcessor;