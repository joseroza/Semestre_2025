// ARQUIVO CRIADO PARA DECLARAÇÂO DAS CLASSES.

#ifndef TREE_H
#define TREE_H

#include <iostream>
#include <string>
using namespace std;

class TreeNode {
private:
    int data;
    TreeNode* left;
    TreeNode* right;
    TreeNode* minValueNode(TreeNode* node);

public:
    TreeNode(int value);
    ~TreeNode();

    void insert(int new_data);
    void printTree(const string& prefix = "", bool isLeft = true);
    void preOrder();
    void inOrder();
    void postOrder();
    bool search(int key);
    int height();
    TreeNode* deleteNode(int key);
    void clear();
    int getMin();
    int getMax();
    int countNodes();
    int countLeaves();
    int getBalance();
    TreeNode* rotateLeft();
    TreeNode* rotateRight();
    TreeNode* insertBalanced(int new_data);


};

#endif
