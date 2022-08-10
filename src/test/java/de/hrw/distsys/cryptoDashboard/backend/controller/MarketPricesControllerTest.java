package de.hrw.distsys.cryptoDashboard.backend.controller;

import de.hrw.distsys.cryptoDashboard.backend.FunctionalTest;
import io.restassured.RestAssured;
import org.junit.jupiter.api.Test;

import static org.hamcrest.Matchers.containsString;

class MarketPricesControllerTest extends FunctionalTest {

    @Test
    void basicPingTest() {
        RestAssured.given().when().get().then()
                .statusCode(200);
        RestAssured.given().when().get("/market_prices/current").then()
                .statusCode(200);
        RestAssured.given().when().get("/market_prices/historical").then()
                .statusCode(400);
    }

    @Test
    void verifyIfResponseTypeIsJSON() {
        RestAssured.given().when().get("/market_prices/current").then()
                .contentType("application/json");
        RestAssured.given().queryParam("coins", "bitcoin", "waves", "ethereum")
                .queryParam("period_in_days", "1")
                .when().get("/market_prices/historical")
                .then().contentType("application/json");
    }

    @Test
    void verifyIfBodyContainsCurrencies() {
        RestAssured.given().when().get("/market_prices/current").then()
                .body(containsString("bitcoin"))
                .body(containsString("ethereum"))
                .body(containsString("waves"));
        RestAssured.given()
                .queryParam("coins", "bitcoin", "waves", "ethereum")
                .queryParam("period_in_days", "1")
                .when().get("/market_prices/historical")
                .then()
                .body(containsString("bitcoin"))
                .body(containsString("waves"))
                .body(containsString("ethereum"))
                .body(containsString("prices"));
    }

    @Test
    void verifyIfBodyContainsCurrenciesInEur() {
        RestAssured.given().when().get("/market_prices/current").then()
                .body(containsString("eur"));
    }

}