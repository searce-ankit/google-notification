const SCOPES = ['https://www.googleapis.com/auth/userinfo.profile','https://www.googleapis.com/auth/userinfo.email','https://www.googleapis.com/auth/drive','https://www.googleapis.com/auth/drive.readonly'];

const redirectUri = chrome.identity.getRedirectURL();
const CLIENT_ID = '652532905857-giqllspqhmlgjvpi6a8s2i2k05alp47t.apps.googleusercontent.com';

function authorizeUser() { 

    const authParams = new URLSearchParams({
        client_id: CLIENT_ID,
        response_type: 'token',
        redirect_uri: redirectUri,
       scope: SCOPES.join(' ')
    });

    const authUrl = `https://accounts.google.com/o/oauth2/auth?${authParams.toString()}`;
    
    chrome.identity.launchWebAuthFlow({ url: authUrl, interactive: true }).then(responseUrl => {
        console.log(authUrl);
        const url = new URL(responseUrl);
        const urlParams = new URLSearchParams(url.hash.slice(1));
        const params = Object.fromEntries(urlParams.entries());
        var accessToken = params['access_token'];

        chrome.storage.local.set({ 'token': accessToken }).then(() => {
            console.log(accessToken);
        });

        fetch('https://www.googleapis.com/oauth2/v2/userinfo?access_token=' + accessToken)
            .then(res => res.json())
            .then(res => {
                chrome.storage.local.set({ 'profile': res }).then(() => {
                
                });
        });

    }).catch(e => { 
        console.warn(e);
    });

}

/**
 * Check if current user has authorized this application.
 */
function checkAuth() {
  gapi.auth.authorize(
    {
      'client_id': '327128047649-06ev3uv997jfk6cparo8ad60uedesrol.apps.googleusercontent.com',
      'scope': SCOPES.join(' '),
      'immediate': true
    }, handleAuthResult);
}

/**
 * Handle response from authorization server.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
  var authorizeDiv = document.getElementById('authorize-div');
  if (authResult && !authResult.error) {
    // Hide auth UI, then load client library.
    authorizeDiv.style.display = 'none';
    loadDriveApi();
  } else {
    // Show auth UI, allowing the user to initiate authorization by
    // clicking authorize button.
    authorizeDiv.style.display = 'inline';
  }
}

/**
 * Initiate auth flow in response to user clicking authorize button.
 *
 * @param {Event} event Button click event.
 */
function handleAuthClick(event) {
  gapi.auth.authorize(
    {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
    handleAuthResult);
  return false;
}

/**
 * Load Drive API client library.
 */
function loadDriveApi() {
  gapi.client.load('drive', 'v3', function() {
    listFiles();
  });
}

/**
 * Print files.
 */
function listFiles() {
  gapi.client.drive.files.list({
    'pageSize': 10,
    'fields': "nextPageToken, files(id, name)"
  }).then(function(response) {
    var files = response.result.files;
    if (files && files.length > 0) {
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        console.log(file.name + ' (' + file.id + ')');
      }
    } else {
      console.log('No files found.');
    }
  });
}

function readDriveFile(fileUrl) {
  var fileId = fileUrl.split('/').pop();
  gapi.client.drive.files.get({
    fileId: fileId,
    alt: 'media'
  }).then(function(response) {
    console.log(response.body);
  });
}

chrome.action.onClicked.addListener(function (activeTab) {
  var newURL = chrome.runtime.getURL("popup.html");
  chrome.tabs.create({ url: newURL });
});

authorizeUser();