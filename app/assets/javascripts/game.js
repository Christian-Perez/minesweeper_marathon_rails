var board = document.getElementById('board'),
    startRows = 3,
    startColumns = 3,
    startStopwatchSeconds = 10,
    boardRows = 3,
    boardColumns = 3,
    numOfBombs = 1,
    numOfNonBombs = (boardRows * boardColumns) - numOfBombs,
    tilesLeftCounter, // used by makeBoard() & clearZeroTiles()
    stopwatchSeconds = 10,
    highScoreSeconds = 60,
    stopwatch

function randomTileAxisNum(axis){
  // axis = 'col' or 'row'
  var num
  axis == 'col' ? num = Math.floor( (Math.random() *boardColumns ) ) : num = Math.floor( (Math.random() *boardRows ) )
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
      stopwatchSeconds = stopwatchSeconds;
      $('#current-timer').html(stopwatchSeconds)
      clearInterval(stopwatch);
      break;
  } // switch
} // timer(string)

function formatTime(num){
  if(num < 10){
    return ( '0' + num )
  }else{
    return ( '' + num )
  }
}

function tick(){
  console.log('tick: >> stopwatchSeconds: ', stopwatchSeconds)
  --stopwatchSeconds
    var minutes = formatTime( Math.floor(stopwatchSeconds / 60) )
    var seconds = formatTime( stopwatchSeconds % 60 )
    $('#current-timer').html(minutes + ':' + seconds)
    checkForWin()
  }

function setRecord(){
  if (stopwatchSeconds <
    highScoreSeconds){
    highScoreSeconds = stopwatchSeconds
    console.log('setting high score to ' + highScoreSeconds)
  }
  var minutes = formatTime( Math.floor(highScoreSeconds / 60) )
  var seconds = formatTime( highScoreSeconds % 60 )
  $('#record-timer').html(minutes + ':' + seconds)
  console.log('setting Record ')
}

$('#startGameButton').click(function(){
  $('#board').empty()
  makeBoard()
})

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

function checkForWin(){
  if(tilesLeftCounter < 1){
    alert('you won! yay!!')
    $(this).css('background-color', 'green')
    // timer('stop')
    stopwatchSeconds += 10
    boardColumns++
    boardRows++
    numOfBombs += 3
    numOfNonBombs = (boardRows * boardColumns) - numOfBombs
//TODO disable clicking aditional tiles && make a newGame Btn into Continue Btn >> start timer again at new board
    resetBoard()
  }
  if(stopwatchSeconds < 0){
    gameOver()
  }
} // checkForWin()

function gameOver(){
  alert('GAME OVER')
  boardRows = startRows
  boardColumns = startColumns
  stopwatchSeconds = startStopwatchSeconds
  resetBoard()
}

function resetBoard(){
  $('#board').empty()
  timer('stop')
  timer('reset')
  makeBoard()
  // setRecord()
}

function makeBoard(){
  // create elements above game board
  $('<div>', {class: 'timer', id: 'current-timer', text: '00:' + stopwatchSeconds}).appendTo('#board')
  $('<div>', {id: 'tile-counter',
    html: '<span id="tilesLeftCounter">' + numOfNonBombs + '</span><span> / </span><span id="flagsLeftCounter">' + numOfBombs + '</span>'
  }).appendTo('#board')
  $('<div>', {class: 'timer', id: 'record-timer', text: '00:60'}).appendTo('#board')
  $('<div>', {id: 'reset-btn', text: 'New Game'}).appendTo('#board')
  $('<div>', {id: 'toggle-flag-btn', text: 'Toggle Flag'}).appendTo('#board')

  // customize board width to number of columns
  $('#board').css('width', (boardColumns * 60).toString() )

  //New Game Button
  $('#reset-btn').click(function(){
    resetBoard()
  })

  // set values of counters
  tilesLeftCounter = numOfNonBombs;
  var flagsLeftCounter = numOfBombs;
  var flagToggle = false

  // toggle Flag Button
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
            // update counter
            $('#flagsLeftCounter').html(flagsLeftCounter)
          } else if( !$(this).hasClass('flagged') ){
            // is bomb
            if( $(this).html() == '-1' ){
              $(this).addClass('tile-bomb')
              $(this).removeClass('tile-hidden')
              timer('stop')

              if(stopwatchSeconds > highScoreSeconds){setRecord()}
// TODO << this isn't working right b/c timer should count down, not up
              alert( 'tile ' + $(this).attr('id') + ' is a bomb, you lose')
              stopwatchSeconds = 0

            } else if($(this).hasClass('clicked') ){
              alert('This tile has already been selected, select another.')
// TODO animate shake on click

            } else if( $(this).html() == '0' ){
              clearZeroTiles( $(this).attr('id') )
              checkForWin()

            } else { // is num between 1 & 8
              console.log($(this).attr('id'))
              triggerTileById( $(this).attr('id') )
              checkForWin()
            } // else
          } else {// if( !flagToggle ).. the tile IS flagged
            alert('this tile is protected, toggle the flag selector and select this tile to disable protection')
// TODO animate flashing red on click
          }
        }) // $divTile.click
        $divTile.appendTo('#row' + row);
    } // forEach( column )
  } // forEach( row )


  /// MAKE ARRAY OF UNIQUE BOMB IDs
  var newBombId = makeTileIdStr( randomTileAxisNum('col'), randomTileAxisNum('row') );
  var arrayOfBombs = [newBombId]
  while(arrayOfBombs.length < numOfBombs){
    newBombId = makeTileIdStr( randomTileAxisNum('col'), randomTileAxisNum('row') );
    if( !arrayOfBombs.includes(newBombId) ){
      arrayOfBombs.push(newBombId)
    }
  } // while(arrayOfBombs.length < numOfBombs)
  /// MAKE BOMBS
  for(var b = 0; b < arrayOfBombs.length; b++){
    makeIntoBomb(arrayOfBombs[b])
  }
  tilesToClear = numOfNonBombs

  timer('start')
} // makeBoard()
