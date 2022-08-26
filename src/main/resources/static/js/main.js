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
                        //https://www.codegrepper.com/code-examples/javascript/javascript+format+date+yyyy-mm-dd
                        labels.push(new Date(priceData[0]).toISOString())
                    }
                    coinData.push(priceData[1]);
                }
                dataset = {
                    label: coin.name,
                    backgroundColor: random_rgb(),
                    borderColor: random_rgb(),
                    data: coinData,
                    dailyInfos: coin.daily_infos
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
                    //https://www.chartjs.org/docs/latest/configuration/tooltip.html#tooltip-callbacks
                    plugins: {
                        tooltip: {
                            callbacks: {
                                title: function(context) {
                                    return context[0].dataset.label.charAt(0).toUpperCase() + context[0].dataset.label.substring(1)
                                },
                                label: function(context) {
                                    let label = context.dataset.label || '';

                                    if (label) {
                                        label = 'Price: ';
                                    }
                                    if (context.parsed.y !== null) {
                                        label += new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(context.parsed.y);
                                    }
                                    return label;
                                },
                                afterLabel: function(context) {

                                    //https://stackoverflow.com/questions/37611143/access-json-data-with-string-path
                                    let date = context.label.substring(0, 10);

                                    let currentFee = ("dataset.dailyInfos." + date + ".avg(fee_usd)").split(".").reduce(function (o, k) {
                                        return o && o[k];
                                    }, context);
                                    let transactions = ("dataset.dailyInfos." + date + ".amount_of_transactions").split(".").reduce(function (o, k) {
                                        return o && o[k];
                                    }, context);

                                    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat
                                    return 'Fee: ' + new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(currentFee) + "\n" +
                                        'Transactions: ' + new Intl.NumberFormat('de-DE').format(transactions);
                                },
                                footer: function(context) {
                                    return 'Date: ' + context[0].label
                                }
                            }
                        }
                    },
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