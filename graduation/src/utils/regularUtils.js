//判断经度
export function isLng(str) {
    var reg=/^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/;
    return reg.test(str);
}
//判断纬度
export function isLat(str) {
    var reg=/^(\-|\+)?([0-8]?\d{1}\.\d{0,6}|90\.0{0,6}|[0-8]?\d{1}|90)$/;
    return reg.test(str);
}


