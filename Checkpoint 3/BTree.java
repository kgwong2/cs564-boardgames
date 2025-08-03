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

    /**
     * Deletes the given studentId from the BTree and the student.csv.
     * 
     * @param studentId- The studentId to search for and delete.
     * @return True if student was deleted. False otherwise.
     */
    boolean delete(long studentId) {
      // Check if the BTree is empty.
      if (this.root == null) {
        return false;
      }

      // Run deleteHelper to delete from BTree.
      boolean isDeleted =
          deleteHelper(null, this.root, studentId, new LongRef(-1));

      // If deletion succeeds, delete in student.csv.
      if (isDeleted) {
        try {
          // Read from file.
          BufferedReader reader =
              new BufferedReader(new FileReader("src/Student.csv"));
          
          String curLine = reader.readLine();
          String splitBy = ",";
          List<String> linesToWrite = new ArrayList<String>();
          
          while (curLine != null) {
            String[] studentData = curLine.split(splitBy);
            long csvstudentId = Long.parseLong(studentData[0]);
            if (csvstudentId != studentId) {
              linesToWrite.add(curLine);
            }
            curLine = reader.readLine();
          } // while
          
          reader.close();
          
          // Write to file.
          FileWriter writer = new FileWriter("src/Student.csv");
          for (int i = 0; i < linesToWrite.size(); i++) {
            writer.write(linesToWrite.get(i));
            writer.write("\n");
          }
          writer.close();

        } catch (IOException e) {
          e.printStackTrace();
          System.out.println("Error updating student.csv for deletion.");
        }
      }

      return isDeleted;
    }

    /**
     * Recursive helper method to delete studentId from the B-Tree. Student
     * deletion works only if the studentID is in a leaf node.
     * 
     * @param parent       - The parent node.
     * @param node         - The current node that is being checked.
     * @param studentId    - The studentId to search for and delete.
     * @param oldStudentId - The studentId to delete from the parent, if a child
     *                     is deleted because of a merge.
     * @return True if a studentId is found and deleted. False otherwise.
     */
    private boolean deleteHelper(BTreeNode parent, BTreeNode node, long studentId,
        LongRef oldStudentId) {

      // If node is non-leaf,
      if (!node.leaf) {

        int j = findChildIndex(node, studentId);
        boolean isDeleted =
            deleteHelper(node, node.children[j], studentId, oldStudentId);

        // If nothing was deleted,
        if (!isDeleted) {
          return isDeleted;
        }

        // If child was not deleted,
        if (oldStudentId.value == -1) {
          return isDeleted;
        }
        // If child was deleted from merge, check minimum degree.
        else {
          int i = findKeysIndex(node, oldStudentId.value);

          // Node has entries to spare OR the node is the root
          if (node.n > node.t || parent == null) {
            shiftLeft(node, i);
            shiftChildrenLeft(node, i + 1);
            node.n--;
            oldStudentId.value = -1;
            return isDeleted;
          }
          // Node doesn't have entries to spare
          else {
            // Find indices in the parent's children array
            int nodeIndex = findChildIndex(parent, oldStudentId.value);
            int siblingIndex = findSiblingIndex(parent, nodeIndex);

            // Redistribute between node and sibling
            if (siblingIndex != -1) {
              redistribute(parent, nodeIndex, siblingIndex, i);
              oldStudentId.value = -1;
              return isDeleted;
            }
            // Merge node and sibling
            else {
              // Set oldStudentId for recursive removal and check.
              oldStudentId.value = parent.keys[nodeIndex];
              shiftRight(node, i);
              merge(parent, nodeIndex);
              return isDeleted;
            }
          } // else node has no entries to spare
        } // else child was deleted from merge
      }
      // If node is leaf,
      else {
        int i = findKeysIndex(node, studentId); // Find studentId keys index.

        // If index is same as length of keys array, studentId was not found.
        if (i == node.keys.length) {
          return false;
        }
        // Otherwise, studentId was found.
        else {
          // Node has entries to spare OR the root is a leaf
          if (node.n > node.t || parent == null) {
            shiftLeft(node, i);
            node.n--;
            oldStudentId.value = -1;
            return true;
          }
          // Node doesn't have entries to spare.
          else {
            // Find indices in the parent's children array
            int nodeIndex = findChildIndex(parent, studentId);
            int siblingIndex = findSiblingIndex(parent, nodeIndex);

            // Redistribute between node and sibling
            if (siblingIndex != -1) {
              redistribute(parent, nodeIndex, siblingIndex, i);
              oldStudentId.value = -1;
              return true;
            }
            // Merge node and sibling
            else {
              // Set oldStudentId for recursive removal and check.
              oldStudentId.value = parent.keys[nodeIndex];
              shiftRight(node, i);
              merge(parent, nodeIndex);
              return true;
            } // else merge
          } // else node has no entries to spare
        } // else studentId found
      } // else node is leaf
    }

    /**
     * Wrapper class to store oldStudentId.
     */
    private static class LongRef {
      long value;

      // Constructor
      LongRef(long value) {
        this.value = value;
      }
    }

    /**
     * Finds the node's children array index for a given studentId.
     * 
     * @param node      - The node to search the children array index
     * @param studentId - The studentId
     * @return The index in the children array
     */
    private int findChildIndex(BTreeNode node, long studentId) {
      int i = 0;
      while (i < node.n) {
        // Return when studentId is less than the comparisonId
        if (studentId < node.keys[i]) {
          return i;
        }
        i++;
      }
      return i;
    }

    /**
     * Finds the node's keys array index for a given studentId.
     * 
     * @param node      - The node to search the keys array
     * @param studentId - The studentId
     * @return The index in the keys (and values) array
     */
    private int findKeysIndex(BTreeNode node, long studentId) {
      int i = 0;
      while (i < node.n) {
        // Return when studentId is equal to the comparisonId
        if (studentId == node.keys[i]) {
          return i;
        }
        i++;
      }
      return i;
    }

    /**
     * Delete helper method to find the index of the sibling the node will pull
     * key values from, when the node has minimum number of keys. If neither
     * sibling can be used, returns -1.
     * 
     * @param parent    - Parent node
     * @param nodeIndex - Node's index in the parent's children array
     * @return The sibling's index in the children array. If neither sibling can
     *         be used, returns -1.
     */
    private int findSiblingIndex(BTreeNode parent, int nodeIndex) {
      // Fields
      int leftIndex = nodeIndex - 1;
      int rightIndex = nodeIndex + 1;
      BTreeNode leftSibling = null;
      BTreeNode rightSibling = null;
      boolean useLeft = false;
      boolean useRight = false;

      // If left sibling exists,
      if (nodeIndex > 0) {
        leftSibling = parent.children[leftIndex];
        // Check if left sibling has keys to spare.
        if (leftSibling.n > leftSibling.t) {
          useLeft = true;
        }
      }

      // If right sibling exists,
      if (nodeIndex < parent.n) {
        rightSibling = parent.children[rightIndex];
        // Check if right sibling has keys to spare.
        if (rightSibling.n > rightSibling.t) {
          useRight = true;
        }
      }

      // If both siblings have keys to spare, pick the one with more keys.
      if (useLeft && useRight) {
        if (leftSibling.n >= rightSibling.n) {
          return leftIndex;
        } else {
          return rightIndex;
        }
      }
      // If only left can be used.
      if (useLeft) {
        return leftIndex;
      }
      // If only right can be used.
      if (useRight) {
        return rightIndex;
      }
      // Neither sibling can be used.
      return -1;
    }

    /**
     * Redistributes keys and values between a node and its sibling by rotating
     * values through the parent.
     * 
     * @param parent       - The parent node
     * @param nodeIndex    - The index of the node in the parent's children array
     * @param sibIndex     - The index of the sibling in the parent's children
     *                     array
     * @param studentIndex - The index of the studentId in the node's keys array
     */
    private void redistribute(BTreeNode parent, int nodeIndex, int sibIndex,
        int studentIndex) {
      BTreeNode node = parent.children[nodeIndex];

      // Pull from left sibling (rotate right)
      if (sibIndex < nodeIndex) {
        shiftRight(node, studentIndex); // Remove studentId
        if (!node.leaf) {
          shiftChildrenRight(node, studentIndex);
        }
        rotateRight(parent, studentIndex, sibIndex);
      }
      // Pull from right sibling (rotate left)
      else {
        shiftLeft(node, studentIndex); // Remove studentId
        if (!node.leaf) {
          shiftChildrenLeft(node, studentIndex + 1);
        }
        rotateLeft(parent, studentIndex, sibIndex);
      }
    }

    /**
     * Merges two nodes. This method always merges with the right sibling, unless
     * the node has no right sibling (that is, it is the last node in the children
     * array).
     * 
     * @param parent    - The parent node
     * @param nodeIndex - The index of the node in the parent's children array
     */
    private void merge(BTreeNode parent, int nodeIndex) {
      BTreeNode node = parent.children[nodeIndex];

      // Merge with right sibling, unless node has no right sibling.
      if (nodeIndex != parent.n) {
        int parentIndex = nodeIndex;
        BTreeNode rightSib = parent.children[nodeIndex + 1];

        // Update keys and values in node.
        // Node <-- parent
        node.keys[node.n - 1] = parent.keys[parentIndex];
        node.values[node.n - 1] = parent.values[parentIndex];
        // Node <-- sibling
        int j = 0; // Sibling keys and values index
        for (int i = node.n; i < node.keys.length; i++) {
          node.keys[i] = rightSib.keys[j];
          node.values[i] = rightSib.values[j];
          node.n++;
          j++;
          // Exit the loop after all sibling keys and values have been moved.
          if (j == rightSib.n) {
            break;
          }
        } // for

        // Update sibling pointer.
        if (node.leaf && rightSib.next != null) {
          node.next = rightSib.next;
        }
      }
      // Merge with left sibling
      else {
        int parentPos = nodeIndex - 1;
        BTreeNode leftSib = parent.children[nodeIndex - 1];

        // Update keys and values in sibling.
        // Sibling <-- parent
        leftSib.keys[leftSib.n] = parent.keys[parentPos];
        leftSib.values[leftSib.n] = parent.values[parentPos];
        leftSib.n++;
        // Sibling <-- node
        int j = 0; // Node keys and values index
        for (int i = leftSib.n; i < leftSib.keys.length; i++) {
          leftSib.keys[i] = node.keys[j];
          leftSib.values[i] = node.values[j];
          leftSib.n++;
          j++;
          // Exit the loop after all node keys and values have been moved.
          if (j == node.n - 1) {
            break;
          }
        } // for

        // Update sibling pointer.
        if (leftSib.leaf) {
          leftSib.next = null;
        }
      }
    }

    /**
     * Rotates values right (clockwise). That is, the left sibling distributes
     * values to the node through their shared parent.
     * 
     * @param parent    - The parent node
     * @param nodeIndex - The index of the node in the parent's children array
     * @param sibIndex  - The index of the left sibling in the parent's children
     *                  array
     */
    private void rotateRight(BTreeNode parent, int nodeIndex, int sibIndex) {
      int parentPos = nodeIndex - 1;
      BTreeNode node = parent.children[nodeIndex];
      BTreeNode leftSibling = parent.children[sibIndex];

      // Update node.
      node.keys[0] = parent.keys[parentPos];
      node.values[0] = parent.values[parentPos];
      if (!node.leaf) {
        node.children[0] = leftSibling.children[leftSibling.n];
      }

      // Update parent.
      parent.keys[parentPos] = leftSibling.keys[leftSibling.n - 1];
      parent.values[parentPos] = leftSibling.values[leftSibling.n - 1];

      // Update sibling.
      leftSibling.keys[leftSibling.n - 1] = 0L;
      leftSibling.values[leftSibling.n - 1] = 0L;
      leftSibling.n--;
    }

    /**
     * Rotates values left (counter-clockwise). That is, the right sibling
     * distributes values to the node through their shared parent.
     * 
     * @param parent    - Parent node
     * @param nodeIndex - The index of the node in the parent's children array
     * @param sibIndex  - The index of the right sibling in the parent's children
     *                  array
     */
    private void rotateLeft(BTreeNode parent, int nodeIndex, int sibIndex) {
      int parentPos = nodeIndex;
      BTreeNode node = parent.children[nodeIndex];
      BTreeNode rightSibling = parent.children[sibIndex];

      // Update node.
      node.keys[node.n - 1] = parent.keys[parentPos];
      node.values[node.n - 1] = parent.values[parentPos];
      if (!node.leaf) {
        node.children[node.n] = rightSibling.children[0];
      }

      // Update parent.
      parent.keys[parentPos] = rightSibling.keys[0];
      parent.values[parentPos] = rightSibling.values[0];

      // Update sibling.
      shiftLeft(rightSibling, 0);
      if (!rightSibling.leaf) {
        shiftChildrenLeft(rightSibling, 0);
      }
      rightSibling.n--;
    }

    /**
     * Shifts values in the keys and values array right, to make room in position
     * 0.
     * 
     * @param node - The node to shift values for
     * @param i    - The index to start shifting values at
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
     * 
     * @param node - The node to shift values for
     * @param i    - The index to start shifting values at
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
     * Shifts children pointers right.
     * 
     * @param node - The node to shift children for
     * @param i    - The index to start shifting values at
     */
    private void shiftChildrenRight(BTreeNode node, int i) {
      // Loop through children array to shift children up
      while (i > 0) {
        node.children[i] = node.children[i - 1];
        i--;
      }
      node.children[0] = null;
    }

    /**
     * Shifts children pointers left.
     * 
     * @param node - The node to shift children for
     * @param i    - The index to start shifting values at
     */
    private void shiftChildrenLeft(BTreeNode node, int i) {
      // Loop through children array to shift children down
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
