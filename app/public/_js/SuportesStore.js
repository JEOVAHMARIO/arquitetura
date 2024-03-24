let db;
const request = indexedDB.open("Arquitetura", 1);
request.onerror = (event) => {
    console.error("Why didn't you allow my web app to use IndexedDB?!");
};
request.onsuccess = (event) => {
    db = event.target.result;
    console.log('sucesso', event);
};

request.onupgradeneeded = (event) => {
    const db = event.target.result;
    console.log('upgrade', event);

    const objectStore = db.createObjectStore("suportes", { keyPath: "id",
    autoIncrement: true });
    
};

function adicionar(suporte) {
    return new Promise((resolve, reject) => {
        let id;
        const transaction = db.transaction(["suportes"], "readwrite");
        transaction.oncomplete = (event) => {
            resolve(id);
        };
        transaction.onerror = (event) => {
            reject(new Error(event.target.error));
        };
        const objectStore = transaction.objectStore("suportes");
        const request = objectStore.add(suporte);
        request.onsuccess = (event) => {
            id = event.target.result;
        };

    });
}

function listar() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["suportes"], "readonly");
        transaction.onerror = (event) => {
            reject(new Error(event.target.error));
        };
        const objectStore = transaction.objectStore("suportes");
        const request = objectStore.getAll();
        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
    
    });
}

function deletar(id) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["suportes"], "readwrite");
        transaction.onerror = (event) => {
            reject(new Error(event.target.error));
        };
        const objectStore = transaction.objectStore("suportes");
        const request = objectStore.delete(id);
        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
    
    });
}