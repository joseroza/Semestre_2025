// ARQUIVO CRIADO PARA INSERÇÃO E A IMPRESSÃO DOS NÓS NA ÁRVORE.

#include "class.h"

// Construtor
TreeNode::TreeNode(int value) : data(value), left(nullptr), right(nullptr) {}

// Destrutor
TreeNode::~TreeNode() {
    delete left;
    delete right;
}

// Função auxiliar para encontrar o nó com menor valor na subárvore
TreeNode* TreeNode::minValueNode(TreeNode* node) {
    TreeNode* current = node;
    while (current && current->left != nullptr)
        current = current->left;
    return current;
}

TreeNode* TreeNode::insertBalanced(int new_data) {
    if (new_data < data) {
        if (!left) left = new TreeNode(new_data);
        else left = left->insertBalanced(new_data);
    } else {
        if (!right) right = new TreeNode(new_data);
        else right = right->insertBalanced(new_data);
    }

    int balance = getBalance();

    // LL -> Rotação à direita 
    if (balance > 1 && new_data < left->data)
        return rotateRight();

    // RR -> Rotação à esquerda
    if (balance < -1 && new_data > right->data)
        return rotateLeft();

    // LR -> Rotação à esquerda seguida de rotação à direita
    if (balance > 1 && new_data > left->data){
        left = left->rotateLeft();
        return rotateRight();
    }

    // RL -> Rotação à direita seguida de rotação à esquerda
    if (balance < -1 && new_data < right->data){
        right = right->rotateRight();
        return rotateLeft();
    }

    return this;
}

// Exibe a árvore de forma hierárquica
void TreeNode::printTree(const string& prefix, bool isLeft) {
    if (right)
        right->printTree(prefix + (isLeft ? "|   " : "    "), false);

    cout << prefix;
    cout << (isLeft ? "\\-- " : "/-- ");
    cout << data << endl;

    if (left)
        left->printTree(prefix + (isLeft ? "    " : "|   "), true);
}

// Percurso em Pré-Ordem (RAIZ, ESQUERDA, DIREITA):
void TreeNode::preOrder() {
    cout << data << " ";
    if (left) left->preOrder();
    if (right) right->preOrder();
}

// Percurso em Ordem (ESQUERDA, RAIZ, DIREITA):
void TreeNode::inOrder() {
    if (left) left->inOrder();
    cout << data << " ";
    if (right) right->inOrder();
}

// Percurso em Pós-Ordem (ESQUERDA, DIREITA, RAIZ):
void TreeNode::postOrder() {
    if (left) left->postOrder();
    if (right) right->postOrder();
    cout << data << " ";
}

// Busca um valor 'key' na árvore: Retorna 'true' se encontrado, ou 'false' caso contrário
bool TreeNode::search(int key) {
    if (data == key) return true;
    if (key < data && left) return left->search(key);
    if (key > data && right) return right->search(key);
    return false;
}

// Calcula a altura da árvore, retornando a maior profundidade entre os sub-ramos e retorna 0 caso não exista subárvore
int TreeNode::height() {
    int leftHeight = left ? left->height() : 0;
    int rightHeight = right ? right->height() : 0;

    return 1 + max(leftHeight, rightHeight);
}

// Retorna o fator de balanceamento do nó atual, que é a diferença entre a altura da subárvore esquerda - subárvore direita.
int TreeNode::getBalance() {
    int leftHeight = left ? left->height() : 0;
    int rightHeight = right ? right->height() : 0;

    return leftHeight - rightHeight;
}

TreeNode* TreeNode::rotateRight() {
    TreeNode* newRoot = left;
    TreeNode* temp = newRoot->right;

    newRoot->right = this;
    left = temp;

    return newRoot;
}

TreeNode* TreeNode::rotateLeft() {
    TreeNode* newRoot = right;
    TreeNode* temp = newRoot->left;

    newRoot->left = this;
    right = temp;

    return newRoot;
}

// Remove um nó com valor 'key' da árvore e retorna o novo nó raiz da subárvore

TreeNode* TreeNode::deleteNode(int key) {
    if (key < data && left) {
        left = left->deleteNode(key);
    } else if (key > data && right) {
        right = right->deleteNode(key);
    } else if (key == data) {
        if (!left) {
            TreeNode* temp = right;
            right = nullptr;
            delete this;
            return temp;
        }
        if (!right) {
            TreeNode* temp = left;
            left = nullptr;
            delete this;
            return temp;
        }
        TreeNode* temp = minValueNode(right);
        data = temp->data;
        right = right->deleteNode(temp->data);
    }
    return this;
}

// Libera recursivamente todos os nós da subárvore
// transformando o nó atual em uma árvore vazia
void TreeNode::clear() {
    if (left) {
        left->clear();
        delete left;
    }
    if (right) {
        right->clear();
        delete right;
    }
}

// Retorna o valor mínimo da árvore percorrendo a subárvore esquerda e retornando o menor valor encontrado.
int TreeNode::getMin() {
    if (!left) return data;
    return left->getMin();
}

// Retorna o valor máximo da árvore percorrendo a subárvore direita e retornando o maior valor encontrado.
int TreeNode::getMax() {
    if (!right) return data;
    return right->getMax();
}

// Retorna a contagem total de nós na subárvore, contando o nó atual e os nós da subárvore esquerda e direita.
int TreeNode::countNodes() {
    int count = 1;
    if (left) count += left->countNodes();
    if (right) count += right->countNodes();
    return count;
}

// Retorna a contagem de folhas na árvore, contando os nós que não possuem filhos (esquerdo e direito).
// Se o nó atual não possui filhos, retorna 1. Caso contrário, soma as folhas da subárvore esquerda e direita.
int TreeNode::countLeaves() {
    if (!left && !right) return 1;
    int leaves = 0;
    if (left) leaves += left->countLeaves();
    if (right) leaves += right->countLeaves();
    return leaves;
}