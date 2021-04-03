
function logOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  if (auth2.isSignedIn.get()) {
    auth2.signOut().then(function() {
      console.log('User signed out.');
      window.location.replace("/");
    });
  }
}

function onLoadLogin() {
  gapi.load('auth2', function() {
    auth2 = gapi.auth2.init({
    client_id: '798834471674-2hla9ttcnoausu8a6e2gsoo4j0f70v7u.apps.googleusercontent.com',
    cookiepolicy: 'single_host_origin',
    ux_mode: 'redirect',
    redirect_uri: 'https://localhost:3000/home',
    hosted_domain: 'macewan.ca',
    });
  });
}

function onSuccess(googleUser) {
  console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
}

function onFailure(error) {
  console.log(error);
}

function renderButton() {
  onLoadLogin();
  gapi.signin2.render('my-signin2', {
  'scope': 'profile email',
  'width': 260,
  'height': 45,
  'longtitle': true,
  'theme': 'dark',
  'onsuccess': onSuccess,
  'onfailure': onFailure
  });
}
function renderButtonProf() {
  onLoadLoginProf();
  gapi.signin2.render('my-signin2', {
  'scope': 'profile email',
  'width': 260,
  'height': 45,
  'longtitle': true,
  'theme': 'dark',
  'onsuccess': onSuccess,
  'onfailure': onFailure
  });
}
function onLoadLoginProf() {
  gapi.load('auth2', function() {
    auth2 = gapi.auth2.init({
    client_id: '474415988486-13no8mch713spmi8vt0b5i2fj2607ol6.apps.googleusercontent.com',
    cookiepolicy: 'single_host_origin',
    ux_mode: 'redirect',
    redirect_uri: 'https://mapledonut.ca:3000/prof_home',
    hosted_domain: 'macewan.ca',
    });
  });
}
function onLoadHome() {
  console.log("WOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO");
  gapi.load('auth2', function() {
  auth2 = gapi.auth2.init({
    client_id: '798834471674-2hla9ttcnoausu8a6e2gsoo4j0f70v7u.apps.googleusercontent.com',
    cookiepolicy: 'single_host_origin',
    ux_mode: 'redirect',
    redirect_uri: 'https://localhost:3000/home',
    hosted_domain: 'macewan.ca',
  }).then(function(auth2){
    console.log("WOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO");
    console.log("Am I allowed to smash?: ",auth2.isSignedIn.get());
    console.log(auth2.currentUser.get().getBasicProfile());
    if(auth2.isSignedIn.get()){
      var profile=auth2.currentUser.get().getBasicProfile();
      var id_token = profile.getId();
      var email=profile.getEmail().split("@")[1];
      var long_email = profile.getEmail();
      var profemail="macewan.ca";
      var profile_name = profile.getName();
      console.log("BOOOOOOOOOOOOOOOOOOOOOOO");
      if(profemail.localeCompare(email)==0){
        window.location = "https://localhost:3000/prof_home";
      }
      console.log(profile);
      var data = JSON.stringify({
        "token": id_token,
        "name": profile_name,
        "email": long_email
      });
      console.log("HERE IS THE JSON FILE: ", data);
      var xhr = new XMLHttpRequest();
      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
          console.log(this.responseText);
        }
      });
      xhr.open("POST", "https://localhost:3000/home/idtoken");
      xhr.setRequestHeader("content-type", "application/json");
      xhr.send(data);
      var pic=document.getElementById('profilepic');
      pic.src=profile.getImageUrl();
      var pic=document.getElementById('profilename');
      pic.innerText=profile.getName();

    }});
    console.log("I DIDNT SIGN IN AGHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH");
  });
}

function onLoad() {
  gapi.load('auth2', function() {
  auth2 = gapi.auth2.init({
    client_id: '798834471674-2hla9ttcnoausu8a6e2gsoo4j0f70v7u.apps.googleusercontent.com',
    cookiepolicy: 'single_host_origin',
    ux_mode: 'redirect',
    redirect_uri: 'https://localhost:3000/home',
    hosted_domain: 'mymacewan.ca',
  }).then(function(auth2) {
    if(auth2.isSignedIn.get()){
      var profile=auth2.currentUser.get().getBasicProfile();
      var pic=document.getElementById('profilepic');
      pic.src=profile.getImageUrl();
      var pic=document.getElementById('profilename');
      pic.innerText=profile.getName();

    }});
  });
}

function onLoadProfHome() {
  gapi.load('auth2', function() {
  auth2 = gapi.auth2.init({
    client_id: '798834471674-2hla9ttcnoausu8a6e2gsoo4j0f70v7u.apps.googleusercontent.com',
    cookiepolicy: 'single_host_origin',
    ux_mode: 'redirect',
    redirect_uri: 'https://localhost:3000/prof_home',
    hosted_domain: 'macewan.ca',
  }).then(function(auth2){
    if(auth2.isSignedIn.get()){
      var profile=auth2.currentUser.get().getBasicProfile();
      var id_token = profile.getId();
      var long_email = profile.getEmail();
      var profile_name = profile.getName();
      var data = JSON.stringify({
        "token": id_token,
        "name": profile_name,
        "email": long_email
      });
      var xhr = new XMLHttpRequest();
      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
          console.log(this.responseText);
        }
      });
      xhr.open("POST", "https://localhost:3000/home/idtoken");
      xhr.setRequestHeader("content-type", "application/json");
      xhr.send(data);
      var pic=document.getElementById('profilepic');
      pic.src=profile.getImageUrl();
      var pic=document.getElementById('profilename');
      pic.innerText=profile.getName();

    }});
  });
}
