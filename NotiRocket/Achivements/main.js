


function addAchivement()
{
    let htmlContent = '';
    let achivements = JSON.parse(localStorage.getItem("achivements"));
    achivements.forEach(item => {
        htmlContent += `<section class="content">
            <div class="sort">
                <!-- <img src="#" alt="icon"> -->
                <p id="name">${item["name"]}</p>
                <p id="time">${item["time"]}</p>
            </div>
        </section>`

        document.getElementById('main').innerHTML = htmlContent;
    })
}

addAchivement();