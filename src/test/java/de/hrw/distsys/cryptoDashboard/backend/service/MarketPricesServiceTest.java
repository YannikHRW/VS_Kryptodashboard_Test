package de.hrw.distsys.cryptoDashboard.backend.service;

import io.restassured.RestAssured;
import io.restassured.response.Response;
import org.junit.jupiter.api.Test;

class MarketPricesServiceTest {

    @Test
    void checkRestResponse() {

        /*String one = "https://demo.guru99.com/V4/sinkministatement.php?CUSTOMER_ID=68195&PASSWORD=1234!&Account_No=1";
        String two = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Cwaves&vs_currencies=eur";
        String three = "https://wavescap.com/api/totals.json";


        Response response1 = RestAssured.given().when().get(one);
        response1.then().log().all();

        Response response2 = RestAssured.given().when().get(two);
        response2.then().log().all();

        Response response3 = RestAssured.given().when().get(three);
        response3.then().log().all();*/


        //Assertions.assertEquals(response.statusCode(), 200);
       // Assertions.assertEquals(response.contentType(), "application/json; charset=utf-8");

        //response.then().assertThat().body(matchesJsonSchemaInClasspath("products-schema.json"));

        /*RestAssured.given().queryParam("ids", {"bitcoin", "ethereum", "waves"})
                .queryParam("vs_currencies", "eur")
                .when().get("https://api.coingecko.com/api/v3/simple/price").then().log().all();*/
    }

    @Test
    void getMarketPriceHistorical() {
    }
}