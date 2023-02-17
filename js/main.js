
function fetchStream(stream) {
  const reader = stream.getReader();
  let charsReceived = 0;
    var result = '';
  // read() returns a promise that resolves
  // when a value has been received
  reader.read().then(function processText({ done, value }) {
    // Result objects contain two properties:
    // done  - true if the stream has already given you all its data.
    // value - some data. Always undefined when done is true.
    
    if (done) {
      console.log("Stream complete");
      //para.textContent = value;
        console.log(value);
      return;
    }

    // value for fetch streams is a Uint8Array
    charsReceived += value.length;
    const chunk = value;
    //let listItem = document.createElement('li');
    //listItem.textContent = `Received ${charsReceived} characters so far. Current chunk = ${chunk}`;
    //list2.appendChild(listItem);

      result += chunk;
      console.log(result);

    // Read some more, and call this function again
    return reader.read().then(processText);
  });
}
const getToken = () => { 
    chrome.storage.local.get(["token","profile"])
        .then(result => {

            var token = result.token;
            let requestObject = {
                method : 'GET',
                async: true,
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            }

            //https://drive.google.com/file/d/1UBD2HdIncttGiv6tAR_MUcNG-QWm6Poz/view?usp=sharing

            var fileId = '1PVn0DUx_a_Drzv_sE4Ro0WrT5_WZO7Ta'; //'1UBD2HdIncttGiv6tAR_MUcNG-QWm6Poz'; //'1PN4jqy5WKdqQptHEL6CjQKgQYUtDUosr';
            var fileurl = 'https://www.googleapis.com/drive/v3/files/' + fileId + '?alt=media';
            var searchQuery = encodeURIComponent("'1kQdUolngu1YhS9B-VXUgu0ijqc87V28e' in parents");
            var fields = encodeURIComponent('files(id,kind,mimeType,name,createdTime,modifiedTime)');
            fetch('https://www.googleapis.com/drive/v3/files?q=' + searchQuery+'&fields='+fields, requestObject)
                .then(r => r.json())
                .then(res => {
                    console.log(res);
                });
            /*
            var fileContent = {
                'name': 'ankit',
                'age': 35,
                'sex':'Male'
            }; // As a sample, upload a text file.
            var file = new Blob([ JSON.stringify(fileContent)], { type: 'text/plain' });
            var metadata = {
                'name': 'noti_'+(new Date()).toString()+'.txt', // Filename at Google Drive
                'mimeType': 'text/plain', // mimeType at Google Drive
                'parents': ['1GF5VgwN8hRcPb7q-hqDniF9vvUVTUaPl'], // Folder ID at Google Drive
            };
            
            var form = new FormData();
            form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
            form.append('file', file);

            var xhr = new XMLHttpRequest();
            xhr.open('post', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id');
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            xhr.responseType = 'json';
            xhr.onload = () => {
                console.log(xhr.response.id); // Retrieve uploaded file ID.
            };
            xhr.send(form);
            */
            
            // const fileMetadata = {
            //     name: '1.txt',
            // };
            // const media = {
            //     mimeType: 'text/plain',
            //     body: 'Hellooo! hiii'
            // };

            // let createRequestObject = {
            //     method: 'POST',
            //     async: true,
            //     headers: {
            //         Authorization: 'Bearer ' + token
            //     },
            //     body: {
            //         mimeType: 'text/plain',
            //         name: '1.txt',
            //         parents:['1GF5VgwN8hRcPb7q-hqDniF9vvUVTUaPl'],
            //         resource: fileMetadata,
            //         media: media,
            //         fields: 'id',
            //     }
            // };


            // fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', createRequestObject)
            //     .then(r => { 
            //         console.log(r);
            //     });
            

        });
}


const initPopup = () =>{

  //setTimeout(function(){

    document.querySelector('body').insertAdjacentHTML('afterend', '<div class="overlay hide"></div>');
    document.querySelector('body').insertAdjacentHTML('afterend', '<div class="popup hide"><div class="popup-header">Notification Title</div><div class="popup-body">Notification 1</div><div class="popup-footer"><button class="popup-close">Close</button></div></div>');
    document.querySelector('body').insertAdjacentHTML('afterend', '<div class="notifications hide"><div class="header">Notifications</div><div><div class="item">Test Notification 1</div><div class="item">Test Notification 2</div><div class="item">Test Notification 3</div></div></div>');

    setTimeout(function(){

      document.querySelectorAll('.notifications .item').forEach(item=>{

        item.addEventListener('click',function(){
          document.querySelector('.popup').classList.remove('hide');
          document.querySelector('.overlay').classList.remove('hide');
        });
  
      });

      document.querySelector('.popup-close').addEventListener('click',function(){
        document.querySelector('.popup').classList.add('hide');
        document.querySelector('.overlay').classList.add('hide');
      });


    },0);

    

  //},1500);



  // document.querySelector('img.gb_Fc').addEventListener('click',function(){
    
  // });

}

const init = async () => {  
  initPopup();
    getToken();
}

export const app = async () => {
    await init();
}