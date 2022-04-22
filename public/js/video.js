
// // 2. This code loads the IFrame Player API code asynchronously.
// var tag = document.createElement('script');

// tag.src = "https://www.youtube.com/iframe_api";
// var firstScriptTag = document.getElementsByTagName('script')[0];
// firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// // 3. This function creates an <iframe> (and YouTube player)
// //    after the API code downloads.
// var player;
// function onYouTubeIframeAPIReady() {
//     player = new YT.Player('player', {
//     height: '390',
//     width: '640',
//     videoId: 'dOy7vPwEtCw',
//     playerVars: {
//         'playsinline': 1,
//         'start':100
//     },
//     events: {
//         'onReady': onPlayerReady,
//         'onStateChange': onPlayerStateChange
//     }
//     });
//     // console.log(player);
//     // player.seekTo(100);
// }

// // 4. The API will call this function when the video player is ready.
// function onPlayerReady(event) {
//     console.log(event);
//     // console.log(time);
//     console.log(event.target.getDuration());
//     event.target.playVideo();
// }

// // 5. The API calls this function when the player's state changes.
// //    The function indicates that when playing a video (state=1),
// //    the player should play for six seconds and then stop.
// var done = false;
// function onPlayerStateChange(event) {
//     // console.log(event.data)
//     if(event.data === 0){
//         done = true;
//         alert("DONE!!!");
//     }
//     if (event.data == YT.PlayerState.PAUSED && !done) {
//         console.log(event.target.getCurrentTime());
//     // setTimeout(stopVideo, 10000);
//     // done = true;
//     }
// }
// function stopVideo() {
//     player.stopVideo();
// }


var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// var playerInfoList = [{
//   id: 'player1',
//   videoId: 'dOy7vPwEtCw'
// }, {
//   id: 'player2',
//   videoId: 'QWtsV50_-p4'
// }, {
//   id: 'player3',
//   videoId: 'y-JqH1M4Ya8'
// }, {
//   id: 'player4',
//   videoId: 'gH7dMBcg-gE'
// }, {
//   id: 'player5',
//   videoId: '7wL9NUZRZ4I'
// }, {
//   id: 'player6',
//   videoId: 'S4R8HTIgHUU'
// }];

// var playerInfoList = "<%= videodata %>"
// var data = "#{videodata}"
// var data = {{{videodata}}}
// console.log(data)
// var scripttag = document.getElementById('scripttag')
// console.log(scripttag.getAttribute('data'))
function onYouTubeIframeAPIReady() {
  if (typeof playerInfoList === 'undefined') return;

  for (var i = 0; i < playerInfoList.length; i++) {
    var curplayer = createPlayer(playerInfoList[i]);
    players[i] = curplayer;
    // console.log(players[i].getDuration)
  }
}

var players = new Array();

function createPlayer(playerInfo) {
    return new YT.Player(playerInfo.id,{
        height: '390',
        width: '640',
        videoId: playerInfo.videoId,
        playerVars: {
            'showinfo': 0,
            'playsinline': 1,
            'start': playerInfo.time || 0
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
        }); 
    }

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    console.log(event);
    console.log(event.target.getDuration());
    event.target.seekTo(parseFloat(0)).playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
    // console.log(event.data)
    if(event.data === 0){
        done = true;
        alert("DONE!!!");
    }
    if (event.data == YT.PlayerState.PAUSED && !done) {
        console.log(event.target.getCurrentTime());
    // setTimeout(stopVideo, 10000);
    // done = true;
    }
}
function stopVideo() {
    player.stopVideo();
}

// $('#stop').click(function () {
//   players.forEach(function (el) {
//     el.stopVideo();
//   });
// });