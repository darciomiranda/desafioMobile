import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase';
import { collection, query, getDocs, Firestore, addDoc, orderBy, updateDoc, deleteDoc, doc } from 'firebase/firestore'; 
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page implements OnInit {

  private db: Firestore;
  produtos: any[] = [];
  novoProduto = { nome: '', minimo: '', quantidade: '' };
  produtoSelecionado: any;

  constructor(private firebaseService: FirebaseService, private toastController: ToastController) {
    this.db = this.firebaseService.getFirestoreInstance();
  }

  ngOnInit() {
    this.carregarProdutos();
  }

  ionViewWillEnter() {
    this.carregarProdutos();
    this.novoProduto = { nome: '', minimo: '', quantidade: '' };
  }

  async mostrarToast(mensagem: string, color: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2000,
      color: color,
      position: 'top'
    });
    toast.present();
  }

  async carregarProdutos() {
    const collectionRef = collection(this.db, 'produtos');
    const q = query(collectionRef, orderBy('nome', 'asc'));
    const snapshot = await getDocs(q);
    this.produtos = [];
    snapshot.forEach(docSnap => {
      this.produtos.push({ id: docSnap.id, ...docSnap.data() });
    });
  }

  preencherCampos() {
    if (this.produtoSelecionado) {
      this.novoProduto = {
        nome: this.produtoSelecionado.nome,
        minimo: this.produtoSelecionado.minimo,
        quantidade: this.produtoSelecionado.quantidade
      };
    }
  }

  async adicionarProduto() {
    try {
      if (
        !this.novoProduto.nome ||
        this.novoProduto.minimo == null || this.novoProduto.minimo === '' ||
        this.novoProduto.quantidade == null || this.novoProduto.quantidade === ''
      ) {
        this.mostrarToast('Preencha todos os campos antes de adicionar', 'warning');
        return;
      }
      
  
      const collectionRef = collection(this.db, 'produtos');
      const q = query(collectionRef);
      const snapshot = await getDocs(q);
  
      const existe = snapshot.docs.some(docSnap => docSnap.data()['nome'].toLowerCase() === this.novoProduto.nome.toLowerCase());
  
      if (existe) {
        this.mostrarToast(`O produto "${this.novoProduto.nome}" já existe`, 'warning');
        return;
      }
  
      await addDoc(collectionRef, this.novoProduto);
      this.mostrarToast(`${this.novoProduto.nome} adicionado com sucesso`, 'success');
  
      this.novoProduto = { nome: '', minimo: '', quantidade: '' };
      await this.carregarProdutos();
  
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      this.mostrarToast('Erro ao adicionar produto', 'danger');
    }
  }

  async atualizarProduto() {
    if (!this.produtoSelecionado) {
      this.mostrarToast('Selecione um produto para atualizar', 'warning');
      return;
    }
  
    if (!this.novoProduto.nome || this.novoProduto.minimo === '' || this.novoProduto.quantidade === '') {
      this.mostrarToast('Preencha todos os campos antes de atualizar', 'warning');
      return;
    }
  
    try {
      const collectionRef = collection(this.db, 'produtos');
      const snapshot = await getDocs(collectionRef);
  
      const existeOutro = snapshot.docs.some(docSnap => 
        docSnap.data()['nome'].toLowerCase() === this.novoProduto.nome.toLowerCase() &&
        docSnap.id !== this.produtoSelecionado.id
      );
  
      if (existeOutro) {
        this.mostrarToast(`Já existe outro produto com o nome "${this.novoProduto.nome}"`, 'warning');
        return;
      }
  
      const docRef = doc(this.db, 'produtos', this.produtoSelecionado.id);
      await updateDoc(docRef, this.novoProduto);
  
      this.mostrarToast(`${this.novoProduto.nome} atualizado com sucesso`, 'success');
  
      await this.carregarProdutos();
      this.produtoSelecionado = null;
      this.novoProduto = { nome: '', minimo: '', quantidade: '' };
  
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      this.mostrarToast('Erro ao atualizar produto', 'danger');
    }
  }
  

  async excluirProduto() {
    if (!this.produtoSelecionado) {
      this.mostrarToast('Selecione um produto para excluir', 'warning');
      return;
    }
    try {
      const docRef = doc(this.db, 'produtos', this.produtoSelecionado.id);
      await deleteDoc(docRef);
      this.mostrarToast(`${this.produtoSelecionado.nome} excluído com sucesso`, 'success');
      await this.carregarProdutos();
      this.produtoSelecionado = null;
      this.novoProduto = { nome: '', minimo: '', quantidade: '' };
    } catch (error) {
      this.mostrarToast('Erro ao excluir produto', 'danger');
    }
  }
}
