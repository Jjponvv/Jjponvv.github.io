const base_url =' https://lldev.thespacedevs.com/2.2.0/launch/'

let now = new Date();
let month = new Date();
month.setMonth(now.getMonth()-1);


let time = `net__gte=${month.toISOString()}&net__lte=${now.toISOString()}`

const mode = 'mode=list';
const format = 'format=json';
const ordering = 'ordering=net';

let query_url = base_url + '?' + '&'+time + '&' + mode + '&' + ordering + '&' + format;

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
        let video_link = '';

        if(item['status']['name'] == 'Success'){
            image = '../images/Terminated.png';
        } else {
            image = '../images/Launch.png';
        }

        if(item['links'] != null){
            video_link = item['links']['video_link']
        } else {
            video_link = '#';
        }

        htmlContent += `<section class="content">
            <div class="sort">
                <p id="name">${item['name']}</p>
                <p id="name">:</p>
                <p id="time">${date.toLocaleString()}</p>
                <button onclick="location.href='${video_link}'">Track</button>
                <img src="${image}" alt="status">
            </div>
        </section>`
        
    });

    document.getElementById('main').innerHTML = htmlContent

}

fetchData()
