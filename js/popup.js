function addNewNotification(fileContent,token) { 

            var fileId = '1PVn0DUx_a_Drzv_sE4Ro0WrT5_WZO7Ta'; //"1PVn0DUx_a_Drzv_sE4Ro0WrT5_WZO7Ta";
            var file = new Blob([ JSON.stringify(fileContent)], { type: 'text/plain' });
            var metadata = {
                'name': 'notification_'+(new Date()).toISOString() +'.txt', // Filename at Google Drive
                'mimeType': 'text/plain', // mimeType at Google Drive
                'parents': ['1kQdUolngu1YhS9B-VXUgu0ijqc87V28e'], // Folder ID at Google Drive
            };
            
            //var form = new FormData();
            //form.append('metadata', new Blob([JSON.stringify(metadata1)], {type: 'application/json'}));
            //form.append('file', file);

            var xhr = new XMLHttpRequest();
            //xhr.open('post', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id');
            xhr.open('PATCH', 'https://www.googleapis.com/upload/drive/v3/files/'+fileId+'?uploadType=media');
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            xhr.responseType = 'json';
            xhr.onload = () => {
                const successMessage = document.getElementById('form-success');
                successMessage.textContent = 'Notification Created Successfully!';
                successMessage.classList.remove('message-hide');
                clearForm();
                setTimeout(clearMessage, 5000);
                //console.log(xhr.response.id); // Retrieve uploaded file ID.
            };
            xhr.onerror = () => { 
                const errorMessage = document.getElementById('form-error');
                errorMessage.textContent = 'Error! Something went wrong, please try again.';
                errorMessage.classList.remove('message-hide');
                setTimeout(clearMessage, 5000);
            }
            xhr.send(file);
            //xhr.send(form);
}

function createNotificationDocument(event) { 
    chrome.storage.local.get(["token", "profile"])
        .then(result => { 
            clearMessage();
            var token = result.token;
            const expiry = document.getElementById('form-expiry').value;
            const content = document.getElementById('form-content').value;
            const link = document.getElementById('form-link').value;
            
            

            getNotifications(token)
                .then(res => {
                    var jsonData = JSON.parse(res);
                    
                    var fileContent = {
                        'expiry': expiry,
                        'link': link,
                        'content': content
                    }; 
                    
                    var list = [];
                    if (Array.isArray(jsonData)) {
                        list = [fileContent, ...jsonData];
                    } else { 
                        list = [fileContent, jsonData];
                    }

                    addNewNotification(list,token);
                });

        });
}



function clearForm() { 
    document.getElementById('form-expiry').value='';
    document.getElementById('form-content').value='';
    document.getElementById('form-link').value='';
}
function clearMessage() { 
    document.getElementById('form-success').classList.add('message-hide');
    document.getElementById('form-error').classList.add('message-hide');
}

function bindEvents() { 
    const cancelButton = document.getElementById('ext-btn-cancel');
    const submitButton = document.getElementById('ext-btn-submit');

    cancelButton.addEventListener('click', event => {
        window.close();
    });

    submitButton.addEventListener('click', createNotificationDocument);
}

function getNotifications(token) {

    let requestObject = {
        method: 'GET',
        async: true,
        headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
    };
    var fileId = "1PVn0DUx_a_Drzv_sE4Ro0WrT5_WZO7Ta"; //"1hJFVMykj1gvT3hHfxf0LyVYLuvkAqpba";
    var fileurl = 'https://www.googleapis.com/drive/v3/files/' + fileId + '?alt=media';
   return fetch(fileurl, requestObject)
        .then(r => r.text());
}

function populateNotifications() { 
    chrome.storage.local.get(["token"])
        .then(result => { 
            
            getNotifications(result.token)
                .then(res => {
                    var jsonData = JSON.parse(res);
                    console.log(jsonData);
                });

        });
}

function initializePopup() { 
    bindEvents();
    populateNotifications();
}

initializePopup();