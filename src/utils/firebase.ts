import * as firebaseRef from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

if (window.location.origin != "https://products.loginextsolutions.com") {
  if (window.location.origin == 'http://localhost:9001') {
    var firebaseConfig = {
      apiKey: "AIzaSyCAs3Yk0KNWqnEa-Cldr6YetE9y1E4o-xo",
      authDomain: "url-shortner-6ded3.firebaseapp.com",
      databaseURL: "https://url-shortner-6ded3.firebaseio.com/",
      projectId: "url-shortner-6ded3",
      storageBucket: "url-shortner-6ded3.appspot.com",
      messagingSenderId: "10313723352"
    };
  } else {
    // Testing key
    var firebaseConfig = {
      apiKey: "AIzaSyCAs3Yk0KNWqnEa-Cldr6YetE9y1E4o-xo",
      authDomain: "url-shortner-6ded3.firebaseapp.com",
      databaseURL: "https://url-shortner-6ded3.firebaseio.com/",
      projectId: "url-shortner-6ded3",
      storageBucket: "url-shortner-6ded3.appspot.com",
      messagingSenderId: "10313723352"
    };
  }
} else {
  // Prod key
  var firebaseConfig = {
    apiKey: "AIzaSyBE5_0BTW6NdHTqkD0O2llNzadWMKQ6DJ4",
    authDomain: "loginextsolutions-apps-173313.firebaseapp.com",
    databaseURL: "https://loginextsolutions-apps-173313.firebaseio.com",
    projectId: "loginextsolutions-apps-173313",
    storageBucket: "loginextsolutions-apps-173313.appspot.com",
    messagingSenderId: "299132501079"
  };
}

firebaseRef.initializeApp(firebaseConfig);
const localStorage = window?.localStorage
const firebaseAuth = firebaseRef.auth()
const userAccessInfo: any = JSON.parse(localStorage.getItem('userAccessInfo') || '""')
let firebaseUserId: string | undefined = ''

let userName: string = '';
if (userAccessInfo) {
  if (!localStorage.getItem('impersonateUserName')) {
    userName = userAccessInfo.userName;
  } else {
    userName = localStorage.getItem('impersonateUserName') || '';
  }
}

if (userName) {
  userName = 'web_' + JSON.parse(localStorage.getItem('userAccessInfo') || '""')['userId'] + '_' + (userName.toLowerCase()).trim()
}

firebaseAuth.signInWithEmailAndPassword(userName, userName + '_' + userAccessInfo.userId)
  .then(function (firebaseUser) {
    // window.alert("User signed in with uid: " + firebaseUser.uid)
    firebaseUserId = firebaseUser?.user?.uid;
  }).catch(function () {
    //
    firebaseAuth.createUserWithEmailAndPassword(userName, userName + '_' + userAccessInfo.userId)
      .then(function (firebaseUser) {
        // window.alert("User created in with uid: " + firebaseUser.uid)
        firebaseUserId = firebaseUser?.user?.uid;
      })
  });

export { firebaseUserId }
export default firebaseRef