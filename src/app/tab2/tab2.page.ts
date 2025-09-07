import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf'; // biblioteca para PDF
import { FirebaseService } from '../services/firebase';
import {
  collection,
  query,
  getDocs,
  Firestore,
  orderBy,
} from 'firebase/firestore';
import autoTable from 'jspdf-autotable';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit {
  produtos: any[] = [];
  observacao: string = '';
  private db: Firestore;
  dataAtual: string = '';
  logoBase64: string = '';
  logoAppBase64: string = '';
  dataParaArquivo: string = '';

  constructor(
    private firebaseService: FirebaseService,
    private http: HttpClient
  ) {
    this.db = this.firebaseService.getFirestoreInstance();
  }

  ngOnInit() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0'); // meses começam em 0
    const dia = String(hoje.getDate()).padStart(2, '0');

    this.dataAtual = `${dia}/${mes}/${ano}`; // para exibir no PDF
    this.dataParaArquivo = `${ano}${mes}${dia}`; // para o nome do arquivo

    this.getAllDocumentsFromCollection('produtos');

    this.http
      .get('assets/logo-mesquita.png', { responseType: 'blob' })
      .subscribe((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.logoBase64 = reader.result as string;
        };
        reader.readAsDataURL(blob);
      });

    this.http
      .get('assets/logo-mestock.jpeg', { responseType: 'blob' })
      .subscribe((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.logoAppBase64 = reader.result as string;
        };
        reader.readAsDataURL(blob);
      });
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
          ...doc.data(),
        });
      });
    } catch (error) {
      console.error('Erro ao buscar documentos:', error);
    }
  }

  gerarPdf() {
    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    const imgWidth = 30;
    const imgHeight = 30;
    const y = 5; // altura fixa no topo

    // imagem à esquerda
    if (this.logoBase64) {
      doc.addImage(this.logoBase64, 'PNG', 10, y, imgWidth, imgHeight); // 10px da borda esquerda
    }

    // imagem à direita
    if (this.logoAppBase64) {
      doc.addImage(
        this.logoAppBase64,
        'PNG',
        pageWidth - imgWidth - 10,
        y,
        imgWidth,
        imgHeight
      ); // 10px da borda direita
    }

    const tituloY = 45;
    doc.setFontSize(16);
    doc.text('Relatório de Estoque de Limpeza', 14, tituloY);

    doc.setFontSize(12);
    doc.text(`Data: ${this.dataAtual}`, 150, tituloY);

    autoTable(doc, {
      startY: tituloY + 10,
      head: [['Produto', 'Quantidade', 'Estoque mínimo']],
      body: this.produtos.map((item) => [
        item.nome,
        item.quantidade.toString(),
        item.minimo.toString(),
      ]),
      headStyles: {
        fillColor: [0, 0, 0], // fundo preto
        textColor: [255, 255, 255], // texto branco
        halign: 'center',
      },
      didParseCell: (data) => {
        if (data.section === 'body') {
          const item = this.produtos[data.row.index];
          if (item.quantidade < item.minimo) {
            data.cell.styles.fillColor = [248, 215, 218]; // vermelho claro
          } else if (item.quantidade == item.minimo) {
            data.cell.styles.fillColor = [255, 243, 205]; // amarelo claro
          }
        }
      },
    });

    const finalY = (doc as any).lastAutoTable.finalY || 30;

    // Aproxima a legenda da tabela
    const legendaY = finalY + 5; // antes estava +10
    const legendaSpacingX = 80; // distância horizontal entre as legendas

    doc.setFontSize(9);

    // Caixa default e texto
    doc.setFillColor(255, 243, 205);
    doc.rect(13, legendaY - 3, 3, 3, 'F');
    doc.setTextColor(0, 0, 0);
    doc.text('Produto atingiu o estoque mínimo', 17, legendaY);

    // Caixa amarela e texto
    doc.setFillColor(255, 243, 205);
    doc.rect(13, legendaY - 3, 3, 3, 'F');
    doc.setTextColor(0, 0, 0);
    doc.text('Produto atingiu o estoque mínimo', 17, legendaY);

    // Caixa vermelha e texto ao lado
    doc.setFillColor(248, 215, 218);
    doc.rect(13 + legendaSpacingX, legendaY - 3, 3, 3, 'F');
    doc.text(
      'Produto está abaixo do estoque mínimo',
      17 + legendaSpacingX,
      legendaY
    );

    // Observações abaixo das legendas
    const observacaoY = legendaY + 15;
    doc.setFontSize(12);
    doc.text('Observações:', 14, observacaoY);
    doc.text(this.observacao || '-', 14, observacaoY + 10);

    doc.save(`relatorio-estoque-${this.dataParaArquivo}.pdf`);
  }
}
