// Get and display current time of the video
const video = document.getElementById("video");
const text = document.getElementById("text");
video.addEventListener("timeupdate", function(event) {
  text.innerText = this.currentTime;
});

// Inital DataTables
const table = $('#subtitle-table').DataTable({
  ordering: false,
  paging: false,
  scrollCollapse: true,
  scrollY: '200px',
  fixedHeader: true,
  rowCallback: function(row, data, index) {
    $(row).attr('id', 's-' + index);
  }
});

table.rows.add(subtitles).draw(false);
table.columns.adjust().draw();

// Add event listener for each row in table
$("[id^='s-']").on('click', function(event) {
    const startTime = $(this).find('td:first').text();
    video.currentTime = timeStringToSeconds(startTime);
    video.play();
    video.focus();
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
