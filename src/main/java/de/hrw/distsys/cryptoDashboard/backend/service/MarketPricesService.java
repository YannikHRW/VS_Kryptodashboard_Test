package de.hrw.distsys.cryptoDashboard.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.json.simple.JSONObject;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

@Service
public class MarketPricesService {

    private final ObjectMapper objectMapper = new ObjectMapper();

    public JSONObject getMarketPrices() {
        try {
            URL url = new URL("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Cethereum%2Cwaves&vs_currencies=eur");
            return objectMapper.readValue(url, JSONObject.class);
        } catch (MalformedURLException mue) {
            System.err.println("URL has wrong format!");
            mue.printStackTrace();
        } catch (IOException ioe) {
            ioe.printStackTrace();
        }
        return new JSONObject();
    }

    public List<JSONObject> getMarketPriceHistorical(List<String> coins, Long days) {

        long currentDateTimeInUnix = System.currentTimeMillis() / 1000;
        long fromUnix = currentDateTimeInUnix - (days * 24 * 60 * 60);

        List<JSONObject> jsonObjectList = new ArrayList<>();

        for (String coin : coins) {
            JSONObject jsonObject;
            try {
                jsonObject = objectMapper.readValue(new URL(
                                "https://api.coingecko.com/api/v3/coins/" + coin + "/market_chart/range?vs_currency=eur&from=" + fromUnix + "&to=" + currentDateTimeInUnix),
                        JSONObject.class);
                // hier vllt noch einbauen, dass bei falschem coin-String i wie auf den 404 reagiert wird (vllt exc)
                jsonObject.put("name", coin);
                jsonObjectList.add(jsonObject);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return jsonObjectList;
    }
}