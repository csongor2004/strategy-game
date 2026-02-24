$(function () {
    const gridSize = 10;
    const tileSize = 50;
    let currentPlayer = 1;
    let turnCount = 1;

    let players = {
        1: { gold: 100 },
        2: { gold: 100 }
    };

    let selectedUnit = null;
    const $board = $('#game-board');

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

            if (Math.random() > 0.85) {
                $tile.addClass('gold-mine');
            }
            $board.append($tile);
        }
    }

    function updateUI() {
        $('#gold-1').text(players[1].gold);
        $('#gold-2').text(players[2].gold);

        $('.player-stat').removeClass('active-ui');
        if (currentPlayer === 1) $('.p1-stat').addClass('active-ui');
        else $('.p2-stat').addClass('active-ui');
    }

    function checkWinCondition() {
        if (players[1].gold >= 300) { alert("Piros (P1) nyert gazdasági győzelemmel!"); resetGame(); }
        if (players[2].gold >= 300) { alert("Kék (P2) nyert gazdasági győzelemmel!"); resetGame(); }
    }

    function clearHighlights() {
        $('.tile').removeClass('valid-move valid-attack');
    }

    function showValidMoves($unit) {
        clearHighlights();
        let ux = parseInt($unit.parent().attr('data-x'));
        let uy = parseInt($unit.parent().attr('data-y'));

        const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        directions.forEach(dir => {
            let nx = ux + dir[0];
            let ny = uy + dir[1];
            let $targetTile = $(`.tile[data-x="${nx}"][data-y="${ny}"]`);

            if ($targetTile.length > 0) {
                let $targetUnit = $targetTile.children('.unit');
                if ($targetUnit.length === 0) {
                    $targetTile.addClass('valid-move');
                } else if ($targetUnit.attr('data-owner') != currentPlayer && $unit.attr('data-type') === 'soldier') {
                    $targetTile.addClass('valid-attack');
                }
            }
        });
    }

    $('#game-board').on('click', '.tile', function () {
        const x = parseInt($(this).attr('data-x'));
        const y = parseInt($(this).attr('data-y'));
        const action = $('input[name="action"]:checked').val();

        let isSpawnZone = false;
        if (currentPlayer === 1 && y <= 1) isSpawnZone = true;
        if (currentPlayer === 2 && y >= 8) isSpawnZone = true;

        if (action === 'buy_worker' || action === 'buy_soldier') {
            if (!isSpawnZone) {
                alert("Erre a területre nem építkezhetsz! P1: Felső 2 sor | P2: Alsó 2 sor.");
                return;
            }
        }

        if (action === 'buy_worker') {
            if (players[currentPlayer].gold >= 20 && $(this).children('.unit').length === 0) {
                spawnUnit($(this), currentPlayer, 'worker', 'W');
                players[currentPlayer].gold -= 20;
            } else { alert("Nincs elég aranyad, vagy foglalt a mező!"); }
        }
        else if (action === 'buy_soldier') {
            if (players[currentPlayer].gold >= 30 && $(this).children('.unit').length === 0) {
                spawnUnit($(this), currentPlayer, 'soldier', 'S');
                players[currentPlayer].gold -= 30;
            } else { alert("Nincs elég aranyad, vagy foglalt a mező!"); }
        }
        else if (action === 'move' && selectedUnit) {
            let unitX = parseInt(selectedUnit.parent().attr('data-x'));
            let unitY = parseInt(selectedUnit.parent().attr('data-y'));
            let distance = Math.abs(unitX - x) + Math.abs(unitY - y);

            if (distance === 1) {
                let $targetUnit = $(this).children('.unit');

                if ($targetUnit.length === 0) {
                    moveUnit(selectedUnit, $(this));
                    selectedUnit = null;
                    clearHighlights();
                } else if ($targetUnit.attr('data-owner') != currentPlayer) {
                    if (selectedUnit.attr('data-type') === 'soldier') {
                        $targetUnit.fadeOut(300, function () { $(this).remove(); });
                        moveUnit(selectedUnit, $(this));
                        selectedUnit = null;
                        clearHighlights();
                    } else { alert("A munkás nem tud támadni!"); }
                }
            } else { alert("Csak a kijelölt (zöld/piros) szomszédos mezőkre léphetsz!"); }
        }
        updateUI();
    });

    $('#game-board').on('click', '.unit', function (e) {
        const action = $('input[name="action"]:checked').val();
        if (action === 'move') {
            if ($(this).attr('data-owner') == currentPlayer) {
                $('.unit').removeClass('selected');
                $(this).addClass('selected');
                selectedUnit = $(this);
                showValidMoves($(this));
                e.stopPropagation();
            }
        }
    });

    function spawnUnit($tile, owner, type, label) {
        const $unit = $('<div class="unit"></div>')
            .addClass('player' + owner)
            .addClass(type)
            .attr('data-owner', owner)
            .attr('data-type', type)
            .text(label);

        $unit.hide().appendTo($tile).fadeIn(300);
    }

    function moveUnit($unit, $targetTile) {
        $unit.removeClass('selected');
        $unit.appendTo($targetTile);
    }

    $('#btn-next-turn').on('click', function () {
        players[currentPlayer].gold += 10;

        $('.gold-mine').each(function () {
            let $worker = $(this).children('.worker');
            if ($worker.length > 0 && $worker.attr('data-owner') == currentPlayer) {
                players[currentPlayer].gold += 20;
            }
        });

        currentPlayer = (currentPlayer === 1) ? 2 : 1;
        turnCount++;

        $('.unit').removeClass('selected');
        selectedUnit = null;
        clearHighlights();

        updateUI();
        checkWinCondition();
    });

    function resetGame() {
        location.reload();
    }

    updateUI();
});