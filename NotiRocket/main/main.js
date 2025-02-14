const base_url =' https://lldev.thespacedevs.com/2.3.0/launches/'

let now = new Date();
let month = new Date();
month.setMonth(now.getMonth()-1);
const resetTime = (date) => new Date(date.setHours(0, 0, 0, 0));


let time = `net__gte=${month.toISOString()}&net__lte=${now.toISOString()}`

const mode = 'mode=list';
const format = 'format=json';
const ordering = 'ordering=last_updated';
const limit = 'limit=2'

let query_url = base_url + '?' + '&'+time + '&' + mode + '&' + ordering + '&' + format + '&' + limit;

console.log(query_url);

async function get_results(query_url = String){
    let responce = await fetch(query_url);

    if(responce.status != 200){
        return null
    }

    let data = await responce.json()
    return data
}

async function fetchData(){
    let results = await get_results(query_url);

    let allResults = results['results'] || [];
    
    let next_url = results['next']
    while(next_url){
        let next_results = await get_results(next_url);

        if (next_results === null){
            break
        }


        allResults = allResults.concat(next_results['results']);

        next_url = await next_results['next']
    }

    let htmlContent = '';

    allResults.forEach(item => {

        let date = new Date(item['window_start']);
        let image = '';
        let moment_ago = new Date(now);
        moment_ago = moment_ago.setHours(moment_ago.getHours()-2);

        if(item['status']['name'] == 'Success'){
            image = '../images/Terminated.png';
        } else {
            image = '../images/Launch.png';
        }


        htmlContent += `<section class="content">
            <div class="sort">
                <p id="name">${item['name']}</p>
                <p id="name">:</p>
                <p id="time">${date.toLocaleString()}</p>
                <button onclick="(function() { collect('${now}', '${item['name']}'); })()">Collect</button>
                <img src="${image}" alt="${item['status']['name']}">
            </div>
        </section>`;
    });

    document.getElementById('main').innerHTML = htmlContent;

}

function collect(time, thing)
{
    const now = new Date();
    const time_ = new Date(time);

    if(now.getDate() == time_.getDate())
    {
        if(now.getHours() >= (time_.getHours() - 3) && now.getHours() <= (time_.getHours() + 3))
        {
            console.log(`Collected ${thing}`);
            if(localStorage.getItem("achivements") != null)
            {
                localStorage.setItem("achivements", localStorage.getItem("achivements")+JSON.stringify({"name":thing, "time":time}))
            } else {
                localStorage.setItem("achivements", JSON.stringify({"name":thing, "time":time}))
            }
            console.log(localStorage.achivements);
        } else {
            console.log('its today but the event has ended or has not yet started', thing)
        }
    } else{
        console.log('The event has ended or has not yet started', thing);
    }
}

fetchData();
