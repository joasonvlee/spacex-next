// Fetch json data from the SpaceX REST API
fetch('https://api.spacexdata.com/v2/launches/upcoming')
    .then(response => response.json()
        .then(data => startTimer(data) ({data: data, status: response.status})));

const startTimer = (data) => {
    const timer = document.getElementById('timer');
    let dataDate = JSON.stringify(data[0].launch_date_utc);

    if(dataDate != null) {
        const launchTime = (+dataDate.substring(12, 14) + 2) + ':' + dataDate.substring(15, 17) + ':' + dataDate.substring(18, 20);
        let launchDate = new Date(dataDate.substring(6, 8) + ' ' + dataDate.substring(9, 11) + ', ' + dataDate.substring(1, 5) + ' ' + launchTime).getTime();

        // Start an interval updating the timer
        const interval = setInterval(() => {
            const now = new Date().getTime(),
                distance = launchDate - now;

            document.getElementById('time-days').innerText = Math.floor(distance / (1000 * 60 * 60 * 24));
            document.getElementById('time-hours').innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            document.getElementById('time-minutes').innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            document.getElementById('time-seconds').innerText = Math.floor((distance % (1000 * 60)) / 1000);

            if (distance < 0) {
                clearInterval(interval);

                timer.innerText = 'TBD';
            }
        }, 1000);
    } else {
        timer.innerText = 'TBD';
    }

    showLaunchInfo(data);
};

const showLaunchInfo = (data) => {
    const rocketName = data[0].rocket.rocket_name,
        siteName = data[0].launch_site.site_name,
        payloadId = data[0].rocket.second_stage.payloads[0].payload_id,
        payloadType = data[0].rocket.second_stage.payloads[0].payload_type.toLowerCase();

    // Show some text information about the launch
    document.getElementById('info-title').innerText = data[0].mission_name;
    document.getElementById('info-secondary-title').innerText = 'A ' + rocketName + ' rocket will launch from launch site ' + siteName
        + ' with the ' + payloadId + ' ' + payloadType + ' as its payload.';
};