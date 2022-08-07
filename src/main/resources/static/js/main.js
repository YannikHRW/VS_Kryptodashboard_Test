"use strict"

document.addEventListener("DOMContentLoaded", () => {

    let currentPricesRequest = new XMLHttpRequest();
    currentPricesRequest.open('GET', "http://localhost:8080/market_prices/current");
    currentPricesRequest.responseType = 'json';
    currentPricesRequest.send();

    currentPricesRequest.onload = function () {
        const result = currentPricesRequest.response;
        document.getElementById("bitcoin-price").innerText = result.bitcoin.eur;
        document.getElementById("ethereum-price").innerText = result.ethereum.eur;
        document.getElementById("waves-price").innerText = result.waves.eur;
    }

    /*let btns = document.getElementsByClassName("btn-typ-1");
    for (const btn of btns) {
        btn.addEventListener("click", () => {
            btn.classList.toggle("selected");
            myChart.destroy();
            createChart()
        })
    }*/

    /* function createURL() {
         const selected = document.getElementsByClassName("selected")
         let URLString = "";
         for (const selectedElement of selected) {
             if (selectedElement === selected[0]) {
                 URLString = selectedElement.id
             } else {
                 URLString += "%2C" + selectedElement.id
             }
         }
         return URLString;
     }*/


    function random_rgb() {
        let o = Math.round, r = Math.random, s = 255;
        return 'rgb(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ')';
    }

    const periodSelector = document.getElementById("period-select");

    let myChart;

    createChart();

    periodSelector.onchange = () => {
        myChart.destroy();
        createChart();
    }

    function createChart() {
        let historicalPricesRequest = new XMLHttpRequest();
        historicalPricesRequest.open('GET', "http://localhost:8080/market_prices/historical?coins=bitcoin%2Cethereum%2Cwaves&period_in_days=" + periodSelector.value);
        historicalPricesRequest.responseType = 'json';
        historicalPricesRequest.send();

        historicalPricesRequest.onload = function () {
            let result = historicalPricesRequest.response;
            let labels = [];
            let datasets = [];
            let dataset;
            let coinData = [];

            for (const coin of result) {
                for (const priceData of coin.prices) {
                    //Beim ersten Coin die Labels mithilfe der Unixzeit anlegen und in das Labels-Array packen
                    if (coin === result[0]) {
                        labels.push(new Date(priceData[0]).toUTCString().substring(5, 25))
                    }
                    coinData.push(priceData[1]);
                }
                dataset = {
                    label: coin.name,
                    backgroundColor: random_rgb(),
                    borderColor: random_rgb(),
                    data: coinData
                }
                datasets.push(dataset)
                coinData = [];
            }

            const chartData = {
                labels: labels,
                datasets: datasets
            };

            // hier vielleicht noch die Punkteanzahl begrenzen
            const config = {
                type: 'line',
                data: chartData,
                options: {
                    scales: {
                        x: {
                            ticks: {
                                maxTicksLimit: 30
                            }
                        }
                    }
                }
            };
            myChart = new Chart(
                document.getElementById('myChart'),
                config
            );
        }
    }
})