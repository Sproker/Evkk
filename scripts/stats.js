// global variables
let selectedKorpus = []; // every selected korpus
let knames = []; // every selected korpus name
let filter = document.querySelector("#filterBy").value; // current filter
const helpToggle = document.getElementById('help-toggle');

// On page load
$(document).ready(async function () {
    // initial fetchers on page load, to display stats
    // main stats
    updateKorpusCheckboxes();
    // await fetchAll();
    await fetchMiniStats();

    // event listeners
    document.querySelectorAll('input[name=korpus]')
        .forEach(el => el
            .addEventListener('click', updateKorpusCheckboxes));
    document.querySelector("#selectAllKorpus").addEventListener("click", selectKorpus);
    document.querySelector("#unselectAllKorpus").addEventListener("click", deselectKorpus);
    document.querySelector("#filterBy").addEventListener("change", updateFilter);
    helpToggle.addEventListener('click', show); 
});

function show(){
    if(helpToggle.innerText == ('Kuva abi')){
        helpToggle.innerText = 'Peida abi';
        $("#selectAllKorpus").attr({"aria-label":"Valib kõik korpused", "data-balloon-pos":"up", "class":"tooltip-green"})
        $("#unselectAllKorpus").attr({"aria-label":"Eemaldab kõik korpused", "data-balloon-pos":"up", "class":"tooltip-green"})
        $("#documents2").attr({"aria-label":"Dokumentide koguarv", "data-balloon-pos":"up", "class":"tooltip-green"})
        $("#korpusSelection").attr({"aria-label":"Korpused on töödeldud tekstide kogumid, mis on grupeeritud mingite kindlate kategooriate järgi.", "data-balloon-pos":"right", "class":"tooltip-green"})
        $("#words2").attr({"aria-label":"Sõnade kogu arv", "data-balloon-pos":"up", "class":"tooltip-green"})
        $("#sentences2").attr({"aria-label":"Lausete kogu arv", "data-balloon-pos":"up", "class":"tooltip-green"})
        $("#filterlife").attr({"aria-label":"Siin saab täpsustada otsingut", "data-balloon-pos":"right", "class":"tooltip-green"})
       
           
    } else {
        helpToggle.innerText = 'Kuva abi';
        $("#selectAllKorpus").removeAttr('aria-label data-balloon-pos class')
        $("#unselectAllKorpus").removeAttr('aria-label data-balloon-pos class')
        $("#documents2").removeAttr('aria-label data-balloon-pos class')
        $("#korpusSelection").removeAttr('aria-label data-balloon-pos class')
        $("#words2").removeAttr('aria-label data-balloon-pos class')
        $("#sentences2").removeAttr('aria-label data-balloon-pos class')
        $("#filterlife").removeAttr('aria-label data-balloon-pos class')
        
    }
}

function readfilter2fromDB(selectionimistasaab){         
    document.getElementById('SecondFilterSelection').innerHTML="";
    console.log('olenpede');
    var x = document.getElementById("filters");
    let list1=['Tundmatu', 'Ei', 'Ja'];
    let list2=['Tundmatu', 'Mees', 'Naine'];
    let muutuja = [];
    
    if(selectionimistasaab =='sugu'){
        muutuja = list2;
        x.style.display = "block";
    }
    else if(selectionimistasaab =='abivahendid'){
        muutuja = list1;
        x.style.display = "block";
    }
    else{
        x.style.display = "none";
    }
    console.log(selectionimistasaab);
    var docFrag = document.createDocumentFragment();

    for(var x = 0; x < muutuja.length; x++){
        var button = document.createElement('input');
        button.setAttribute('type', 'checkbox');
        button.setAttribute('name', selectionimistasaab);
        button.setAttribute('value', muutuja[x]);
        button.setAttribute('class', 'btn-check');
        button.setAttribute('id', ("btn-check22"+x));
        button.setAttribute('autocomplete', 'off');
        button.setAttribute('checked', '');

        docFrag.appendChild(button);

        var button2 = document.createElement('label');
        button2.setAttribute('class', 'checkbox');
        button2.setAttribute('for', ("btn-check22"+x));
        var button3 = document.createElement('i');
        button3.setAttribute('class', 'fas fa-check');

        button2.appendChild(button3);

        var button4 = document.createElement('span');
        button4.innerHTML = muutuja[x];
        button2.appendChild(button4);

        docFrag.appendChild(button2);

    }
    
    document.getElementById('SecondFilterSelection').appendChild(docFrag); 
    document.querySelectorAll('input[name='+selectionimistasaab+']')
        .forEach(el => el
            .addEventListener('click', updateFilter2Checkboxes));
    console.log("kuulan");

    document.querySelector("#selectAllChoices").addEventListener("click", selectFilter2Checkboxes);
    document.querySelector("#unselectAllChoices").addEventListener("click", deselectFilter2Checkboxes);

}

async function updateFilter2Checkboxes() {
    filter = document.querySelector("#filterBy").value;
    let checkboxes = document.querySelectorAll('input[name='+filter+']:checked');
    let allCheckboxes = document.querySelectorAll('input[name='+filter+']');
    for (let i = 0; i < allCheckboxes.length; i++) {
        let next = allCheckboxes[i].nextElementSibling.firstChild;
        next.classList.add("hidden");
    }
    if (checkboxes.length == 0) {
        for (i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = true;
            let next = checkboxes[i].nextElementSibling.firstChild;
            next.classList.remove("hidden");
        }
    } else {
        for (let i = 0; i < checkboxes.length; i++) {
            let next = checkboxes[i].nextElementSibling.firstChild;
            next.classList.remove("hidden");
        }
    }

}

// Checkbox style manipulation (checks everything), then fetches all stats
async function selectFilter2Checkboxes() {
    filter = document.querySelector("#filterBy").value;
    let checkboxes = document.querySelectorAll('input[name='+filter+']');
    for (i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = true;
        let next = checkboxes[i].nextElementSibling.firstChild;
        next.classList.remove("hidden");
        next.classList.remove("add");
        console.log("added " + next);
    }
}

// Checkbox style manipulation (unchecks everything)
function deselectFilter2Checkboxes() {
    let checkboxes = document.querySelectorAll('input[name='+filter+']');
    for (i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
        let next = checkboxes[i].nextElementSibling.firstChild;
        next.classList.add("hidden");
        console.log("removed " + next);

    }

}

// AJAX for fetching mini stats
async function fetchMiniStats() {
    filter = document.querySelector("#filterBy").value;
    let result;
    try {
        result = await $.ajax({
            url: "/api/texts/getMiniStats",
            type: "GET",
            data: { corpus: selectedKorpus.join() },
        });
        console.log("ministats " + result)
        console.log("AJAX: Fetching selected korpus mini stats... " + JSON.stringify(result));
        loadMiniStats(JSON.parse(result));
    } catch (error) {
        console.error(error);
        console.log("ministats FAIL" + result)
    }
}

// Loading the mini stats
function loadMiniStats(results) {
    document.querySelector("#documents").innerHTML = numberWithCommas(results[0].sum);
    document.querySelector("#sentences").innerHTML = numberWithCommas(results[0].lauseid);
    document.querySelector("#words").innerHTML = numberWithCommas(results[0].sonu);
}

// Number beautifier. For example: '123456789' into '123,456,789'
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// updates the stats title, beautifies them, then executes checkbox updater
function updateFilter() {
    filter = document.querySelector("#filterBy").value;
    readfilter2fromDB(filter);
    let beautify;
    switch (filter) {
        case "vanus":
            beautify = "vanuse";
            break;
        case "haridus":
            beautify = "hariduse";
            break;
        case "sugu":
            beautify = "soo";
            break;
        case "elukoht":
            beautify = "elukoha";
            break;
        case "kodukeel":
            beautify = "kodukeele";
            break;
        case "emakeel":
            beautify = "emakeele";
            break;
        case "tekstikeel":
            beautify = "tekstikeele";
            break;
        case "abivahendid":
            beautify = "abivahendite";
            break;
        case "taust":
            beautify = "sotsiaalse tausta";
            break;
        case "keeletase":
            beautify = "keeletaseme";
            break;
        case "tekstikeel":
            beautify = "tekstikeele";
            break;
        case "tekstityyp":
            beautify = "tekstitüübi";
            break;
    }
    document.querySelector(".stats h2").innerHTML = `Tekstid ${beautify} järgi`;
    updateKorpusCheckboxes();
}

// Checkbox style manipulation (checks everything), then fetches all stats
async function selectKorpus() {
    let checkboxes = document.querySelectorAll('input[name=korpus]');
    for (i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = true;
        let next = checkboxes[i].nextElementSibling.firstChild;
        next.classList.remove("hidden");
        next.classList.remove("add");
        console.log("added " + next);
    }
    await updateKorpusCheckboxes();
    await fetchMiniStats();
    var y = document.getElementById('alamkorpused');
    y.style.display = "block";
}

// Checkbox style manipulation (unchecks everything)
function deselectKorpus() {
    let checkboxes = document.querySelectorAll('input[name=korpus]');
    for (i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
        let next = checkboxes[i].nextElementSibling.firstChild;
        next.classList.add("hidden");
        console.log("removed " + next);
    }
    var y = document.getElementById('alamkorpused');
    y.style.display = "none";
}

// Collects every selected korpus checkbox, styles them and then fetches appropriate stats
async function updateKorpusCheckboxes() {
    filter = document.querySelector("#filterBy").value;
    selectedKorpus = [];
    let checkboxes = document.querySelectorAll('input[name=korpus]:checked');
    let allCheckboxes = document.querySelectorAll('input[name=korpus]');
    for (let i = 0; i < allCheckboxes.length; i++) {
        let next = allCheckboxes[i].nextElementSibling.firstChild;
        next.classList.add("hidden");
    }
    if (checkboxes.length == 0) {
        knames = [];
        for (i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = true;
            let next = checkboxes[i].nextElementSibling.firstChild;
            next.classList.remove("hidden");
        }
        //get data for all
        await fetchSome();
    } else {
        for (let i = 0; i < checkboxes.length; i++) {
            selectedKorpus.push(checkboxes[i].defaultValue);
            let next = checkboxes[i].nextElementSibling.firstChild;
            next.classList.remove("hidden");
        }
        // knames = await fetchKorpusNames(selectedKorpus);
        await fetchSome();
    }
    await fetchMiniStats();
    var y = document.getElementById('alamkorpused');
    y.style.display = "block";
}

// AJAX for fetching data from SELECTED korpuses
async function fetchSome() {
    console.log(selectedKorpus.join())
    console.log(selectedKorpus)
    let result;
    try {
        result = await $.ajax({
            url: "/api/texts/getDetailedValues",
            type: "GET",
            data: { corpus: selectedKorpus.join(), pName: filter},
            // dataType: 'JSON'
        });
        loadStats(JSON.parse(result));
        console.log("ajax successful, parsed data: " + result)
    } catch (error) {
        console.error(error);
    }
}

// AJAX for fetching data for the pie chart
async function fetchLanguagePercentage() {
    let result;
    try {
        result = await $.ajax({
            url: "db/server.php",
            type: "POST",
            data: { fetchLanguagePercentage: true },
            dataType: 'JSON',
        });
        return result;
    } catch (error) {
        console.error(error);
    }
}

// Echarts code
function loadStats(data) {
    let ages = []
    let filterData = data;

    // filter gained data
    filterData.forEach((e) => {
        if (e.value == "") {
            ages.push("TUNDMATU");
        } else {
            ages.push(e.value
                .replace(/y/g, "ü")
                .toUpperCase());
        }
    });

    // set categories for chart
    let percent = [];
    let texts = [];
    let words = [];
    let sentences = [];
    let errors = [];
    let errorTypes = [];
    filterData.forEach((e) => {
        percent.push(parseFloat(e.protsent).toFixed(2));
        texts.push(e.tekste);
        words.push(e.sonu);
        sentences.push(e.lauseid);
        errors.push(e.vigu);
        errorTypes.push(e.veatyype);
    });

    // initialize chart
    let chartDom = document.getElementById('alamkorpused');
    let myChart = echarts.init(chartDom);
    let option;

    // colors
    let colors = ['#5470C6', '#0e6e21', '#EE6666', '#411561',
        '#61154a', '#8a3c0c'];

    // responsive width
    $(window).on('resize', function () {
        myChart.resize();
    });

    // chart settings
    option = {
        color: colors,

        title: {
            text: "Keelekorpus",
            show: false
        },
        calculatable: true,

        tooltip: {
        },
        grid: {
            containLabel: true,
            width: "auto",
        },
        toolbox: {
            show: true,
            left: "center",
            bottom: "bottom",
            color: '#333',
            itemSize: 30,
            itemGap: 35,
            feature: {
                dataView: { show: true, readOnly: true, title: "Andmed" },
                saveAsImage: { show: true, title: "Laadi alla", color: "red" },
                magicType: {
                    show: true,
                    type: ['line', 'bar'],
                },
            }
        },
        legend: {
            data: ['Protsent', 'Tekste', 'Sõnu', 'Lauseid', 'Vigu'],
            selected: {
                'Protsent': true, 'Tekste': false, 'Sõnu': false,
                'Lauseid': false, 'Vigu': false, 'Veatüüpe': false
            },
        },
        xAxis: [
            {
                type: 'category',
                axisTick: {
                    alignWithLabel: true
                },
                data: ages,
                axisLabel: {
                    color: '#333',
                    interval: 0,
                    rotate: 45,
                },
                axisPointer: {
                    type: 'shadow'
                }
            }
        ],
        yAxis: [
            {
                //show: false,
                type: 'value',
                name: '',
                
                position: 'right',
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: colors[1],
                        fontSize: 18
                    }
                },
                axisLabel: {
                    show: false,
                    //containLabel: true,
                    formatter: ''
                }
            },
            {
                //show: false,
                type: 'value',
                name: '',
                
                position: 'right',
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: colors[1],
                        fontSize: 18
                    }
                },
                axisLabel: {
                    show: false,
                    //containLabel: true,
                    formatter: ''
                }
            },
            {
                //show: false,
                type: 'value',
                name: '',
                
                position: 'right',
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: colors[1],
                        fontSize: 18
                    }
                },
                axisLabel: {
                    show: false,
                    //containLabel: true,
                    formatter: ''
                }
            },
            {
                //show: false,
                type: 'value',
                name: '',
                
                position: 'right',
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: colors[1],
                        fontSize: 18
                    }
                },
                axisLabel: {
                    show: false,
                    //containLabel: true,
                    formatter: ''
                }
            },
            {
                //show: false,
                type: 'value',
                name: '',
                
                position: 'right',
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: colors[1],
                        fontSize: 18
                    }
                },
                axisLabel: {
                    show: false,
                    //containLabel: true,
                    formatter: ''
                }
            },
            {
                //show: false,
                type: 'value',
                name: '',
                
                position: 'right',
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: colors[1],
                        fontSize: 18
                    }
                },
                axisLabel: {
                    show: false,
                    //containLabel: true,
                    formatter: ''
                }
            }
        ],
        series: [
            {
                name: 'Protsent',
                type: 'bar',
                data: percent,
            },
            {
                name: 'Tekste',
                type: 'bar',
                yAxisIndex: 1,
                data: texts
            },
            {
                name: 'Sõnu',
                type: 'bar',
                yAxisIndex: 2,
                data: words
            },
            {
                name: 'Lauseid',
                type: 'bar',
                yAxisIndex: 3,
                data: sentences
            },
            {
                name: 'Vigu',
                type: 'bar',
                yAxisIndex: 4,
                data: errors
            },
            {
                name: 'Veatüüpe',
                type: 'bar',
                yAxisIndex: 5,
                data: errorTypes
            }
        ]
    };
    option && myChart.setOption(option);
}
