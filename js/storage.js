async function onloadFunc() {
    await loadData();
    await loadTasks();
}


const BASE_URL = "https://remotestorage-2c309-default-rtdb.europe-west1.firebasedatabase.app/";

async function loadData() {
    let response = await fetch(BASE_URL + "users.json");
    let usersData = await response.json();

    // Überprüfen, ob Daten vorhanden sind
    if (usersData) {
        // Iteriere durch die Benutzerdaten und füge sie dem users-Array hinzu
        Object.keys(usersData).forEach(key => {
            users.push(usersData[key]);
        });
    }
}

async function loadTasks(){
    let response = await fetch(BASE_URL + "tasks.json");
    let tasksData = await response.json();

    // Überprüfen, ob Daten vorhanden sind
    if (tasksData) {
        // Iteriere durch die Benutzerdaten und füge sie dem users-Array hinzu
        Object.keys(tasksData).forEach(key => {
            tasks.push(tasksData[key]);
        });
    }
}


async function postData(path="", data={}){
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return responseToJson = await response.json();
}


async function deleteData(path=""){
    let response = await fetch(BASE_URL + path + ".json", {
        method: "DELETE",
    });
    return responseToJson = await response.json();
}


async function putData(path="", data={}){
    let response = await fetch(BASE_URL + path + ".json", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return responseToJson = await response.json();
}





const STORAGE_TOKEN = 'CtxTcEZlVAPVkjOjpZldtlcmqUaZRJ2I2WAuicYHaD9MSDiKX9dIFrhP8kxmEUqz';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';

async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => res.json());
}

async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json()).then(res => {
        if (res.data) {
            return res.data.value;
        } throw `Could not find data with key "${key}".`;
    });
}

