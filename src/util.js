import axios from "axios";
import config from "react-global-configuration";

export const doAjaxCall = (path,type,payload) => {
    return axios({
        method: type,
        url: config.get('dev.api_url') + path,
        data: payload,
        headers: { 'AuthToken': "UrM4YHgb1FcqEf1tuKwmAMMX5MxFZ12a"}       
    });
}

export const formatDate = (date) => {
    var dateObj = new Date(date);
    var month = dateObj.getMonth() + 1;
    var day = dateObj.getDate();
    var year = dateObj.getFullYear();
    return year + "-" + month + "-" + day;
}