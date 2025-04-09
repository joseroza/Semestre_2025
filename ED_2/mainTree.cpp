#include <iostream>
#include "class.h"

// Função principal
int main() {

    using namespace std;

    // Criando um no raiz com o valor 41 e inserindo os demais valores dentro da arvore.
    TreeNode* root = new TreeNode(41);
    root->insertBalanced(63);                    
    root->insertBalanced(27);
    root->insertBalanced(39);
    root->insertBalanced(55);
    root->insertBalanced(21);
    root->insertBalanced(88);

    //Inserindo a arvore de acordo com os valores digitados pelo usuario.
    root->printTree();
 
    // Deletando um valor da árvore
    int deleteValue = 0;
    cout << "Digite um valor para deletar: ";
    cin >> deleteValue;
    root = root->deleteNode(deleteValue);

    // Imprime a arvore após a exclusão do valor
    cout << "\nArvore apos deletar" << endl;
    root->printTree();

    // Adicionando um valor à árvore
    int novoValor;
    cout << "Digite um valor para inserir: ";
    cin >> novoValor;

    // Verifica se o novo valor já existe na árvore.
    root = root->insertBalanced(novoValor);

    // Imprime a árvore após a inserção do valor novo.
    cout << "\nArvore apos inserir " << novoValor << ":\n";
    root->printTree();

    // Imprime o menor, maior valor e a altura da árvore
    cout <<  "\nMenor valor: " << root->getMin() << endl;
    cout <<  "Maior valor: " << root->getMax() << endl;
    cout << "Altura da arvore: " << root->height() << "\n";

    cout << "Quantidade total de nos: " << root->countNodes() << "\n";
    cout << "Quantidade de folhas: " << root->countLeaves() << "\n";

    return 0;
}

// Exercicio para casa: Calcular a altura da árvore ====== OK
// Pesquisa para casa, criar uma biblioteca contendo os três metodos de impressão PreOrder, InOrder e PostOrder. ====== OK
// Exercicio para casa: Inserir o Balanceamento da arvore ====== OK
// Exercicio para casa: Criar o metodo de deletar ====== OK
