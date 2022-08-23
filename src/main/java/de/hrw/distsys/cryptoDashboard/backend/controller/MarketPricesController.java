package de.hrw.distsys.cryptoDashboard.backend.controller;

import de.hrw.distsys.cryptoDashboard.backend.service.MarketPricesService;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "/market_prices")
public class MarketPricesController {

    private final MarketPricesService marketPricesService;

    @Autowired
    public MarketPricesController(MarketPricesService marketPricesService) {
        this.marketPricesService = marketPricesService;
    }

    @GetMapping(path = "/current")
    public JSONObject getMarketPrices() {
        return marketPricesService.getMarketPrices();
    }

    @GetMapping(path = "/historical")
    public List<JSONObject> getMarketPriceHistorical(@RequestParam List<String> coins, @RequestParam(name = "period_in_days") Long days) {
        return marketPricesService.getMarketPriceHistorical(coins, days);
    }

}
