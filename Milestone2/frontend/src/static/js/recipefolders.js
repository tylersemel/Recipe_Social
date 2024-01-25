import api from './apiClient.js';
const folderBox = document.querySelector("#folderbox");

api.getCurrentUser().then(user => {
    console.log(user);

    api.getUserFolders(user.id).then(folders => {
        
        console.log(folders);
        folders.forEach(folder => createFolderHTML(folder));
    });
    
    function createFolderHTML(folder) {
        console.log(folder);
        const folderTag = document.createElement('a');
        folderTag.id = "folder"
        folderTag.href = "/" + folder.id + "/recipes";
    
        const folderIMG = document.createElement('img');
        folderIMG.src = folder.img;
        folderIMG.id = "folder-image";
        folderTag.appendChild(folderIMG);
    
        const folderName = document.createElement('p');
        folderName.innerHTML = folder.name;
        folderTag.appendChild(folderName);
    
        folderBox.appendChild(folderTag);
    }
}).catch(err => {
    document.location = "/";
});




