// load video via hls.js
if(Hls.isSupported()) {
  const video = document.getElementById('video');
  var hls = new Hls();
  hls.loadSource('https://h264media01.ly.gov.tw:443/vod_1/_definst_/mp4:1M/8398b1826590a609f29642a92acb28a5a24474907b6cbea146d53a332764a535b7f2b76914fa53475ea18f28b6918d91.mp4/playlist.m3u8');
  hls.attachMedia(video);
}

// Inital DataTables
const table = $('#subtitle-table').DataTable({
  select: true,
  ordering: false,
  scrollCollapse: true,
  scrollY: '200px',
  paging: false,
  fixedHeader: true,
  createdRow: function (row, data, index) {
    $(row).attr('id', 's-' + index);
  },
});

table.rows.add(subtitles).draw(false);
table.columns.adjust().draw();
table.on('select', function (e, dt, type, index) {
  data = table.row(index).data();
  video.currentTime = timeStringToSeconds(data[0]);
  video.play();
  video.focus();
});

// Get and display current time of the video
const text = document.getElementById("text");
video.addEventListener("timeupdate", function(event) {
  text.innerText = this.currentTime;
  //table.row(30).scrollTo();
  //$('#s-28').addClass('table-primary');
});


// H:i:s.u to s
function timeStringToSeconds(timeString) {
    const parts = timeString.split(/[:.]/).map(parseFloat);
    let totalSeconds = 0;

    // Convert hours to seconds
    if (parts.length === 4) {
        totalSeconds += parts[0] * 3600; // 1 hour = 3600 seconds
        totalSeconds += parts[1] * 60;   // 1 minute = 60 seconds
        totalSeconds += parts[2];         // seconds
        totalSeconds += parts[3] / 1000;  // milliseconds
    }
    // Convert minutes to seconds
    else if (parts.length === 3) {
        totalSeconds += parts[0] * 60;   // 1 minute = 60 seconds
        totalSeconds += parts[1];         // seconds
        totalSeconds += parts[2] / 1000;  // milliseconds
    }
    // Only seconds provided
    else if (parts.length === 2) {
        totalSeconds += parts[0];         // seconds
        totalSeconds += parts[1] / 1000;  // milliseconds
    }

    return totalSeconds;
}
