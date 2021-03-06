function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail());
    window.location.replace("home");
  }
/*function logOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  if(auth2.isSignedIn.get()){
    auth2.signOut().then(function () {
      console.log('User signed out.');
      window.location.replace("login");
    });
  }

}
function onLoad() {
  gapi.load('auth2', function() {
    auth2 = gapi.auth2.init({
      client_id: '798834471674-2hla9ttcnoausu8a6e2gsoo4j0f70v7u.apps.googleusercontent.com',
      cookiepolicy: 'single_host_origin',
      ux_mode: 'redirect',
      redirect_uri: 'http://localhost:3000/home',
      hosted_domain: 'mymacewan.ca',
    });
  });
}*/

/*function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
}*/