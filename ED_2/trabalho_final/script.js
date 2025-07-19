// ========== ESTRUTURAS DE DADOS ==========

class HashTable {
  constructor(size = 10007) {
    this.size = size;
    this.table = new Array(size);
    this.count = 0;
  }

  primaryHash(key) {
    let hash = 0; 
    for (let i = 0; i < key.length; i++) { 
      hash = (hash << 5) - hash + key.charCodeAt(i); // hash * 31 + charCodeAt(i) 
      hash |= 0; // Força o hash a ser um inteiro de 32 bits
    }
    return Math.abs(hash) % this.size; // Garante que o hash seja positivo e dentro do tamanho da tabela
  }

  secondaryHash(key) {
    let hash = 5381; // Usando o algoritmo DJB2
    for (let i = 0; i < key.length; i++) { // Percorre cada caractere da chave 
      hash = (hash * 33) ^ key.charCodeAt(i); // hash = hash * 33 ^ charCodeAt(i) 
    }
    return Math.abs(hash % (this.size - 2)) + 1; // Garante que o passo seja positivo e não zero
  }

  insert(key, value) {
    if (this.count / this.size > 0.7) this.resize();

    let index = this.primaryHash(key);
    const step = this.secondaryHash(key);

    while (this.table[index]) {
      if (this.table[index].key === key) {
        this.table[index].value = value; 
        return;
      }
      index = (index + step) % this.size; // aplica o passo para encontrar o próximo índice
    }

    this.table[index] = { key, value };
    this.count++;
  }

  search(key) {
    let index = this.primaryHash(key);
    const step = this.secondaryHash(key);

    while (this.table[index]) {
      if (this.table[index].key === key) return this.table[index].value;
      index = (index + step) % this.size;
    }
    return null;
  }

  delete(key) {
    let index = this.primaryHash(key);
    const step = this.secondaryHash(key);
    let searchIndex = index;

    while (this.table[searchIndex] != null) {
      if (this.table[searchIndex].key === key) break;
      searchIndex = (searchIndex + step) % this.size;
    }

    if (this.table[searchIndex] == null) return false;

    this.table[searchIndex] = null;
    this.count--;

    const itemsToRehash = [];
    let rehashIndex = (searchIndex + step) % this.size;
    while (this.table[rehashIndex] != null) {
      itemsToRehash.push(this.table[rehashIndex]);
      this.table[rehashIndex] = null;
      this.count--;
      rehashIndex = (rehashIndex + step) % this.size;
    }

    itemsToRehash.forEach(item => this.insert(item.key, item.value));
    return true;
  }

  resize() {
    const oldTable = this.table;
    this.size *= 2;
    this.table = new Array(this.size);
    this.count = 0;

    oldTable.forEach(item => {
      if (item) this.insert(item.key, item.value);
    });
  }

  clear() {
    this.table = new Array(this.size);
    this.count = 0;
  }

  getAll() {
    return this.table.filter(Boolean).map(item => ({ key: item.key, value: item.value }));
  }

  toVisData() {
    const nodes = [];
    const edges = [];
    const slotItemCount = {};
    const addedSlots = new Set();

    // Primeiro, conta quantos itens caem em cada slot
    this.table.forEach(item => {
      if (item) {
        const h = this.primaryHash(item.key);
        slotItemCount[h] = (slotItemCount[h] || 0) + 1;
      }
    });

    // Depois, cria os nós e arestas
    this.table.forEach(item => {
      if (item) {
        const h = this.primaryHash(item.key);
        const slotId = `slot-${h}`;
        const itemId = `item-${item.key}`;

        // Adiciona o nó do slot apenas uma vez
        if (!addedSlots.has(slotId)) {
          const hasCollision = slotItemCount[h] > 1;
          nodes.push({
            id: slotId,
            label: `Slot ${h}`,
            group: 'slots',
            
            color: {
              border: hasCollision ? '#c0392b' : '#f39c12',
              background: hasCollision ? '#e74c3c' : '#f1c40f'
            },
            borderWidth: hasCollision ? 3 : 2,
          });
          addedSlots.add(slotId);
        }

        
        nodes.push({
          id: itemId,
          label: item.key.substring(7, 12),
          title: item.key,
          group: 'items'
        });

        
        edges.push({ from: slotId, to: itemId });
      }
    });

    return { nodes, edges };
  }
}

class BSTNode {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BST {
  constructor() {
    this.root = null;
    this.count = 0;
  }

  insert(key, value) {
    const newNode = new BSTNode(key, value);
    if (!this.root) {
      this.root = newNode;
      this.count++;
      return;
    }

    let current = this.root;
    while (true) {
      if (key === current.key) {
        current.value = value;
        return;
      }

      if (key < current.key) {
        if (!current.left) {
          current.left = newNode;
          this.count++;
          return;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = newNode;
          this.count++;
          return;
        }
        current = current.right;
      }
    }
  }

  search(key) {
    let current = this.root;
    while (current) {
      if (key === current.key) return current.value;
      current = key < current.key ? current.left : current.right;
    }
    return null;
  }
  
  findMin(node) {
      while (node && node.left !== null) node = node.left;
      return node;
  }

  delete(key) {
      let deleted = false;
      const deleteNode = (node, key) => {
          if (!node) return null;

          if (key < node.key) {
              node.left = deleteNode(node.left, key);
          } else if (key > node.key) {
              node.right = deleteNode(node.right, key);
          } else {
              deleted = true;
              if (!node.left) return node.right;
              if (!node.right) return node.left;

              const successor = this.findMin(node.right);
              node.key = successor.key;
              node.value = successor.value;
              node.right = deleteNode(node.right, successor.key);
          }
          return node;
      };

      this.root = deleteNode(this.root, key);
      if (deleted) this.count--;
      return deleted;
  }

  clear() {
    this.root = null;
    this.count = 0;
  }

  getAll() {
    const result = [];
    const inOrder = node => {
      if (!node) return;
      inOrder(node.left);
      result.push({ key: node.key, value: node.value });
      inOrder(node.right);
    };
    inOrder(this.root);
    return result;
  }

  toVisData() {
    const nodes = [];
    const edges = [];
    const traverse = (node, parent) => {
        if (!node) return;
        
        nodes.push({ 
          id: node.key, 
          label: node.key.substring(7, 12),
          title: `Chave: ${node.key}`,
          group: node === this.root ? 'root' : 'bst_nodes' 
        });

        if (parent) {
            edges.push({ from: parent.key, to: node.key });
        }
        traverse(node.left, node);
        traverse(node.right, node);
    };
    traverse(this.root, null);
    return { nodes, edges };
  }
}

class AVLNode extends BSTNode {
  constructor(key, value) {
    super(key, value);
    this.height = 1;
  }
}

class AVL {
  constructor() {
    this.root = null;
    this.count = 0;
  }

  height(node) {
    return node ? node.height : 0;
  }

  updateHeight(node) {
    node.height = 1 + Math.max(this.height(node.left), this.height(node.right));
  }

  balanceFactor(node) {
    return node ? this.height(node.left) - this.height(node.right) : 0;
  }

  rotateRight(y) {
    const x = y.left;
    y.left = x.right;
    x.right = y;
    this.updateHeight(y);
    this.updateHeight(x);
    return x;
  }

  rotateLeft(x) {
    const y = x.right;
    x.right = y.left;
    y.left = x;
    this.updateHeight(x);
    this.updateHeight(y);
    return y;
  }

  balance(node) {
    this.updateHeight(node);
    const balance = this.balanceFactor(node);

    if (balance > 1) {
      if (this.balanceFactor(node.left) < 0) node.left = this.rotateLeft(node.left);
      return this.rotateRight(node);
    }

    if (balance < -1) {
      if (this.balanceFactor(node.right) > 0) node.right = this.rotateRight(node.right);
      return this.rotateLeft(node);
    }

    return node;
  }

  insert(key, value) {
    const insertNode = (node, key, value) => {
      if (!node) {
        this.count++;
        return new AVLNode(key, value);
      }
      if (key < node.key) node.left = insertNode(node.left, key, value);
      else if (key > node.key) node.right = insertNode(node.right, key, value);
      else node.value = value;

      return this.balance(node);
    };

    this.root = insertNode(this.root, key, value);
  }

  search(key) {
    let current = this.root;
    while (current) {
      if (key === current.key) return current.value;
      current = key < current.key ? current.left : current.right;
    }
    return null;
  }
    
  findMin(node) {
      while (node.left) node = node.left;
      return node;
  }

  delete(key) {
      let deleted = false;
      const deleteNode = (node, key) => {
          if (!node) return null;

          if (key < node.key) {
              node.left = deleteNode(node.left, key);
          } else if (key > node.key) {
              node.right = deleteNode(node.right, key);
          } else {
              deleted = true;
              if (!node.left || !node.right) {
                  return node.left || node.right;
              } else {
                  const successor = this.findMin(node.right);
                  node.key = successor.key;
                  node.value = successor.value;
                  node.right = deleteNode(node.right, successor.key);
              }
          }
          if (!node) return node;
          return this.balance(node);
      };

      this.root = deleteNode(this.root, key);
      if (deleted) this.count--;
      return deleted;
  }

  clear() {
    this.root = null;
    this.count = 0;
  }

  getAll() {
    const result = [];
    const inOrder = node => {
      if (!node) return;
      inOrder(node.left);
      result.push({ key: node.key, value: node.value });
      inOrder(node.right);
    };
    inOrder(this.root);
    return result;
  }
  
  toVisData() {
    const nodes = [];
    const edges = [];
    const traverse = (node, parent) => {
        if (!node) return;

        const balance = this.balanceFactor(node);
        const balanceStatus = Math.abs(balance) > 1 ? 'unbalanced' : 'balanced';

        nodes.push({ 
            id: node.key, 
            label: `K: ${node.key.substring(7, 12)}\nB: ${balance}`,
            title: `Chave: ${node.key}<br>Altura: ${node.height}<br>Fator Bal: ${balance}`,
            group: node === this.root ? 'root' : balanceStatus
        });

        if (parent) {
            edges.push({ from: parent.key, to: node.key });
        }
        traverse(node.left, node);
        traverse(node.right, node);
    };
    traverse(this.root, null);
    return { nodes, edges };
  }
}

// ========== DOM E LÓGICA PRINCIPAL ==========

document.addEventListener('DOMContentLoaded', () => {
  const hashTable = new HashTable();
  const bst = new BST();
  const avl = new AVL();

  const estruturas = {
    hash: { nome: 'Tabela Hash', instancia: hashTable },
    bst: { nome: 'Árvore BST', instancia: bst },
    avl: { nome: 'Árvore AVL', instancia: avl }
  };
    
  const bigOComplexities = {
    'Tabela Hash': {
        insert: 'O(1) Amortizado',
        search: 'O(1) Médio',
        delete: 'O(1) Amortizado'
    },
    'Árvore BST': {
        insert: 'O(log n) Médio, O(n) Pior',
        search: 'O(log n) Médio, O(n) Pior',
        delete: 'O(log n) Médio, O(n) Pior'
    },
    'Árvore AVL': {
        insert: 'O(log n)',
        search: 'O(log n)',
        delete: 'O(log n)'
    }
  };

  const ui = {
    qtdeDados: document.getElementById('qtdeDados'),
    chaveBusca: document.getElementById('chaveBusca'),
    btnGerar: document.getElementById('btnGerar'),
    btnLimpar: document.getElementById('btnLimpar'),
    btnBuscar: document.getElementById('btnBuscar'),
    btnExportJson: document.getElementById('btnExportJson'),
    tabelaInsercao: document.getElementById('tabelaInsercao'),
    tabelaBusca: document.getElementById('tabelaBusca'),
    graficoInsercao: document.getElementById('graficoInsercao'),
    graficoBusca: document.getElementById('graficoBusca'),
    graficoDelecao: document.getElementById('graficoDelecao'),
    resultadoBusca: document.getElementById('resultadoBusca'),
    chaveDelecao: document.getElementById('chaveDelecao'),
    estruturaDelecao: document.getElementById('estruturaDelecao'),
    btnDeletar: document.getElementById('btnDeletar'),
    tabelaDelecao: document.getElementById('tabelaDelecao'),
    resultadoDelecao: document.getElementById('resultadoDelecao'),
    modal: document.getElementById('modalVisualizacao'),
    modalTitulo: document.getElementById('modalTitulo'),
    graphContainer: document.getElementById('graph-container'),
    closeButton: document.querySelector('.close-button'),
    btnVisualizarHash: document.getElementById('btnVisualizarHash'),
    btnVisualizarBST: document.getElementById('btnVisualizarBST'),
    btnVisualizarAVL: document.getElementById('btnVisualizarAVL'),
  };

  let storedKeys = [];
  let insertionChart = null;
  let searchChart = null;
  let deletionChart = null;
  let networkGraph = null;

  function formatTime(ms) {
    return `${ms.toFixed(4)} ms`;
  }

  function atualizarContadores() {
    for (const key in estruturas) {
      const nomeEstrutura = estruturas[key].nome.split(' ')[1]; // Hash, BST, AVL
      const span = document.getElementById(`qtde${nomeEstrutura}`);
      if (span) span.textContent = estruturas[key].instancia.count;
    }
  }

  function renderTabela(element, dados, comResultado = false) {
    dados.sort((a, b) => a.time - b.time);
    const colunas = comResultado ? 5 : 4;
    element.innerHTML = dados.length ? dados.map((dado, index) => `
      <tr>
        <td>${dado.name}</td>
        <td>${dado.bigO}</td>
        ${comResultado ? `<td>${dado.found ? '✅ Encontrado' : '❌ Não Encontrado'}</td>` : ''}
        <td>${formatTime(dado.time)}</td>
        <td>${index === 0 ? '🏆' : ''}</td>
      </tr>
    `).join('') : `<tr><td colspan="${colunas}">Nenhum dado para exibir.</td></tr>`;
  }
  
  function renderTabelaDelecao(element, dados) {
      const colunas = 5;
      element.innerHTML = dados.length ? dados.map(dado => `
        <tr>
          <td>${dado.name}</td>
          <td>${dado.bigO}</td>
          <td>${dado.deleted ? '✅ Deletado' : '❌ Não Encontrado'}</td>
          <td>${formatTime(dado.time)}</td>
          <td></td>
        </tr>
      `).join('') : `<tr><td colspan="${colunas}">Nenhum dado para exibir.</td></tr>`;
  }

  function gerarGrafico(canvas, chart, titulo, dados) {
    if (chart) chart.destroy();
    canvas.parentElement.style.display = 'block';

    return new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: dados.map(d => d.name),
        datasets: [{
          label: titulo,
          data: dados.map(d => d.time),
          backgroundColor: ['#3498db', '#2ecc71', '#f1c40f', '#e74c3c']
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, title: { display: true, text: 'Tempo (ms)' } } }
      }
    });
  }

  function gerarDados() {
    const qtd = parseInt(ui.qtdeDados.value, 10);
    if (isNaN(qtd) || qtd <= 0) return alert('Insira uma quantidade válida.');

    limparDados();
    const dados = Array.from({ length: qtd }, (_, i) => ({
      key: `musica-${i}-${Math.random().toString(36).substring(2, 10)}`,
      value: { id: i, name: `Música ${i}` }
    }));

    storedKeys = dados.map(d => d.key);

    const tempos = Object.values(estruturas).map(estrutura => {
      const t0 = performance.now();
      dados.forEach(d => estrutura.instancia.insert(d.key, d.value));
      const t1 = performance.now();
      return { 
        name: estrutura.nome, 
        time: t1 - t0,
        bigO: bigOComplexities[estrutura.nome].insert
      };
    });

    renderTabela(ui.tabelaInsercao, tempos);
    insertionChart = gerarGrafico(ui.graficoInsercao, insertionChart, 'Tempo de Inserção (ms)', tempos);
    atualizarContadores();
    ui.chaveBusca.value = storedKeys[Math.floor(Math.random() * storedKeys.length)];
    ui.chaveDelecao.value = ui.chaveBusca.value;
  }

  function buscarDado() {
    const chave = ui.chaveBusca.value.trim();
    if (!chave) return alert('Digite uma chave.');
    if (storedKeys.length === 0) return alert('Gere os dados primeiro.');

    const resultados = Object.values(estruturas).map(estrutura => {
      const t0 = performance.now();
      const achou = estrutura.instancia.search(chave);
      const t1 = performance.now();
      return { 
        name: estrutura.nome, 
        time: t1 - t0, 
        found: !!achou,
        bigO: bigOComplexities[estrutura.nome].search
      };
    });

    renderTabela(ui.tabelaBusca, resultados, true);
    searchChart = gerarGrafico(ui.graficoBusca, searchChart, 'Tempo de Busca (ms)', resultados);

    const encontrou = resultados.some(r => r.found);
    ui.resultadoBusca.innerHTML = encontrou
      ? '<div class="resultado-container">✅ Chave encontrada!</div>'
      : '<div class="resultado-container erro">❌ Chave não encontrada.</div>';
  }
    
  function deletarDado() {
    const chave = ui.chaveDelecao.value.trim();
    const estruturaSelecionada = ui.estruturaDelecao.value;

    if (!chave) return alert('Digite uma chave para deletar.');
    if (storedKeys.length === 0) return alert('Gere os dados primeiro.');

    const resultados = [];
    let algumaDelecaoOcorreu = false;

    const estruturasParaDeletar = estruturaSelecionada === 'todas'
      ? Object.keys(estruturas)
      : [estruturaSelecionada];

    estruturasParaDeletar.forEach(key => {
      const estrutura = estruturas[key];
      if (estrutura) {
        let deletado = false;
        const t0 = performance.now();
        deletado = estrutura.instancia.delete(chave);
        const t1 = performance.now();

        if (deletado) algumaDelecaoOcorreu = true;
        resultados.push({ 
            name: estrutura.nome, 
            time: t1 - t0, 
            deleted: deletado,
            bigO: bigOComplexities[estrutura.nome].delete
        });
      }
    });

    if (algumaDelecaoOcorreu) {
        const keyIndex = storedKeys.indexOf(chave);
        if (keyIndex > -1) storedKeys.splice(keyIndex, 1);
    }
    
    renderTabelaDelecao(ui.tabelaDelecao, resultados);
    deletionChart = gerarGrafico(ui.graficoDelecao, deletionChart, 'Tempo de Deleção (ms)', resultados);
    
    const encontrouParaDeletar = resultados.some(r => r.deleted);
    ui.resultadoDelecao.innerHTML = encontrouParaDeletar
      ? `<div class="resultado-container">✅ Chave deletada com sucesso de pelo menos uma estrutura.</div>`
      : `<div class="resultado-container erro">❌ Chave não encontrada nas estruturas selecionadas.</div>`;
    
    atualizarContadores();
  }

  function limparDados() {
    Object.values(estruturas).forEach(e => e.instancia.clear());
    storedKeys = [];
    atualizarContadores();

    ui.tabelaInsercao.innerHTML = '<tr><td colspan="4">Gere dados para ver os resultados.</td></tr>';
    ui.tabelaBusca.innerHTML = '<tr><td colspan="5">Busque uma chave para ver os resultados.</td></tr>';
    ui.tabelaDelecao.innerHTML = '<tr><td colspan="5">Delete uma chave para ver os resultados.</td></tr>';
    ui.resultadoBusca.innerHTML = '';
    ui.resultadoDelecao.innerHTML = '';
    ui.chaveBusca.value = '';
    ui.chaveDelecao.value = '';

    if (insertionChart) insertionChart.destroy();
    if (searchChart) searchChart.destroy();
    if (deletionChart) deletionChart.destroy();

    if (networkGraph) {
        networkGraph.destroy();
        networkGraph = null;
    }
    ui.graficoInsercao.parentElement.style.display = 'none';
    ui.graficoBusca.parentElement.style.display = 'none';
    ui.graficoDelecao.parentElement.style.display = 'none';
  }

  function exportarJSON() {
    const dadosExport = {};
    Object.keys(estruturas).forEach(chave => {
      const estrutura = estruturas[chave];
      if (estrutura.instancia.getAll) {
        dadosExport[chave] = estrutura.instancia.getAll();
      }
    });

    const blob = new Blob([JSON.stringify(dadosExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `estruturas.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // --- Visualização Gráfica ---

  function abrirModal() { ui.modal.style.display = 'block'; }
  function fecharModal() { 
    ui.modal.style.display = 'none'; 
    if (networkGraph) {
        networkGraph.destroy();
        networkGraph = null;
    }
  }

  function desenharGrafo(estrutura) {
    if (estrutura.instancia.count === 0) {
        alert(`A "${estrutura.nome}" está vazia.`);
        return;
    }
    if (estrutura.instancia.count > 100) {
        alert(`A visualização é para no máximo 100 dados para evitar problemas de desempenho. A "${estrutura.nome}" tem ${estrutura.instancia.count} nós.`);
        return;
    }

    ui.modalTitulo.textContent = `Visualização da ${estrutura.nome}`;
    const data = estrutura.instancia.toVisData();
    
    const options = {
        layout: {
            hierarchical: {
                enabled: (estrutura.nome.includes('Árvore')),
                levelSeparation: 120,
                nodeSpacing: 100,
                direction: 'UD',
                sortMethod: 'directed',
            }
        },
        interaction: {
            hover: true,
            tooltipDelay: 200
        },
        physics: {
            enabled: !(estrutura.nome.includes('Árvore')),
            solver: 'forceAtlas2Based',
        },
        nodes: {
            borderWidth: 2,
            shadow: { enabled: true, color: 'rgba(0,0,0,0.2)', x: 2, y: 2 }
        },
        edges: {
            width: 1,
            color: { color: '#cccccc', highlight: '#022942', hover: '#2980b9' },
            arrows: { to: { enabled: estrutura.nome.includes('Árvore'), scaleFactor: 0.7 } },
            smooth: { type: 'cubicBezier', forceDirection: 'vertical', roundness: 0.4 }
        },
        groups: {
            root: {
                shape: 'ellipse',
                color: { background: '#ff8b06', border: '#e67e22' },
                font: { color: 'white', size: 16, face: 'Arial' },
                size: 30,
            },
            balanced: {
                shape: 'dot',
                color: '#2ecc71', 
                font: { color: 'black' },
                size: 18,
            },
            unbalanced: {
                shape: 'dot',
                color: '#e74c3c', 
                font: { color: 'black' },
                size: 18,
            },
            
            bst_nodes: {
              shape: 'dot',
              size: 18,
              color: { background: '#3498db', border: '#2980b9' }, // azul
              font: { color: 'black' }
            },
            
            slots: {
                shape: 'box',
                font: { color: '#333' },
            },
            
            items: {
                shape: 'ellipse',
                color: { background: '#bdc3c7', border: '#95a5a6' }, // cinza
                font: { color: '#333' }
            }
        }
    };

    networkGraph = new vis.Network(ui.graphContainer, data, options);
    abrirModal();
  }

  // Eventos
  ui.btnGerar.addEventListener('click', gerarDados);
  ui.btnBuscar.addEventListener('click', buscarDado);
  ui.btnDeletar.addEventListener('click', deletarDado);
  ui.btnLimpar.addEventListener('click', limparDados);
  ui.btnExportJson.addEventListener('click', exportarJSON);
  
  ui.btnVisualizarHash.addEventListener('click', () => desenharGrafo(estruturas.hash));
  ui.btnVisualizarBST.addEventListener('click', () => desenharGrafo(estruturas.bst));
  ui.btnVisualizarAVL.addEventListener('click', () => desenharGrafo(estruturas.avl));
  
  ui.closeButton.addEventListener('click', fecharModal);
  window.addEventListener('click', (event) => {
    if (event.target == ui.modal) {
      fecharModal();
    }
  });
});