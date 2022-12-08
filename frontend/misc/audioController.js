
export const convertTime = (duration) => {

    if (duration) {
        const hrs = duration / 60000;
        const minute = hrs.toString().split(".")[0];
        const percent = hrs - parseInt(minute);
        const sec = Math.ceil((60 * percent));
        if (parseInt(minute) < 10 && sec < 10) {
            return `0${minute}:0${sec}`;
        }

        if (parseInt(minute) < 10) {
            return `0${minute}:${sec}`;
        }

        if (sec < 10) {
            return `${minute}:0${sec}`;
        }
        return `${minute}:${sec}`;
    }
};