class Util {
    isUndefinedString(str) {
        if(str.length == 0 || str == "" || !str || str == null || str == undefined) return true;
        return false;
    }
}

export default new Util();