import { Component, OnInit } from '@angular/core';
import { Firestore, collection, query, getDocs, addDoc } from 'firebase/firestore';
import { FirebaseService } from '../services/firebase';


@Component({
  selector: 'app-tab0',
  templateUrl: 'tab0.page.html',
  styleUrls: ['tab0.page.scss'],
  standalone: false
})
export class Tab0Page implements OnInit {
  private db: Firestore;

  constructor(private firebaseService: FirebaseService) {
    this.db = this.firebaseService.getFirestoreInstance();
  }


  async ngOnInit() {
    // await this.criarProdutosIniciais() //Iniciar o banco de dados
  }

  async criarProdutosIniciais() {
    const produtosIniciais = [
      { minimo: 2, nome: 'Saco de lixo 100LT', quantidade: 0 },
      { minimo: 2, nome: 'Saco de lixo 60LT', quantidade: 0 },
      { minimo: 1, nome: 'Sabonete', quantidade: 0 },
      { minimo: 2, nome: 'Papel toalha', quantidade: 0 },
      { minimo: 2, nome: 'Papel higiênico', quantidade: 0 },
      { minimo: 1, nome: 'Desinfetante', quantidade: 0 },
      { minimo: 1, nome: 'MOP', quantidade: 0 },
      { minimo: 1, nome: 'Luva azul', quantidade: 0 },
      { minimo: 1, nome: 'Luva amarela', quantidade: 0 },
      { minimo: 1, nome: 'Esponja', quantidade: 0 },
      { minimo: 1, nome: 'Fibra', quantidade: 0 },
      { minimo: 1, nome: 'Pano de chão', quantidade: 0 },
      { minimo: 1, nome: 'Escova de vaso', quantidade: 0 },
      { minimo: 1, nome: 'Vassoura', quantidade: 0 },
    ];

    try {
      for (const produto of produtosIniciais) {
        await addDoc(collection(this.db, 'produtos'), produto);
      }
      console.log('Produtos iniciais adicionados com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar produtos iniciais:', error);
    }
  }
}
