package utils;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;

public class utils {
    //inputStream转outputStream
    public static ByteArrayOutputStream parse(InputStream in) throws Exception {
        ByteArrayOutputStream swapStream = new ByteArrayOutputStream();
        int ch;
        while ((ch = in.read()) != -1) {
            swapStream.write(ch);
        }
        return swapStream;
    }

}
