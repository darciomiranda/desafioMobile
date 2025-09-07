import { Component, OnChanges, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase';
import { collection, query, getDocs, Firestore, addDoc, orderBy, updateDoc, doc } from 'firebase/firestore'; 

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {
  produtos: any[] = []; 
  private db: Firestore;

  constructor(private firebaseService: FirebaseService) {
    this.db = this.firebaseService.getFirestoreInstance();
  }

  ngOnInit() {
    this.getAllDocumentsFromCollection('produtos'); 
  }
  
  ionViewWillEnter() {
    this.getAllDocumentsFromCollection('produtos');
  }

  async getAllDocumentsFromCollection(collectionName: string) {
    try {
      const collectionRef = collection(this.db, collectionName);
  
      const q = query(collectionRef, orderBy('nome', 'asc')); //ordena o nome em ordem alfabética
  
      const querySnapshot = await getDocs(q);
  
      this.produtos = [];
      querySnapshot.forEach((doc) => {
        this.produtos.push({
          id: doc.id,
          ...doc.data()
        });
      });
  
    } catch (error) {
      console.error('Erro ao buscar documentos:', error);
    }
  }
  

  aumentar(item: any) {
    try {
      const docRef = doc(this.db, 'produtos', item.id);
      const novaQuantidade = (item.quantidade || 0) + 1;

       updateDoc(docRef, { quantidade: novaQuantidade });

      item.quantidade = novaQuantidade; // atualiza localmente também
      console.log(`Quantidade de ${item.nome} atualizada para ${novaQuantidade}`);
    } catch (error) {
      console.error('Erro ao aumentar quantidade:', error);
    }
  }

  diminuir(item: any) {
    if (item.quantidade > 0) {
      try {
        if (item.quantidade > 0) {
          const docRef = doc(this.db, 'produtos', item.id);
          const novaQuantidade = item.quantidade - 1;
  
          updateDoc(docRef, { quantidade: novaQuantidade });
  
          item.quantidade = novaQuantidade; // atualiza localmente também
          console.log(`Quantidade de ${item.nome} atualizada para ${novaQuantidade}`);
        }
      } catch (error) {
        console.error('Erro ao diminuir quantidade:', error);
      }
    }
  }

  getTotalQuantidade(): number {
    return this.produtos.reduce((acc, p) => acc + (p.quantidade || 0), 0);
  }
}
