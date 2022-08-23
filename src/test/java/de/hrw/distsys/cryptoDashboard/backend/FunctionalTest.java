package de.hrw.distsys.cryptoDashboard.backend;

import io.restassured.RestAssured;
import org.junit.BeforeClass;

public class FunctionalTest {

    //Wird nicht ausgeführt?!
    @BeforeClass
    public static void setup() {
        String port = System.getProperty("server.port");
        if (port == null) {
            RestAssured.port = 8080;
        }
        else{
            RestAssured.port = Integer.parseInt(port);
        }

        String basePath = System.getProperty("server.base");
        if(basePath == null){
            basePath = "/market_prices/";
        }
        RestAssured.basePath = basePath;

        String baseHost = System.getProperty("server.host");
        if(baseHost == null){
            baseHost = "http://localhost";
        }
        RestAssured.baseURI = baseHost;

    }

}
