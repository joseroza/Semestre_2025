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
    TreeNode* getLeft() const;                          //Métodos de Acesso -> está realizando  
    TreeNode* getRight() const;                         //Métodos de Acesso

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

    void deleteTree(TreeNode* node){}
            
    public:

    BinaryTree() : root(nullptr) {}

    BinaryTree(){
        deleteTree(root);
        //msg obj destruido
    }

    void insertVal(int val){
        root = insert(root, val);
}

    int main(){
    
    BinaryTree tree;
    
    tree.insertVal(10);
    tree.insertVal(5);
    tree.insertVal(2);
    tree.insertVal(7);
}

};
