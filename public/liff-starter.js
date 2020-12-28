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
    displayIsInClientInfo();
    registerButtonHandlers();
    fetchProfile();

    // check if the user is logged in/out, and hidden inappropriate button
    if (liff.isLoggedIn()) {
        document.getElementById('liffLogoutButton').style = "";
    } else {
        document.getElementById('liffLoginButton').style = "";
    }
}

// fetching clinet display name and photo when app on load
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

// function for sending msg into app and fetch chosen product
function pesan(paket,harga){
    if (!liff.isInClient()) {
        sendAlertIfNotInClient();
    } else {
      var showConfirm = confirm("Pesan " + paket + " ?")
      if (showConfirm == true){
        liff.sendMessages([{
            'type': 'text',
            'text': "Hallo!",
            'text': "Aku pesen '" + paket + "' seharga " + harga
        }]).then(function() {
            window.alert('Message sent');
        }).catch(function(error) {
            window.alert('Error sending message: ' + error);
        });
        liff.closeWindow();
        }
      else{}
    }
}


/**
* Toggle the login/logout buttons based on the isInClient status, and display a message accordingly
*/
function displayIsInClientInfo() {
    if (liff.isInClient()) {
        document.getElementById('liffLoginButton').classList.toggle('hidden');
        document.getElementById('liffLogoutButton').classList.toggle('hidden');
        document.getElementById('openWindowButton').style = "";
        document.getElementById('isInClientMessage').textContent = 'Kamu buka aplikasi nya via Line.';
    } else {
        document.getElementById('isInClientMessage').textContent = 'Kamu buka aplikasi nya via browser';
    }
}

/**
* Event handler for button
*/
function registerButtonHandlers() {

    // openWindow call
    document.getElementById('openWindowButton').addEventListener('click', function() {
        liff.openWindow({
            url: 'https://liff-orderkeun.herokuapp.com',
            external: true
        });
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
