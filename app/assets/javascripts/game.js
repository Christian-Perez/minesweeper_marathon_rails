
    // BOARD
var board = document.getElementById('board'),
    startRows = 3,
    boardRows = startRows,

    startColumns = 3,
    boardColumns = startColumns,

    // BOMBS
    startNumOfBombs = 1,
    numOfBombs = startNumOfBombs,
    startNumOfNonBombs = (boardRows * boardColumns) - numOfBombs,
    bombIncrement = 2,
    numOfNonBombs = startNumOfNonBombs,

    // STOPWATCH
    stopwatch,
    startStopwatchSeconds = 60,
    stopwatchSeconds = startStopwatchSeconds,
    startStopwatchLevelUp = 10,
    stopwatchLevelUp = 10,  // adds time to stopwatchSeconds
    stopwatchIncrement = 10, // increases stopwatchLevelUp

    // SCORE
    startPlayerScore = 0,
    playerScore = startPlayerScore,

    // COUNTERS ( flags / tiles )
    tilesLeftCounter, // used by setBoard() & clearZeroTiles()
    flagsLeftCounter = numOfBombs,
    flagToggle = false

$('#startGameButton').click( function(){ resetGame() } )

function triggerTileById(tileIdStr){
 if( !$('#' + tileIdStr).hasClass('clicked')){
  $('#' + tileIdStr).addClass('clicked')
  $('#' + tileIdStr).removeClass('tile-hidden')
  $('#' + tileIdStr).addClass('tile-' + parseInt($('#' + tileIdStr).html()) )

  // update tile counter
  --tilesLeftCounter
  $('#tilesLeftCounter').text(tilesLeftCounter)

  // update score
  playerScore += parseInt( $('#' + tileIdStr).html() )
  $('#player-score').html(playerScore + 'pts')
  }
} // triggerTileById

function timer(string){

  function tick(){
    --stopwatchSeconds
    setTime()
    checkForWin()
  }

  switch(string){
    case 'start':
      stopwatch = setInterval(function(){ tick() }, 1000);
      break;
    case 'stop':
      clearInterval(stopwatch);
      break;
    case 'reset':
      stopwatchSeconds = startStopwatchSeconds;
      $('#current-timer').html(stopwatchSeconds)
      clearInterval(stopwatch);
      break;
  } // switch
} // timer(string)

function setTime(){

  function formatTime(num){
    if(num < 10){
      return ( '0' + num )
    }else{
      return ( '' + num )
    }
  }

  var minutes = formatTime( Math.floor(stopwatchSeconds / 60) )
  var seconds = formatTime( stopwatchSeconds % 60 )
  $('#current-timer').html(minutes + ':' + seconds)
  return minutes + ':' + seconds
}

function checkForWin(){ //
  if(tilesLeftCounter < 1){
    // timer('stop')
    boardColumns++
    boardRows++
    numOfBombs += bombIncrement
    numOfNonBombs = (boardRows * boardColumns) - numOfBombs
    stopwatchSeconds += stopwatchLevelUp
    stopwatchLevelUp += stopwatchIncrement
    //TODO disable clicking aditional tiles && make a newGame Btn into Continue Btn >> start timer again at new board
    // resetGame()
    $('<div>', {id: 'notice', text: 'LEVEL COMPLETE!!!', class: 'hidden'}).appendTo('#hud').slideDown( 400 ).delay( 800 ).fadeIn( 800 )
    revealTiles()
    $('<div>', {class: 'continue-btn hidden', html: 'continue..'}).appendTo('#hud').slideDown( 400 ).delay( 800 ).fadeIn( 800 ).click( function(){ levelUp() } )
    timer('stop')
  }
  if(stopwatchSeconds < 1){
    gameOver('time ran out :(')
  }
} // checkForWin()

function gameOver(message){ //
  timer('stop')
  boardRows = startRows
  boardColumns = startColumns
  stopwatchSeconds = startStopwatchSeconds
  // alert('GAME OVER \n' + message)
  $('<div>', {class: 'hidden', id: 'notice', text: 'GAME OVER\n' + message}).appendTo('#hud').slideDown( 400 ).delay( 800 ).fadeIn( 800 )
  revealTiles()
  $('<div>', {class: 'continue-btn hidden', html: 'start over'}).appendTo('#hud').slideDown( 400 ).delay( 800 ).fadeIn( 1500 ).click( function(){resetGame()} )
}

function revealTiles(){
  console.log('revealing tiles..')
  $('.tile').addClass('disabled').each(function(){
    if( $(this).html() == '-1' ){
      $(this).addClass('tile-bomb')
    }
  })
} //

function resetGame(){
  console.log('resetGame')
  $('#board').empty()
  timer('stop')
  timer('reset')
  playerScore = startPlayerScore
  boardColumns = startColumns
  boardRows = startRows
  numOfBombs = startNumOfBombs
  numOfNonBombs = startNumOfNonBombs
  setHUD()
  setBoard()
}

function levelUp(){
  $('#board').empty()
  timer('stop')
  setHUD()
  setBoard()
}

function setHUD(){
  // create elements above game board
  $( '<div>', {id: 'hud'} ).appendTo('#board')
  $( '<div>', {id: 'hud-display'}).appendTo('#hud')
  $( '<div>', {id: 'hud-buttons'}).appendTo('#hud')

  $('<div>', {class: 'timer', id: 'current-timer', text: setTime() }).appendTo('#hud-display')
  $('<div>', {id: 'tile-counter',
    html: '<span id="tilesLeftCounter">' + numOfNonBombs + '</span><span> / </span><span id="flagsLeftCounter">' + numOfBombs + '</span>'
  }).appendTo('#hud-display')
  $('<div>', {class: 'timer', id: 'player-score', text: playerScore + 'pts'}).appendTo('#hud-display')
  $('<div>', {id: 'reset-btn', text: 'New Game'}).appendTo('#hud-buttons')
  $('<div>', {id: 'toggle-flag-btn', text: 'Toggle Flag'}).appendTo('#hud-buttons')

  // customize board width to number of columns
  // $('#hud').css('width', (boardColumns * 60).toString() )

  //New Game Button
  $('#reset-btn').click(function(){
    resetGame()
  })

  // set values of counters
  tilesLeftCounter = numOfNonBombs;
  flagsLeftCounter = numOfBombs;
  flagToggle = false

  // toggle Flag Button
  $('#toggle-flag-btn').click(function(){
    // change click behavior if toggle-flag-btn has been clicked
    flagToggle == true ? flagToggle = false : flagToggle = true
    if( $('#toggle-flag-btn').hasClass( 'flagged' ) ){
      $('#toggle-flag-btn').removeClass('flagged')
    } else {
      $('#toggle-flag-btn').addClass('flagged')
    }
  }) // click( #toggle-flag-btn )
}

function setBoard(){
  $('#scrollDiv').remove()
  $('.continue-btn').remove()
  // scrollDiv
  $('<div>', { id: 'scrollDiv', class: 'hidden' }).appendTo('#board');

  // make tiles & add listener( function() )
  for(var row = 0; row < boardRows; row++){ // ROW
    $('<div>', { id: ('row' + row), class: 'row' }).appendTo('#scrollDiv');
      for(var col = 0; col < boardColumns; col++){ // COLUMN
        var $divTile = $('<div>', { class: 'tile tile-hidden', id: makeTileIdStr(row, col), text: 0 } );
          // userTriggersTile.then(...)
          $divTile.click(function(){
            /// toggle Flags
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
                //TODO style board
                stopwatchSeconds = 0
                gameOver('you clicked a bomb :(')
              } else if($(this).hasClass('clicked') ){
                alert('This tile has already been selected, select another.')
                // TODO animate shake on click

              } else if( $(this).html() == '0' ){
                clearZeroTiles( $(this).attr('id') )
                checkForWin()

              } else { // is num between 1 & 8
                // console.log($(this).attr('id'))
                triggerTileById( $(this).attr('id') )
                checkForWin()
              } // else
            } else {// if( !flagToggle ).. the tile IS flagged
              alert('this tile is protected, toggle the flag selector and select this tile to disable protection')
              // TODO animate flashing red on click
            }
          }) // $divTile.click
          $divTile.appendTo('#row' + row)
      } // forEach( column )
  } // forEach( row )

  $('.row').css('width', (60 * boardColumns) )

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
  $('#scrollDiv').css('display', 'none').fadeIn('slow')
  timer('start')

  function randomTileAxisNum(axis){
    // axis = 'col' or 'row'
    var num
    axis == 'col' ? num = Math.floor( (Math.random() *boardColumns ) ) : num = Math.floor( (Math.random() *boardRows ) )
    return num
  }//randomTileAxisNum()

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
    setTimeout(function(){}, 3000)
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

    function isBomb(tileDOM){
      if( tileDOM.html() == -1 ){
        return true
      } else {
        return false
      }
    }

  } // MAKE INTO BOMB ()

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
} // setBoard()
