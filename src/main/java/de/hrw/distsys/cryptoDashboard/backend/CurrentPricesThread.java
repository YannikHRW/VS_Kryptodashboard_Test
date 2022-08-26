package de.hrw.distsys.cryptoDashboard.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.hrw.distsys.cryptoDashboard.backend.service.MarketPricesService;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Component
public class CurrentPricesThread {

    private ExecutorService executorService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final MarketPricesService marketPricesService;

    @Autowired
    public CurrentPricesThread(MarketPricesService marketPricesService) {
        this.marketPricesService = marketPricesService;
    }

    //https://programtalk.com/java/start-background-thread-using-spring-on/
    @PostConstruct
    public void init() {

        executorService = Executors.newSingleThreadExecutor();
        executorService.execute(new Runnable() {

            @Override
            public void run() {
                try {
                    while (true) {
                        try {
                            URL url = new URL("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Cethereum%2Cwaves&vs_currencies=eur");
                            System.out.println("coingecko request prices");
                            marketPricesService.setPricesJSON(objectMapper.readValue(url, JSONObject.class));
                        } catch (MalformedURLException mue) {
                            System.err.println("URL has wrong format!");
                            mue.printStackTrace();
                        } catch (IOException ioe) {
                            ioe.printStackTrace();
                        }
                        System.out.println("prices set");
                        Thread.sleep(300000);
                    }
                    // do something
                } catch (Exception e) {
                    System.out.println("error");;
                }
            }
        });

        executorService.shutdown();

    }

    @PreDestroy
    public void beandestroy() {
        if (executorService != null) {
            executorService.shutdownNow();
        }
    }
}
