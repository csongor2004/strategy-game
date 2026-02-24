$(function () {
    
    const gridSize = 10;
    const tileSize = 50;
    let currentPlayer = 1;
    let gold = 100;

    const $board = $('#game-board');

    
    function createBoard() {
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                
                const $tile = $('<div></div>')
                    .addClass('tile')
                    .attr('data-x', x)
                    .attr('data-y', y)
                    .css({
                        left: x * tileSize + 'px',
                        top: y * tileSize + 'px'
                    });

                
                if (Math.random() > 0.9) {
                    $tile.addClass('gold-mine');
                }

                $board.append($tile);
            }
        }
    }

   
    $('#btn-next-turn').on('click', function () {
        currentPlayer = (currentPlayer === 1) ? 2 : 1;
        $('#current-player').text(currentPlayer);

        
        $(this).fadeOut(100).fadeIn(100);
    });

    
    createBoard();
});