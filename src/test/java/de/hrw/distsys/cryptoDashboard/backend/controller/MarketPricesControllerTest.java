package de.hrw.distsys.cryptoDashboard.backend.controller;

import de.hrw.distsys.cryptoDashboard.backend.service.MarketPricesService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(SpringExtension.class)
@WebMvcTest(MarketPricesController.class)
class MarketPricesControllerTest {

    private MarketPricesService underTest;

    @BeforeEach
    void setUp() {
        underTest = new MarketPricesService();
    }

    @Test
    void getMarketPrices() {
    }

    @Test
    void getMarketPriceHistorical() {
    }
}