#include<iostream>

class TreeNode {

    private:
        int data;
        TreeNode* left;
        TreeNode* right;


    public:
    //Constutor é o método que cria um objeto da classe

    //int val é o valor que o nó irá armazenar
    ///left e right são os ponteiros para os filhos esquerdo e direito

    TreeNode(int val) : data(val), left(nullptr), right(nullptr) {}

    //Métodos de Acesso
    int getData() const { return data; }
    TreeNode* getLeft() const {return left; }                          //Métodos de Acesso -> está realizando  
    TreeNode* getRight() const {return right; }                         //Métodos de Acesso

    void setLeft(TreeNode* node) { left = node;}        //Métodos de Modificação -> está realizando a ligação do nó com o filho esquerdo
    void setRight(TreeNode* node) { right = node;}      //Métodos de Modificação -> está realizando a ligação do nó com o filho direito


    ~TreeNode() {}

};
class BinaryTree{
    
    private:
    
    TreeNode* root;                             //Nó raiz da árvore

    TreeNode* insert(TreeNode* node, int val){

if(node == nullptr){
    return new TreeNode(val);
}

if(val < node->getData()){
    node->setLeft(insert(node->getLeft(), val));
}
    
else if(val > node->getData()){
    node->setRight(insert(node->getRight(), val));
}

    return node;
}

    //Exercicio para casa: Desenvolver a função deleteTree.

void deleteTree(TreeNode* node){
    if(node ==nullptr){ //Se meu node for igual a nullptr, então a minha árvore está vazia e ai retorna vazio
        return;
    }

    deleteTree(node->getLeft()); //Deletando a subárvore da esquerda de forma recursiva
    deleteTree(node->getRight()); //deletando a subárvore da direita de forma recursiva

    //Após deleter todos os filhos, deletamos o próprio nó.

    delete node;

}

// In Order (Esquerda, Raiz, Direita)
void inOrder(TreeNode* node){
    if(node != nullptr){
        inOrder(node->getLeft());
        std::cout << node->getData();
        inOrder(node->getRight());
    }
}
// Pre Order (Raiz, Esquerda, Direita)
void preOrder(TreeNode* node){
    if(node != nullptr){
        std::cout << node->getData();
        preOrder(node->getLeft());
        preOrder(node->getRight());
    }
}

// Post Order (Esquerda, Direita, Raiz)
void postOrder(TreeNode* node){
    if(node != nullptr){
        postOrder(node->getLeft());
        postOrder(node->getRight());
        std::cout << node->getData();
    }
}
            
    public:
    BinaryTree() : root(nullptr) {}

    ~BinaryTree() {
        deleteTree(root);
    }

void insertVal(int val) {
    root = insert(root, val);
    }
};

int main() {
    BinaryTree tree;
    tree.insertVal(10);
    tree.insertVal(5);
    tree.insertVal(2);
    tree.insertVal(7);
    return 0;
}

// Exercicio para casa: Calcular a altura da árvore
// Pesquisa para casa, criar uma biblioteca contendo os três metodos de impressão PreOrder, InOrder e PostOrder.
