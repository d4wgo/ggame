var userIn = false;
function onSignIn(googleUser) {
    userIn = true;
    var profile = googleUser.getBasicProfile();
    proUrl = profile.getImageUrl();
    document.getElementById("profPic").src = proUrl;
    document.getElementById("mainSignIn").style.visibility = "hidden";
    document.getElementById("signOut").style.visibility = "visible";
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
}