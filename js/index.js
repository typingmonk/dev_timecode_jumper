// load video via hls.js
if(Hls.isSupported()) {
  const video = document.getElementById('video');
  var hls = new Hls();
  hls.loadSource('https://h264media01.ly.gov.tw:443/vod_1/_definst_/mp4:1M/8398b1826590a609f29642a92acb28a5ad9f551ce5fa921f46d53a332764a535d0f764607afe74625ea18f28b6918d91.mp4/playlist.m3u8');
  //hls.loadSource('https://ivod-lyvod.cdn.hinet.net/vod_1/_definst_/mp4:1MClips/b530b79967bb1991daa355bfc86416df0cad809fe5ec353a5d4d239a786f802f1a911ee759332f825ea18f28b6918d91.mp4/playlist.m3u8');
  hls.attachMedia(video);
}

// Inital DataTables
const table = $('#subtitle-table').DataTable({
  select: 'single',
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
timeCache = 0;
d_g = $('#s-0').offset().top;
video.addEventListener("timeupdate", function(event) {
  time = this.currentTime;
  text.innerText = time;
  if (Math.abs(timeCache - time) < 0.5) {
    return;
  }
  timeCache = time;
  desiredIndex = timecodeBinarySearch(subtitles, time);
  if (desiredIndex == -1) {
    return;
  }
  desiredTr = $('#s-' + desiredIndex);
  selectedTr = $('tr.selected');
  if (desiredTr.is(selectedTr)) {
    return;
  }
  if (selectedTr.length > 0) {
    selectedTr.removeClass('selected');
  }
  desiredTr.addClass('selected');
  scroll_pos = $('.dt-scroll-body').scrollTop();
  d_x = desiredTr.offset().top;
  $('.dt-scroll-body').scrollTop(scroll_pos + d_x - d_g);
});

function timecodeBinarySearch(subtitles, time) {
  left = 0;
  right = subtitles.length;
  middle = Math.floor((left + right)/2);
  result = compareTimeCode(subtitles[middle], time);
  cnt = 0
  while (left <= right && ! (left == right && right == left)) {
    if (left == right && middle == right) {
      break;
    }
    if (right - left == 1) {
      isLeft = (compareTimeCode(subtitles[left], time) == 1) ? true :  false;
      isRight = (compareTimeCode(subtitles[right], time) == 1) ? true :  false;
      if (! isLeft && ! isRight) {
        break;
      }
    }
    middle = Math.floor((left + right)/2);
    result = compareTimeCode(subtitles[middle], time);
    if (cnt > 2000) {
      break;
    }
    if (result === 0) {
      right = middle;
    } else if (result === 2) {
      left = middle;
    } else {
      return middle;
    }
    cnt++;
  }
  return -1;
}

function compareTimeCode(data, desiredTime) {
  startTime = timeStringToSeconds(data[0]);
  endTime = timeStringToSeconds(data[1]);
  if (startTime > desiredTime) {
    return 0;
  }
  if (desiredTime > endTime) {
    return 2;
  }
  return 1;
}

// H:i:s.u to s
function timeStringToSeconds(timeString) {
    const parts = timeString.split(/[:,]/).map(parseFloat);
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
