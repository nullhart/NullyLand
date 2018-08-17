import firebase from 'firebase/app';
import 'firebase/firestore';
import firebaseConfig from './firebaseConfig';

const firebaseApp = firebase.initializeApp(firebaseConfig);
const firestore = firebaseApp.firestore();

const settings = { /* your settings... */
  timestampsInSnapshots: true
};
firestore.settings(settings);

// firestore.enablePersistence();


export default firestore