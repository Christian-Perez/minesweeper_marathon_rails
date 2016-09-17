var board = document.getElementById('board')
var boardRows = 10;
var boardColumns = 10;
var numOfBombs = 15;
var numOfNonBombs = (boardRows * boardColumns) - numOfBombs
var tilesLeftCounter // used by makeBoard() & clearZeroTiles()
var stopwatchSeconds = 0;
var highScoreSeconds = 0;
var stopwatch;

function randomTileAxisNum(){
  // * has to adapt to different board sizes
  var num = Math.floor( (Math.random() * 10 ) )
  return num
}//randomNum()

function makeTileIdStr(row, col){ // max board size 100x
  function makeAxisStr(num){

    if(num < 10){
      return ( '0' + num )
    }else{
      return ( '' + num )
    }
  } // makeAxisStr(num)
  return makeAxisStr(row) + makeAxisStr(col)
} // makeTileIdStr(row, col)

function traverseTiles(tileIdStr, directionStr){
  // define path directions
  var shift = {
    up: [-1, 0],
    down: [1, 0],
    left: [0, -1],
    right: [0, 1],
    // not tested ..
    ul: [-1, -1],
    ur: [-1, 1],
    dl: [1, -1],
    dr: [1, 1]
  }

  // start at titleIdStr
  var targetRowNum = parseInt(tileIdStr.slice(0, 2))
  var targetColNum = parseInt(tileIdStr.slice(2))

  //shift tile focus
  targetRowNum += shift[directionStr][0]
  targetColNum += shift[directionStr][1]

  return makeTileIdStr(targetRowNum, targetColNum)
} // traverseTile(tileIdStr, directionStr)

function isBomb(tileDOM){
  if( tileDOM.html() == -1 ){
    return true
  } else {
    return false
  }
}

function triggerTileById(tileIdStr){
 if( !$('#' + tileIdStr).hasClass('clicked')){
  $('#' + tileIdStr).addClass('clicked')
  $('#' + tileIdStr).removeClass('tile-hidden')
  $('#' + tileIdStr).addClass('tile-' + parseInt($('#' + tileIdStr).html()) )
  --tilesLeftCounter
  $('#tilesLeftCounter').text(tilesLeftCounter)
  }
} // triggerTileById

function clearZeroTiles(zeroTileIdStr){
  /// clears all adjacent tiles that are 'zeroTiles' including tiles touching diagonally
  var path = ['up', 'ur', 'right', 'dr', 'down', 'dl', 'left', 'ul']
  var zeroTilesArr = [zeroTileIdStr]
  // for every zero tile that is found..
  for(var t = 0; t < zeroTilesArr.length; t++){
    triggerTileById(zeroTilesArr[t])
    // look at all adjacent tiles
    for (var d = 0; d < path.length; d++){
      var targetTileId = traverseTiles(zeroTilesArr[t], path[d])
      var $targetTile = $('#' + targetTileId)
      if( $targetTile.html() == '0' && !$targetTile.hasClass('clicked')){
        triggerTileById(targetTileId)
        zeroTilesArr.push(targetTileId)
      }
      if( parseInt( $targetTile.html() ) > 0 && !$targetTile.hasClass('clicked')){
        triggerTileById(targetTileId)
      }
    } // for(path.length)
  } // for zeroTilesAr.length
} // clearZeroTiles(zeroTileIdStr)

function timer(string){
  switch(string){
    case 'start':
      stopwatch = setInterval(function(){ tick() }, 1000);
      break;
    case 'stop':
      clearInterval(stopwatch);
      break;
    case 'reset':
      stopwatchSeconds = 0;
      $('#current-timer').html(stopwatchSeconds)
      break;
  } // switch
} // timer(string)

function formatNum(num){
  if(num < 10){
    return ( '0' + num )
  }else{
    return ( '' + num )
  }
}

function tick(){
  ++stopwatchSeconds

    var minutes = formatNum( Math.floor(stopwatchSeconds / 60) )
    var seconds = formatNum( stopwatchSeconds % 60 )
    $('#current-timer').html(minutes + ':' + seconds)
  }

function setRecord(){
  if (stopwatchSeconds > highScoreSeconds){
    console.log('highScoreSeconds > stopwatchSeconds')
    highScoreSeconds = stopwatchSeconds
  }
  var minutes = formatNum( Math.floor(highScoreSeconds / 60) )
  var seconds = formatNum( highScoreSeconds % 60 )
  $('#record-timer').html(minutes + ':' + seconds)
  console.log('setting Record ')
}

function makeBoard(){
  // create elements above game board
  $('<div>', {class: 'timer', id: 'current-timer', text: '00:00'}).appendTo('#board')
  $('<div>', {id: 'tile-counter',
    html: '<span id="tilesLeftCounter">' + numOfNonBombs + '</span><span> / </span><span id="flagsLeftCounter">' + numOfBombs + '</span>'
  }).appendTo('#board')
  $('<div>', {class: 'timer', id: 'record-timer', text: '00:00'}).appendTo('#board')
  $('<div>', {id: 'reset-btn', text: 'New Game'}).appendTo('#board')
  $('<div>', {id: 'toggle-flag-btn', text: 'Toggle Flag'}).appendTo('#board')

  //resetBoard()
  $('#reset-btn').click(function(){
    $('#board').empty()
    makeBoard()
    setRecord()
  })

  // set values of counters
  tilesLeftCounter = numOfNonBombs;
  var flagsLeftCounter = numOfBombs;
  var flagToggle = false


  $('#toggle-flag-btn').click(function(){
    // change click behavior if toggle-flag-btn has been clicked
    flagToggle == true ? flagToggle = false : flagToggle = true
    if( $('#toggle-flag-btn').hasClass( 'flagged' ) ){
      $('#toggle-flag-btn').removeClass('flagged')
      $('#toggle-flag-btn').css('background-color', 'rgb(90, 180, 210)')
    } else {
      $('#toggle-flag-btn').addClass('flagged')
      $('#toggle-flag-btn').css('background-color', 'rgb(50, 50, 50)')
    }
  }) // click( #toggle-flag-btn )

  for(var row = 0; row < boardRows; row++){ // ROW
    $('<div>', { id: ('row' + row), class: 'row' }).appendTo('#board');
    for(var col = 0; col < boardColumns; col++){ // COLUMN
      var $divTile = $('<div>', { class: 'tile tile-hidden', id: makeTileIdStr(row, col), text: 0 } );
  /// FOR EVERY TILE ON THE BOARD...
        $divTile.click(function(){
          /// is flag-toggle active?

          if(flagToggle){
            if( $(this).hasClass('flagged') ){
              $(this).removeClass('flagged')
              flagsLeftCounter++

            } else {
              $(this).addClass('flagged')
              flagsLeftCounter--
            }

            $('#flagsLeftCounter').html(flagsLeftCounter)

            ///
          } else if( !$(this).hasClass('flagged') ){
            // is bomb

            if( $(this).html() == '-1' ){
              $(this).addClass('tile-bomb')
              $(this).removeClass('tile-hidden')
              timer('stop')

              if(stopwatchSeconds > highScoreSeconds){setRecord()}
              alert( 'tile ' + $(this).attr('id') + ' is a bomb, you lose')
              stopwatchSeconds = 0

            } else if($(this).hasClass('clicked') ){
              alert('This tile has already been selected, select another.')

            } else if( $(this).html() == '0' ){
              clearZeroTiles( $(this).attr('id') )

            } else { // is num between 1 & 8
              console.log($(this).attr('id'))
              triggerTileById( $(this).attr('id') )

              if(tilesLeftCounter < 1){
                alert('you won! yay!!')
                timer('stop')
              }
            } // else // is num between 1 & 8
          } else {// if( !flagToggle ).. the tile IS flagged
            alert('this tile is protected, toggle the flag selector and select this tile to disable protection')
          }
        }) // $divTile.click
        $divTile.appendTo('#row' + row);
    } // forEach( column )
  } // forEach( row )

  /// MAKE ARRAY OF UNIQUE BOMB IDs
  var newBombId = makeTileIdStr( randomTileAxisNum(), randomTileAxisNum() );
  var arrayOfBombs = [newBombId]
  while(arrayOfBombs.length < numOfBombs){
    newBombId = makeTileIdStr( randomTileAxisNum(), randomTileAxisNum() );
    // console.log('newBombId: ' + newBombId)
    if( !arrayOfBombs.includes(newBombId) ){
      arrayOfBombs.push(newBombId)
      // console.log('pushed ' + newBombId)
    }
  } // while(arrayOfBombs.length < numOfBombs)

  /// MAKE BOMBS
  for(var b = 0; b < arrayOfBombs.length; b++){
    makeIntoBomb(arrayOfBombs[b])
  }
  tilesToClear = numOfNonBombs

  timer('start')

} makeBoard()

function makeIntoBomb(tileIdStr){
  /// function concerns self with ONE bomb && recognizes & ignores adjacent bombs
  //make tile at index tileIdStr into bomb
  $('#' + tileIdStr).html('-1')
  // define path to check tiles around bomb
  var path = ['up', 'ur', 'right', 'dr', 'down', 'dl', 'left', 'ul']
  // start of path = @bomb
  var $targetTile = $('#' + tileIdStr)
  for(var d = 0; d < path.length; d++){ // 'd' for direction
    targetTileIdStr = traverseTiles(tileIdStr, path[d])
    $targetTile = $('#' + targetTileIdStr)
    if( !isBomb($targetTile) ){
      $targetTile.html(parseInt($targetTile.html()) + 1)
    }
  } // for( pathThroughTargets )
} // MAKE INTO BOMB ()
