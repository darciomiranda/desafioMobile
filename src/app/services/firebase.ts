import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

@Injectable({
  providedIn: 'root' // torna o serviço global
})
export class FirebaseService {
  private app: FirebaseApp;
  private db: Firestore;

  constructor() {
    const firebaseConfig = {
      apiKey: "AIzaSyAdCqcrWhhb1w-Rhg4PYEESmGXwstRyoTc",
      authDomain: "bancodesafiomobile.firebaseapp.com",
      projectId: "bancodesafiomobile",
      storageBucket: "bancodesafiomobile.firebasestorage.app",
      messagingSenderId: "53933296498",
      appId: "1:53933296498:web:ed18a42cd3e0bf700c2beb",
      measurementId: "G-Q1SGS9TEFS"
    };

    // Inicializa apenas uma vez
    this.app = initializeApp(firebaseConfig);
    getAnalytics(this.app);
    this.db = getFirestore(this.app);
  }

  // Getter para o Firestore
  getFirestoreInstance(): Firestore {
    return this.db;
  }
}
