window.onload = function() {
    const useNodeJS = true;   // if you are not using a node server, set this value to false
    const defaultLiffId = "";   // change the default LIFF value if you are not using a node server

    // DO NOT CHANGE THIS
    let myLiffId = "";

    // if node is used, fetch the environment variable and pass it to the LIFF method
    // otherwise, pass defaultLiffId
    if (useNodeJS) {
        fetch('/send-id')
            .then(function(reqResponse) {
                return reqResponse.json();
            })
            .then(function(jsonResponse) {
                myLiffId = jsonResponse.id;
                initializeLiffOrDie(myLiffId);
            })
            .catch(function(error) {
                document.getElementById("liffAppContent").classList.add('hidden');
                document.getElementById("nodeLiffIdErrorMessage").classList.remove('hidden');
            });
    } else {
        myLiffId = defaultLiffId;
        initializeLiffOrDie(myLiffId);
    }
};

/**
* Check if myLiffId is null. If null do not initiate liff.
* @param {string} myLiffId The LIFF ID of the selected element
*/
function initializeLiffOrDie(myLiffId) {
    if (!myLiffId) {
        document.getElementById("liffAppContent").classList.add('hidden');
        document.getElementById("liffIdErrorMessage").classList.remove('hidden');
    } else {
        initializeLiff(myLiffId);
    }
}

/**
* Initialize LIFF
* @param {string} myLiffId The LIFF ID of the selected element
*/
function initializeLiff(myLiffId) {
    liff
        .init({
            liffId: myLiffId
        })
        .then(() => {
            // start to use LIFF's api
            initializeApp();
        })
        .catch((err) => {
            document.getElementById("liffAppContent").classList.add('hidden');
            document.getElementById("liffInitErrorMessage").classList.remove('hidden');
        });
}

/**
 * Initialize the app by calling functions handling individual app components
 */
function initializeApp() {
    // displayLiffData();
    displayIsInClientInfo();
    registerButtonHandlers();
    fetchProfile();

    // check if the user is logged in/out, and disable inappropriate button
    if (liff.isLoggedIn()) {
        document.getElementById('liffLoginButton').hidden = true;
    } else {
        document.getElementById('liffLogoutButton').hidden = true;
    }
}

// ambil username dan photo profil line user
function fetchProfile(){
  liff.getProfile()
    .then(profile => {
      document.getElementById('fetchName').textContent = profile.displayName;
      document.getElementById('fetchPhoto').src = profile.pictureUrl;
      /** Testing **/
      console.log(profile.displayName);
    })
    .catch((err) => {
      console.log('error', err);
    });
}

/**
* Toggle the login/logout buttons based on the isInClient status, and display a message accordingly
*/
function displayIsInClientInfo() {
    if (liff.isInClient()) {
        document.getElementById('liffLoginButton').classList.toggle('hidden');
        document.getElementById('liffLogoutButton').classList.toggle('hidden');
        document.getElementById('isInClientMessage').textContent = 'Kamu buka aplikasi nya via Line.';
    } else {
        document.getElementById('isInClientMessage').textContent = 'Kamu buka aplikasi nya via browser';
        document.getElementById('shareTargetPicker').classList.toggle('hidden');
    }
}

/**
* Register event handlers for the buttons displayed in the app
*/
function registerButtonHandlers() {

    // openWindow call
    document.getElementById('openWindowButton').addEventListener('click', function() {
        liff.openWindow({
            url: 'https://liff-orderkeun.herokuapp.com',
            external: true
        });
    });

    // closeWindow call
    document.getElementById('closeWindowButton').addEventListener('click', function() {
        if (!liff.isInClient()) {
            sendAlertIfNotInClient();
        } else {
            liff.closeWindow();
        }
    });

    // sendMessages call
    document.getElementById('sendMessageButton').addEventListener('click', function() {
        if (!liff.isInClient()) {
            sendAlertIfNotInClient();
        } else {
          var showConfirm = confirm("Pesan yang ini ?")
          if (showConfirm == true){
            liff.sendMessages([{
                'type': 'text',
                'text': "You've successfully sent a message! Hooray!"
            }]).then(function() {
                window.alert('Message sent');
            }).catch(function(error) {
                window.alert('Error sending message: ' + error);
            });
            liff.closeWindow();
            }
          else{}
        }
    });

    // scanCode call
    document.getElementById('scanQrCodeButton').addEventListener('click', function() {
        if (!liff.isInClient()) {
            sendAlertIfNotInClient();
        } else {
            liff.scanCode().then(result => {
                // e.g. result = { value: "Hello LIFF app!" }
                const stringifiedResult = JSON.stringify(result);
                document.getElementById('scanQrField').textContent = stringifiedResult;
                toggleQrCodeReader();
            }).catch(err => {
                document.getElementById('scanQrField').textContent = "scanCode failed!";
            });
        }
    });

    // get access token
    document.getElementById('getAccessToken').addEventListener('click', function() {
        if (!liff.isLoggedIn() && !liff.isInClient()) {
            alert('To get an access token, you need to be logged in. Please tap the "login" button below and try again.');
        } else {
            const accessToken = liff.getAccessToken();
            document.getElementById('accessTokenField').textContent = accessToken;
            toggleAccessToken();
        }
    });

    // get profile call
    // document.getElementById('getProfileButton').addEventListener('click', function() {
    //     liff.getProfile().then(function(profile) {
    //         document.getElementById('userIdProfileField').textContent = profile.userId;
    //         document.getElementById('displayNameField').textContent = profile.displayName;
    //
    //         const profilePictureDiv = document.getElementById('profilePictureDiv');
    //         if (profilePictureDiv.firstElementChild) {
    //             profilePictureDiv.removeChild(profilePictureDiv.firstElementChild);
    //         }
    //         const img = document.createElement('img');
    //         img.src = profile.pictureUrl;
    //         img.alt = 'Profile Picture';
    //         profilePictureDiv.appendChild(img);
    //
    //         document.getElementById('statusMessageField').textContent = profile.statusMessage;
    //         toggleProfileData();
    //     }).catch(function(error) {
    //         window.alert('Error getting profile: ' + error);
    //     });
    // });

    document.getElementById('shareTargetPicker').addEventListener('click', function () {
        if (liff.isApiAvailable('shareTargetPicker')) {
            liff.shareTargetPicker([{
                'type': 'text',
                'text': 'Hello, World!'
            }]).then(
                document.getElementById('shareTargetPickerMessage').textContent = "Share target picker was launched."
            ).catch(function (res) {
                document.getElementById('shareTargetPickerMessage').textContent = "Failed to launch share target picker.";
            });
        }
    });

    // login call, only when external browser is used
    document.getElementById('liffLoginButton').addEventListener('click', function() {
        if (!liff.isLoggedIn()) {
            // set `redirectUri` to redirect the user to a URL other than the front page of your LIFF app.
            liff.login();
        };
      });

    // logout call only when external browse
    document.getElementById('liffLogoutButton').addEventListener('click', function() {
        if (liff.isLoggedIn()) {
            liff.logout();
            window.location.reload();
        }
    });
}

/**
* Alert the user if LIFF is opened in an external browser and unavailable buttons are tapped
*/
function sendAlertIfNotInClient() {
    alert('This button is unavailable as LIFF is currently being opened in an external browser.');
}

/**
* Toggle access token data field
*/
function toggleAccessToken() {
    toggleElement('accessTokenData');
}

/**
* Toggle profile info field
*/
function toggleProfileData() {
    toggleElement('profileInfo');
}

/**
* Toggle scanCode result field
*/
function toggleQrCodeReader() {
    toggleElement('scanQr');
}

/**
* Toggle specified element
* @param {string} elementId The ID of the selected element
*/
function toggleElement(elementId) {
    const elem = document.getElementById(elementId);
    if (elem.offsetWidth > 0 && elem.offsetHeight > 0) {
        elem.style.display = 'none';
    } else {
        elem.style.display = 'block';
    }
}
