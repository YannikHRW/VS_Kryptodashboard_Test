package de.hrw.distsys.cryptoDashboard.backend.service;

import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.LineNumberReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
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


       /* URL url = new URL()*/


        long currentDateTimeInUnix = System.currentTimeMillis() / 1000;
        long fromUnix = currentDateTimeInUnix - (days * 24 * 60 * 60);


        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        String todaysDate = dtf.format(LocalDateTime.now());
        LocalDate dateTime = LocalDate.parse(todaysDate);
        LocalDate fromDate = dateTime.minusDays(days);


        List<JSONObject> jsonObjectList = new ArrayList<>();

        for (String coin : coins) {
            JSONObject jsonObject;
            JSONObject jsonObject1;
            try {
                jsonObject = objectMapper.readValue(new URL(
                                "https://api.coingecko.com/api/v3/coins/" + coin + "/market_chart/range?vs_currency=eur&from=" + fromUnix + "&to=" + currentDateTimeInUnix),
                        JSONObject.class);

                if (!coin.equals("waves")) {

                    jsonObject1 = objectMapper.readValue(new URL(
                            "https://api.blockchair.com/" + coin + "/transactions?a=date,avg(fee_usd),count()&q=time(" + fromDate + ".." + todaysDate + ")"), JSONObject.class);

                    List<LinkedHashMap> array = (ArrayList<LinkedHashMap>) jsonObject1.get("data");
                    JSONObject ob = new JSONObject();
                    for (LinkedHashMap js : array) {
                        String date = (String) js.get("date");
                        js.put("amount_of_transactions", js.get("count()"));
                        js.remove("count()");
                        js.remove("date");
                        ob.put(date, js);
                    }
                    jsonObject.put("daily_infos", ob);
                }
                /*ob.forEach((x,y) -> System.out.println(x + ": " + y));
                System.out.println(ob);
                List<JSONObject> list = (ArrayList<JSONObject>) jsonObject1.get("data");
                for (int i = 0; i < list.size(); i++) {
                    System.out.println(list.get(i));
                    JSONObject js = list.get(i);
                    js.
                }

                list.set(0, "halo");
                list.forEach(x -> x.);*/



                // hier vllt noch einbauen, dass bei falschem coin-String i wie auf den 404 reagiert wird (vllt exc)
                jsonObject.put("name", coin);
                jsonObjectList.add(jsonObject);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return jsonObjectList;
    }

    /*public JSONObject getFeeHistorical() {

    }*/
}