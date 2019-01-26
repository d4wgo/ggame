var userIn = false;
function onSignIn(googleUser) {
    userIn = true;
    var profile = googleUser.getBasicProfile();
    proUrl = profile.getImageUrl();
    document.getElementById("profPic").src = proUrl;
    document.getElementById("mainSignIn").style.visibility = "hidden";
    document.getElementById("signOut").style.visibility = "visible";
    signInChange();
}
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        document.getElementById("mainSignIn").style.visibility = "visible";
        document.getElementById("signOut").style.visibility = "hidden";
        document.getElementById("profPic").src = "/static/images/defaultprofile.png";
        signInChange();
    });
}
