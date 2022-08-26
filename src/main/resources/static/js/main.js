"use strict"

document.addEventListener("DOMContentLoaded", () => {


    let currentPricesRequest = new XMLHttpRequest();
    currentPricesRequest.open('GET', "http://localhost:8080/market_prices/current");
    currentPricesRequest.responseType = 'json';
    currentPricesRequest.send();

    currentPricesRequest.onload = function () {
        const result = currentPricesRequest.response;
        console.log(result)
        document.getElementById("bitcoin-price").innerText = result.bitcoin.eur;
        document.getElementById("ethereum-price").innerText = result.ethereum.eur;
        document.getElementById("waves-price").innerText = result.waves.eur;
    }

    setInterval(() => {
        let currentPricesRequest = new XMLHttpRequest();
        currentPricesRequest.open('GET', "http://localhost:8080/market_prices/current");
        currentPricesRequest.responseType = 'json';
        currentPricesRequest.send();

        currentPricesRequest.onload = function () {
            const result = currentPricesRequest.response;
            console.log("updated")
            console.log(result)

            document.getElementById("bitcoin-price").innerText = result.bitcoin.eur;
            document.getElementById("ethereum-price").innerText = result.ethereum.eur;
            document.getElementById("waves-price").innerText = result.waves.eur;
        }
    }, 60000)


    /*let btns = document.getElementsByClassName("btn-typ-1");
    for (const btn of btns) {
        btn.addEventListener("click", () => {
            btn.classList.toggle("selected");
            myChart.destroy();
            createCharts()
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

    let pricesChart;
    let relationChart;

    createCharts();

    periodSelector.onchange = () => {
        pricesChart.destroy();
        relationChart.destroy();
        createCharts();
    }

    function createCharts() {
        let historicalPricesRequest = new XMLHttpRequest();
        historicalPricesRequest.open('GET', "http://localhost:8080/market_prices/historical?coins=waves%2Cbitcoin%2Cethereum&period_in_days=" + periodSelector.value);
        historicalPricesRequest.responseType = 'json';
        historicalPricesRequest.send();

        historicalPricesRequest.onload = function () {

            let result = historicalPricesRequest.response;
            let labels = [];

            let datasets = [];
            let dataset;
            let coinData = [];

            let datasets2 = [];
            let dataset2;
            let coinPerformanceData = [];
            let firstPrice;

            for (const coin of result) {

                let i = 1
                for (const priceData of coin.prices) {

                    i++;
                    //Beim ersten Coin die Labels mithilfe der Unixzeit anlegen und in das Labels-Array packen
                    if (coin === result[0]) {
                        //https://www.codegrepper.com/code-examples/javascript/javascript+format+date+yyyy-mm-dd
                        labels.push(new Date(priceData[0]).toISOString())
                    }
                    coinData.push(priceData[1]);


                    if (priceData === coin.prices[0]) {
                        firstPrice = priceData[1];
                    }
                    coinPerformanceData.push((priceData[1] / firstPrice - 1) * 100)
                }

                let backgroundColor = random_rgb();
                let borderColor = random_rgb();

                dataset = {
                    label: coin.name,
                    backgroundColor: backgroundColor,
                    borderColor: borderColor,
                    data: coinData,
                    dailyInfos: coin.daily_infos
                }

                dataset2 = {
                    label: coin.name + ' **performance**',
                    backgroundColor: backgroundColor,
                    borderColor: borderColor,
                    data: coinPerformanceData
                }

                datasets.push(dataset)
                coinData = [];

                datasets2.push(dataset2)
                coinPerformanceData = [];
            }

            const chartData = {
                labels: labels,
                datasets: datasets
            };

            const chartDataPerf = {
                labels: labels,
                datasets: datasets2
            }

            // hier vielleicht noch die Punkteanzahl begrenzen
            const config = {
                type: 'line',
                data: chartData,
                options: {
                    //https://www.chartjs.org/docs/latest/configuration/tooltip.html#tooltip-callbacks
                    plugins: {
                        title: {
                            display: true,
                            text: "Value"
                        },
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
                                labelTextColor: function (context) {
                                    //könnte man vllt in eine Funktion auslagern
                                    let performanceInPercent = (context.raw / context.dataset.data[0] - 1) * 100;
                                    if (performanceInPercent >= 0) {return '#0F0';}
                                    return '#FF3131';
                                },
                                afterLabel: function(context) {
                                    //könnte man vllt in eine Funktion auslagern
                                    let performanceInPercent = (context.raw / context.dataset.data[0] - 1) * 100;
                                    performanceInPercent = performanceInPercent.toPrecision(3)
                                    if (performanceInPercent > 0) {
                                        performanceInPercent = "+" + performanceInPercent;
                                    }
                                    performanceInPercent += "%";


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
                                        'Transactions: ' + new Intl.NumberFormat('de-DE').format(transactions) + "\n" +
                                        'Performance since ' + labels[0] + ': ' + performanceInPercent;
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


            const config2 = {
                type: 'line',
                data: chartDataPerf,
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: "Performance"
                        }
                    },
                    //https://github.com/chartjs/Chart.js/discussions/9828
                    interaction: {
                        mode: 'nearest',
                        axis: 'x',
                        intersect: false
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


            pricesChart = new Chart(
                document.getElementById('pricesChart'),
                config
            );

            relationChart = new Chart(
                document.getElementById('relationChart'),
                config2
            );

        }
    }

    //coinspinner
    const coinSpinner = document.getElementById("coin-spinner")
    const hoverElement = document.getElementById("hover-element")
    let timerSet;

    function timer() {
        timerSet = setTimeout( () => {
            coinSpinner.classList.remove("spin")
        }, 24150)
    }

    timer();

    hoverElement.addEventListener("mouseup", () => {

        if (coinSpinner.classList.contains("spin")) {
            coinSpinner.classList.remove("spin")
            clearTimeout(timerSet)
        }

        timer();

        setTimeout( () => {
            coinSpinner.classList.add("spin")
            coinSpinner.classList.remove("getUp", "fall")
        }, 0)
    })


    hoverElement.addEventListener("mouseover", () => {
        if (!coinSpinner.classList.contains("spin")) {
            coinSpinner.classList.remove("fall")
            coinSpinner.classList.add("getUp")
        }
    })

    hoverElement.addEventListener("mouseleave", () => {
        coinSpinner.classList.remove("getUp")
        coinSpinner.classList.add("fall")
        if (coinSpinner.classList.contains("spin")) {
            coinSpinner.classList.remove("fall")
        }
    })
})