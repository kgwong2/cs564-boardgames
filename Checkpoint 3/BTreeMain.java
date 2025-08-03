import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.util.Random;
import java.io.FileWriter;

/**
 * Main Application.
 */
public class BTreeMain {

    public static void main(String[] args) {

        /** Read the input file -- input.txt */
        Scanner scan = null;
        try {
            scan = new Scanner(new File("src/input.txt"));
        } catch (FileNotFoundException e) {
            System.out.println("File not found.");
        }

        /** Read the minimum degree of B+Tree first */

        int degree = scan.nextInt();

        BTree bTree = new BTree(degree);

        /** Reading the database student.csv into B+Tree Node*/
        List<Student> studentsDB = getStudents();

        for (Student s : studentsDB) {
            bTree.insert(s);
        }

        /** Start reading the operations now from input file*/
        try {
            while (scan.hasNextLine()) {
                Scanner s2 = new Scanner(scan.nextLine());

                while (s2.hasNext()) {

                    String operation = s2.next();

                    switch (operation) {
                        case "insert": {

                            long studentId = Long.parseLong(s2.next());
                            String studentName = s2.next() + " " + s2.next();
                            String major = s2.next();
                            String level = s2.next();
                            int age = Integer.parseInt(s2.next());
                            
                            long recordID;
                            if (s2.hasNext()) {
                                recordID = Long.parseLong(s2.next());
                            } else {
                                Random r = new Random();
                                recordID = r.nextInt(Integer.MAX_VALUE);
                            }

                            Student s = new Student(studentId, age, studentName, major, level, recordID);
                            bTree.insert(s);
                            
                            if(!studentsDB.contains(s)) {
                                studentsDB.add(s);
                                //insert student into student.csv
                                try(
                                    FileWriter fw = new FileWriter("src/Student.csv", true);   
                                ) {
                                    fw.write(studentId + "," + studentName + "," + major + "," + level + "," + age + "," + recordID + "\n");
                                } catch (Exception e) {
                                    System.out.println("Error writing to student.csv: " + e.getMessage());
                                }
                            }

                            System.out.println("Student inserted successfully.");

                            break;
                        }
                        case "delete": {
                            long studentId = Long.parseLong(s2.next());
                            boolean result = bTree.delete(studentId);
                            if (result)
                                System.out.println("Student deleted successfully.");
                            else
                                System.out.println("Student deletion failed.");

                            break;
                        }
                        case "search": {
                            long studentId = Long.parseLong(s2.next());
                            long recordID = bTree.search(studentId);
                            if (recordID != -1)
                                System.out.println("Student exists in the database at " + recordID);
                            else
                                System.out.println("Student does not exist.");
                            break;
                        }
                        case "print": {
                            List<Long> listOfRecordID = new ArrayList<>();
                            listOfRecordID = bTree.print();
                            System.out.println("List of recordIDs in B+Tree " + listOfRecordID.toString());
                        }
                        default:
                            System.out.println("Wrong Operation");
                            break;
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static List<Student> getStudents() {
        List<Student> studentList = new ArrayList<>();
        Scanner scan = null;
        try {
            scan = new Scanner(new File("src/Student.csv"));
            while (scan.hasNextLine()) {
                String line = scan.nextLine();
                if (line.isEmpty()) { break; }
                String[] params = line.split(",");
                Student student = new Student(Long.parseLong(params[0]), Integer.parseInt(params[4]), params[1], params[2], params[3], Long.parseLong(params[5]));
                studentList.add(student);
            }
        } catch (FileNotFoundException e) {
            System.out.println("File not found.");
        }
        return studentList;
    }
}
