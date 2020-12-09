// import axios from 'axios';
import {Utils} from './utils.service';
const KEY = 'IMG';

export const cloudinary = {
    uploadImg
}

async function uploadImg(target) {
    if (!target) {
        let img = Utils.loadFromStorage(KEY);
        if (!img) {
            img = 'http://res.cloudinary.com/coding-academy/image/upload/v1607019651/zb15zgebqolsjccs3a9i.jpg';
            Utils.storeToStorage(KEY,img);
        }
        return img;
    }
    const CLOUD_NAME = "coding-academy"
    const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

    const formData = new FormData();
    formData.append('file', target.files[0])
    formData.append('upload_preset', 'hxpsra0y');
    try {
        const res = await fetch(UPLOAD_URL, {
            method: 'POST',
            body: formData
        })
        const data = await res.json()
        Utils.storeToStorage(KEY,data.url)
        return data.url

    } catch (err) {
        console.log(err);
    }
    // .then(res => res.json())
    // .then(res => {
    //     console.log(res)
    //     // res.secure_url
    //     return res
    // })
    // .catch (err => console.error(error))
}
