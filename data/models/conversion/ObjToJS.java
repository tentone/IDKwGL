import java.util.Scanner;
import java.io.*;
import java.util.regex.Pattern;

class ObjToJS
{
  private static Scanner sc = new Scanner(System.in);
  
  public static void main(String[] args) throws Exception
  {
    System.out.println("File to read:");
    String file_name = sc.next();
    System.out.println(file_name);
    String name = file_name.split(Pattern.quote("."))[0];
    
    Scanner fs = new Scanner(new File(file_name));
    PrintWriter fp = new PrintWriter(new File(name+".js"));
    
    System.out.println("Converting!");
    fp.print(name + " = \"");
    while(fs.hasNextLine())
    {
      fp.print(fs.nextLine() + "\\n");
      fp.flush();
    }
    fp.print("\";");
    fs.close();
    fp.close();
    System.out.println("Done!");
  }
}