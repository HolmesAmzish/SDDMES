package cn.arorms.sdd.data;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Base64;

public class Base64Test {
    public static void main(String[] args) throws IOException {
        String base64String = Files.readString(Paths.get("/home/cacc/Repositories/SDDMES/backend-api/src/test/java/cn/arorms/sdd/data/base64.txt"));
        byte[] data = Base64.getDecoder().decode(base64String);
        Files.write(Paths.get("output.png"), data);
    }
}
