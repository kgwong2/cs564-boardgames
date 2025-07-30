import java.io.BufferedReader;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * B+Tree Structure
 * Key - StudentId
 * Leaf Node should contain [ key,recordId ]
 */
class BTree {

    /**
     * Pointer to the root node.
     */
    private BTreeNode root;
    /**
     * Number of key-value pairs allowed in the tree/the minimum degree of B+Tree
     **/
    private int t;

    BTree(int t) {
        this.root = null;
        this.t = t;
    }

    long search(long studentId) {
        // Null check for empty BTree
        if (this.root == null) {
            System.out.println("Student ID: " + studentId + "was not found in the B+Tree.");
            return -1;
        }

        // Begin search at root
        long recordId = searchNode(root, studentId);
        
        // Print message for student ID not found
        if (recordId == -1) {
            System.out.println("Student ID: " + studentId + "was not found in the B+Tree.");
        }
        return recordId;
    }

    // Search helper
    long searchNode(BTreeNode node, long studentId) {
        if (node.leaf) {
            // Loop through indices
            for (int i = 0; i < node.n; i++) { 
                // Find index of given student ID in this leaf node
                if (node.keys[i] == studentId) {
                    // Return value of student ID at matching index
                    return node.values[i];
                }
            }
        } else {
            // Loop through indices in increasing order
            for (int i = 0; i < node.n; i++) {
                // Compare student ID to key
                if (node.keys[i] > studentId) {
                    // If student is smaller than key, perform sub-search on left child
                    return searchNode(node.children[i], studentId);
                }
            }
            // If loop finishes without returning, studentId > all keys
            // Search right-most child
            return searchNode(node.children[node.n], studentId);
        }
        return -1;
    }

    BTree insert(Student student) {
        // Null check
        if (root == null) {
            root = new BTreeNode(t, true);
        }
        
        BTreeNode leaf = findLeafNode(root, student.studentId);
        if (leaf.n == 2 * t) {
            splitLeafNode(leaf, student);
        }else {
            insertIntoLeaf(leaf, student);
        }

        //insert student into student.csv
        try(
            FileWriter fw = new FileWriter("src/Student.csv", true);   
        ) {
            fw.write(student.studentId + "," + student.age + "," + student.studentName + "," + student.major + "," + student.level + "," + student.recordId + "\n");
        } catch (Exception e) {
            System.out.println("Error writing to student.csv: " + e.getMessage());
        }

        return this;
    }  

    // Find the leaf node where the studentId should be inserted
    private BTreeNode findLeafNode(BTreeNode node, long studentId) {
        if (node.leaf) {
            return node;
        }

        int i = 0;
        while (i < node.n && studentId > node.keys[i]) {
            i++;
        }

        return findLeafNode(node.children[i], studentId);
    }

    // Insert the student into the leaf node
    private void insertIntoLeaf(BTreeNode leaf, Student student) {
        int i = leaf.n - 1;

        // Find the position to insert the new student to maintain sorted order
        while (i >= 0 && leaf.keys[i] > student.studentId) {
            leaf.keys[i + 1] = leaf.keys[i];
            leaf.values[i + 1] = leaf.values[i];
            i--;
        }

        // Insert the new student
        leaf.keys[i + 1] = student.studentId;
        leaf.values[i + 1] = student.recordId;
        leaf.n++;
    }

    // Split the leaf node if it is full
    // The new leaf node will be created and the parent will be updated accordingly
    // If the parent is full, it will call splitInternal to handle that case
    private void splitLeafNode(BTreeNode leaf, Student student) {
        BTreeNode newLeaf = new BTreeNode(t, true);
        long[] tempKeys = new long[2 * t + 1];
        long[] tempValues = new long[2 * t + 1];

        for (int i = 0; i < leaf.n; i++) {
            tempKeys[i] = leaf.keys[i];
            tempValues[i] = leaf.values[i];
        }

        // Insert the new key into temp arrays
        int i = leaf.n - 1;
        while (i >= 0 && student.studentId < tempKeys[i]) {
            tempKeys[i + 1] = tempKeys[i];
            tempValues[i + 1] = tempValues[i];
            i--;
        }
        tempKeys[i + 1] = student.studentId;
        tempValues[i + 1] = student.recordId;
        int total = leaf.n + 1;

        // Copy the first half to original leaf
        for (i = 0; i < t; i++) {
            leaf.keys[i] = tempKeys[i];
            leaf.values[i] = tempValues[i];
        }
        leaf.n = t;

        // Copy the second half to new leaf
        for (i = t; i < total; i++) {
            newLeaf.keys[i - t] = tempKeys[i];
            newLeaf.values[i - t] = tempValues[i];
        }
        newLeaf.n = total - t;

        newLeaf.next = leaf.next;
        leaf.next = newLeaf;

        // Insert the middle value into the parent node, if the leaf is the root, create a new root
        if (leaf == root) {
            BTreeNode newRoot = new BTreeNode(t, false);
            newRoot.keys[0] = newLeaf.keys[0];
            newRoot.children[0] = leaf;
            newRoot.children[1] = newLeaf;
            newRoot.n = 1;
            root = newRoot;
        } else {
            insertIntoParent(leaf, newLeaf.keys[0], newLeaf);
        }
    }
    
    // Insert the new leaf into the parent node
    // If the parent is full, it will call splitInternal to handle that case
    // If the parent is the root, it will create a new root node and update the root pointer accordingly
    private void insertIntoParent(BTreeNode leaf, long key, BTreeNode newLeaf) {
        BTreeNode parent = findParent(root, leaf);
        if (parent == null) {
            // If there is no parent, create a new root
            BTreeNode newRoot = new BTreeNode(t, false);
            newRoot.keys[0] = key;
            newRoot.children[0] = leaf;
            newRoot.children[1] = newLeaf;
            newRoot.n = 1;
            root = newRoot;
        } else {
            // If the parent is full, split it
            if (parent.n == 2 * t) {
                splitParent(parent);
            }
            // Insert the key into the parent node
            int i = parent.n - 1;
            while (i >= 0 && parent.keys[i] > key) {
                parent.keys[i + 1] = parent.keys[i];
                parent.children[i + 2] = parent.children[i + 1];
                i--;
            }
            parent.keys[i + 1] = key;
            parent.children[i + 2] = newLeaf;
            parent.n++;
        } 
    }

    // Find the parent of the given node
    // If the parent is not found, it returns null
    private BTreeNode findParent(BTreeNode node, BTreeNode child) {
        if (node == null || node.leaf) {
            return null; // No parent for root or leaf nodes
        }

        for (int i = 0; i < node.n + 1; i++) {
            if (node.children[i] == child) {
                return node; // Found the parent
            } else {
                BTreeNode parent = findParent(node.children[i], child);
                if (parent != null) {
                    return parent;
                }
            }
        }
        return null;
    }
    // Split the parent node if it is full
    // If the parent is full, it will call splitInternal to handle that case
    // The new key is the middle key that will be moved up to the parent
    private void splitParent(BTreeNode node) {
        BTreeNode newInternal = new BTreeNode(t, false);
        int midIndex = t - 1; // Middle index for splitting

        // Move the second half of the keys and children to the new internal node excluding the middle key
        for (int i = midIndex + 1; i < node.n; i++) {
            newInternal.keys[i - (midIndex + 1)] = node.keys[i];
        }
        for (int i = midIndex + 1; i <= node.n; i++) {
            newInternal.children[i - (midIndex + 1)] = node.children[i];
        }

        newInternal.n = node.n - (midIndex + 1);
        node.n = midIndex;

        // If the node is the root, create a new root
        if (node == root) {
            BTreeNode newRoot = new BTreeNode(t, false);
            newRoot.keys[0] = node.keys[midIndex]; 
            newRoot.children[0] = node;
            newRoot.children[1] = newInternal;
            newRoot.n = 1;
            root = newRoot;
        } else {
            insertIntoParent(node, node.keys[midIndex], newInternal);
        }
    }

    boolean delete(long studentId) {
      /**
       * TODO: Implement this function to delete in the B+Tree. Also, delete in
       * student.csv after deleting in B+Tree, if it exists. Return true if the
       * student is deleted successfully otherwise, return false.
       */
      
      // Check if the BTree is empty.
      if (this.root == null) {
        return false;
      }
      
      // Search for Node
      boolean isDeleted = deleteHelper(null, -1, this.root, studentId);
      
      // If deletion succeeds, delete in student.csv.
      if (isDeleted) {
        try {
          String newFileName = "StudentCopy.csv";
          BufferedReader reader = new BufferedReader(new FileReader("Student.csv"));
          FileWriter writer = new FileWriter(newFileName);
                     
          String line = reader.readLine();
          String splitBy = ",";
          
          while (line != null) {
            String[] studentData = line.split(splitBy);
            long csvstudentId = Long.parseLong(studentData[0]);
            if (csvstudentId != studentId) {
              writer.append(line);
              writer.append("\n");
            }
            line = reader.readLine();
          } // while
          
          reader.close();
          writer.close();
          
        }
        catch (IOException e) {
          System.out.println("Error updating student.csv.");
        }
      }
      
      return isDeleted;
    }
    
    // TODO: implement
    // noddPos == the index in the parent's children array
    private boolean deleteHelper(BTreeNode parent, int nodePos, BTreeNode node, long studentId) {
      
      // If not leaf node
      if (!node.leaf) {
        // Search through all keys in node
        for (int i = 0; i < node.n; i++) {
          
          // If studentId is found, delete
          if (studentId == node.keys[i]) {
            
            // Find in order predecessor
            BTreeNode predParent = findPredecessorParent(node, i);
            BTreeNode predNode = predParent.children[predParent.n];
            long predId = predNode.keys[predNode.n - 1];
            
            // Update non-leaf node to in order predecessor
            node.keys[i] = predNode.keys[predNode.n - 1];
            node.values[i] = predNode.values[predNode.n - 1];
            
            // Delete key and value from leaf
            deleteHelper(predParent, predParent.n, predNode, predId);
          }
          // If studentId is less than key, check left child
          if (studentId < node.keys[i]) {
            deleteHelper(node, i, node.children[i], studentId);
          }
          // If studentId is greater than key, child right child
          if (studentId > node.keys[i] && i == node.n - 1) {
            deleteHelper(node, i + 1, node.children[i + 1], studentId);
          }
        } // for
      }
      // If leaf node
      else {
        // Search through all keys in node
        for (int i = 0; i < node.n; i++) {
          // If studentId is found, delete
          if (studentId == node.keys[i]) {
            
            // Node has minimum number of keys and is not the root
            if (node.n == node.t && parent != null) {
              int siblingPos = findSibling(parent, nodePos);
              
              // Merge if no extra entries (or siblings)
              if (siblingPos == -1) {
                
                // Remove studentId from node.
                shiftRight(node, i);
                // Merge nodes.
                mergeHelper(parent, nodePos);
                
              }
              // Pull from left sibling (rotate right)
              else if (siblingPos < nodePos) {
                shiftRight(node, i);
                rotateRight(parent, i, siblingPos);
              }
              // Pull from right sibling (rotate left)
              else {
                shiftLeft(node, i);
                rotateLeft(parent, i, siblingPos);
              }
            } // if
            // Node has keys to spare or is the root (only node in tree)
            else {
              shiftLeft(node, i);
              node.n--;
            }

            return true;
          } // if
        } // for
        
        // If studentId is not found,
        return false;
      }
      
      return false;
    }
    
    /**
     * Finds the predecessor's parent node.
     * @param node - The node with the key/value in which a predecessor is needed
     * @param nodePos - The key/value index of the node
     * @return The predecessor's parent node.
     */
    private BTreeNode findPredecessorParent(BTreeNode node, int nodePos) {
      
      BTreeNode parent = node;
      BTreeNode curNode = node.children[nodePos];
      
      while (!curNode.leaf) {
        parent = curNode;
        curNode = curNode.children[curNode.n];
      }
      
      return parent;
    }
    
    /**
     * Delete helper method to find which sibling the child should pull key values from. 
     * @param parent - Parent node
     * @param nodePos - Node's position in the array
     * @return The sibling's position in the array. If neither sibling can be used, returns -1.
     */
    private int findSibling(BTreeNode parent, int nodePos) {
      // Fields
      int leftSibPos = nodePos - 1;
      int rightSibPos = nodePos + 1;
      BTreeNode leftSibling = null;
      BTreeNode rightSibling = null;
      boolean useLeft = false;
      boolean useRight = false;
      
      // Check if there is a left sibling.
      if (nodePos > 0) {
        leftSibling = parent.children[leftSibPos];
        // Check if left sibling has enough keys to spare.
        if (leftSibling.n > leftSibling.t) {
          useLeft = true;
        }
      }
      
      // Check if there is a right sibling.
      if (nodePos < parent.n) {
        rightSibling = parent.children[rightSibPos];
        // Check if right sibling has enough keys to spare.
        if (rightSibling.n > rightSibling.t) {
          useRight = true;
        }
      }
      
      // If both siblings have enough keys, pick the one with more keys.
      if (useLeft && useRight) {
        if (leftSibling.n >= rightSibling.n) {
          return leftSibPos;
        }
        else {
          return rightSibPos;
        }
      }
      // If only left can be used.
      if (useLeft) {
        return leftSibPos;
      }
      // If only right can be used.
      if (useRight) {
        return rightSibPos;
      }
      // Neither sibling can be used.
      return -1;
    }
    
    /**
     * Merge nodes.
     * @param parent - Parent node
     * @param nodePos - Node's position in the array
     */
    private void mergeHelper(BTreeNode parent, int nodePos) {
      BTreeNode node = parent.children[nodePos];
      
      // Merge with right sibling
      if (nodePos != parent.n) {
        int parentPos = nodePos;
        BTreeNode rightSib = parent.children[nodePos + 1];
        
        // Update keys and values in node.
        // Pull from parent.
        node.keys[node.n - 1] = parent.keys[parentPos];
        node.values[node.n - 1] = parent.values[parentPos];
        // Pull from sibling.
        int j = 0;
        for (int i = node.n; i < node.keys.length; i++) {
          node.keys[i] = rightSib.keys[j];
          node.values[i] = rightSib.values[j];
          node.n++;
          j++;
          if (j == rightSib.n) {
            break;
          }
        } // for
        
        // Update parent and pointers.
        shiftLeft(parent, parentPos);
        shiftChildrenLeft(parent, nodePos + 1);
        parent.n--;
        
        // TODO validate parent
      }
      // Merge with left sibling
      else {
        int parentPos = nodePos - 1;
        BTreeNode leftSib = parent.children[nodePos - 1];
        
        // Update keys and values in sibling.
        // Pull from parent.
        leftSib.keys[leftSib.n] = parent.keys[parentPos];
        leftSib.values[leftSib.n] = parent.values[parentPos];
        leftSib.n++;
        // Pull from node.
        int j = 0;
        for (int i = leftSib.n; i < leftSib.keys.length; i++) {
          leftSib.keys[i] = node.keys[j];
          leftSib.values[i] = node.values[j];
          leftSib.n++;
          j++;
          if (j == node.n - 1) {
            break;
          }
        } // for
        
        // Update parent and pointers.
        shiftLeft(parent, parentPos);
        shiftChildrenLeft(parent, nodePos + 1);
        parent.n--;
        
        // TODO validate parent
      }
    }
    
    /**
     * Rotates values right (clockwise).
     * @param parent - Parent node
     * @param nodePos - For the node to rotate values to, its position in the children array
     * @param sibPos - For the node to rotate values from, its position in the children array
     */
    private void rotateRight(BTreeNode parent, int nodePos, int sibPos) {
      int parentPos = nodePos - 1;
      BTreeNode node = parent.children[nodePos];
      BTreeNode leftSibling = parent.children[sibPos];
      
      // Update node.
      node.keys[0] = parent.keys[parentPos];
      node.values[0] = parent.values[parentPos];
      
      // Update parent.
      parent.keys[parentPos] = leftSibling.keys[leftSibling.n - 1];
      parent.values[parentPos] = leftSibling.values[leftSibling.n - 1];
      
      // Update sibling.
      leftSibling.keys[leftSibling.n - 1] = 0L;
      leftSibling.values[leftSibling.n - 1] = 0L;
      leftSibling.n--;
    }
    
    /**
     * Rotates values left (counter-clockwise).
     * @param parent - Parent node
     * @param nodePos - For the node to rotate values to, its position in the children array
     * @param sibPos - For the node to rotate values from, its position in the children array
     */
    private void rotateLeft(BTreeNode parent, int nodePos, int sibPos) {
      int parentPos = nodePos;
      BTreeNode node = parent.children[nodePos];
      BTreeNode rightSibling = parent.children[sibPos];
      
      // Update node.
      node.keys[node.n - 1] = parent.keys[parentPos];
      node.values[node.n - 1] = parent.values[parentPos];
      
      // Update parent.
      parent.keys[parentPos] = rightSibling.keys[0];
      parent.values[parentPos] = rightSibling.values[0];
      
      // Update sibling.
      shiftLeft(rightSibling, 0);
      rightSibling.n--;
    }
    
    /**
     * Shifts values in the keys and values array right, to make room in position 0.
     * @param node - The node to shift values for
     * @param i - The index to start shifting values at
     */
    private void shiftRight(BTreeNode node, int i) {
      while (i > 0) {
        node.keys[i] = node.keys[i - 1];
        node.values[i] = node.values[i - 1];
        i--;
      }
      node.keys[0] = 0L;
      node.values[0] = 0L;
    }
    
    /**
     * Shifts values in the keys and values arrays left.
     * @param node - The node to shift values for
     * @param i - The index to start shifting values at
     */
    private void shiftLeft(BTreeNode node, int i) {
      // Loop through keys array to shift values down
      while (i < node.n) {
        // If the number of keys did not fill the array
        if (i + 1 < node.keys.length) {
          node.keys[i] = node.keys[i + 1];
          node.values[i] = node.values[i + 1];
        }
        // If the number of keys previously filled the array
        else {
          node.keys[i] = 0L;
          node.values[i] = 0L;
        }
        i++;
      } // while
    }
    
    /**
     * Shifts children pointers left.
     * @param node - The node to shift children for
     * @param i - The index to start shifting values at
     */
    private void shiftChildrenLeft(BTreeNode node, int i) {
      // Loop through keys array to shift values down
      while (i <= node.n) {
        // If the number of keys did not fill the array
        if (i + 1 < node.children.length) {
          node.children[i] = node.children[i + 1];
        }
        // If the number of keys previously filled the array
        else {
          node.children[i] = null;
        }
        i++;
      } // while
    }

    List<Long> print() {

        List<Long> listOfRecordID = new ArrayList<>();

        // Begin with root
        listOfRecordID = printNode(root);
        
        return listOfRecordID;
    }

    // Print helper
    List<Long> printNode(BTreeNode node) {
        List<Long> listOfRecordID = new ArrayList<>();

        // Null check
        if (node == null) {
            // Return empty list
            return listOfRecordID;
        }

        if (node.leaf) {
            // Add each value in order
            for (int i = 0; i < node.n; i++) {
                listOfRecordID.add(node.values[i]);
            }
            // Continue adding values from "node.next" (recursive)
            listOfRecordID.addAll(printNode(node.next));
        } else {
            // Start from left-most child
            return printNode(node.children[0]); // In a properly built B+Tree, this will never run into IndexOutOfBoundsException
        }
        return listOfRecordID;
    }
}
