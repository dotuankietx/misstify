import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAkXk-3mjCVKQegkBgLTB5QAFfzkXMCV0I",
    authDomain: "mp3-database.firebaseapp.com",
    projectId: "mp3-database",
    storageBucket: "mp3-database.appspot.com",
    messagingSenderId: "452641377143",
    appId: "1:452641377143:web:605019ec12df1f7b66ef72"
};
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
export { firebase };