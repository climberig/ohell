$(document).ready(function () {
    var cardLim, players, len, dealer, score = [], roundCount = 0, card = 1, initialDealer;
    var allBidInputs = [], allTricksInputs = [], allCards = [];

    $('#start').click(function () {
        var playersStr = $.trim($('#players').val());
        var dealerStr = $.trim($('#dealer').val());
        if (!playersStr || !dealerStr)
            alert("Enter players and dealer");
        else if (playersStr.indexOf(dealerStr) == -1)
            alert("Dealer should be one of the players");
        else {
            players = playersStr.split(",");
            for (var i = 0; i < players.length; i++)
                players[i] = $.trim(players[i]);
            len = players.length;
            dealer = dealerIndex(dealerStr);
            cardLim = parseInt($.trim($('#cardLim').val()));
            initScores();
            startGame();
        }
    });

    $('#test').click(function () {
        players = ['igor', 'katie', 'emery'];
        len = players.length;
        dealer = dealerIndex('igor');
        cardLim = 2;
        initScores();
        startGame();
    });

    $('#toggleEditor').click(function () {
        $('#editor').toggle();
    });

    $('#helpToggle').click(function () {
        $('#help').toggle();
    });

    $('#recalculate').click(function () {
        $('#game').find('tr').remove();
        roundCount = 0;
        dealer = initialDealer;
        addGameRow(players, ' ');
        initScores();
        for (var i = 0; i < allBidInputs.length; i++) {
            updateScores(values(allBidInputs[i]), values(allTricksInputs[i]));
            addGameRow(score, allCards[i]);
            roundCount++;
            dealer = increment(dealer);
        }
        newRound();
    });

    function startGame() {
        $('#init').remove();
        $('#board').toggle(true);
        $('#toggleEditor').toggle(true);
        $('#game').width((len + 1) * 70);
        $('#gameEditor').width((len + 1) * 100);
        initialDealer = dealer;
        addGameRow(players, ' ');
        addEditorPlayers();
        newRound();
    }

    function newRound() {
        roundCount++;
        if (card == 0) {
            showMessage(winner() + " won! Congrats!");
            return;
        }
        var playersRow = addGameRow(arrangePlayers(dealer), card);
        var bidInputs = inputs(len);
        var bidRow = addGameRow(bidInputs, 'Bids');
        $(bidInputs[0]).focus();
        for (var i = 0; i < len; i++)
            (function (i) {
                $(bidInputs[i]).keyup(function () {
                    if (hasNumber(this))
                        if (i < len - 1) {
                            $(bidInputs[i + 1]).focus();
                            if (i == len - 2) {
                                var message;
                                var diff = card - sum(values(bidInputs.slice(0, i + 1)));
                                if (diff >= 0)
                                    message = 'Can not bid ' + diff;
                                else
                                    message = 'Can bid everything';
                                showMessage(message);
                            }
                        } else if (i == len - 1) {
                            var tricksInputs = inputs(len);
                            var tricksRow = addGameRow(tricksInputs, 'Tricks');
                            showMessage('');
                            $(tricksInputs[0]).focus();
                            for (var k = 0; k < len; k++)
                                (function (k) {
                                    $(tricksInputs[k]).keyup(function () {
                                        if (hasNumber(this))
                                            if (k < len - 1)
                                                $(tricksInputs[k + 1]).focus();
                                            else if (k == len - 1) {
                                                bidRow.remove();
                                                tricksRow.remove();
                                                playersRow.remove();
                                                var bids = shift(values(bidInputs), dealer), tricks = shift(values(tricksInputs), dealer);
                                                updateScores(bids, tricks);
                                                addGameRow(score, card);
                                                updateEditor(bids, tricks, card);
                                                allCards.push(card);
                                                nextCard();
                                                dealer = increment(dealer);
                                                newRound();
                                            }
                                    });
                                })(k);
                        }
                });
            })(i);
    }

    function winner() {
        var winners = '', indices = maxIndices(score);
        for (var i = 0; i < indices.length; i++)
            winners += players[indices[i]] + ",";
        return winners.substring(0, winners.length - 1);
    }

    function updateEditor(bids, tricks, card) {
        var bidInputs = inputsWithValues(bids), trickInputs = inputsWithValues(tricks);
        addEditorRow(bidInputs, trickInputs, card);
        allBidInputs.push(bidInputs);
        allTricksInputs.push(trickInputs);
    }

    function initScores() {
        for (var i = 0; i < len; i++)
            score[i] = 0;
    }

    function maxIndices(elements) {
        var indices = [0], max = elements[0];
        for (var i = 1; i < elements.length; i++)
            if (max == elements[i])
                indices.push(i);
            else if (max < elements[i]) {
                indices = [i];
                max = elements[i];
            }
        return indices;
    }

    function dealerIndex(dealer) {
        for (var i = 0; i < len; i++)
            if (dealer == players[i])
                return i;
    }

    function arrangePlayers(dealer) {
        var p = [];
        while (p.length < len) {
            dealer = increment(dealer);
            p.push(players[dealer]);
        }
        return p;
    }

    function hasNumber(input) {
        return $.isNumeric($(input).val());
    }

    function increment(i) {
        return (i + 1) % len;
    }

    function decrement(i) {
        return (len - i - 1) % len;
    }

    function shift(values, position) {
        position = decrement(position);
        var shifted = [];
        for (var i = 0; i < len; i++) {
            shifted[i] = values[position];
            position = increment(position);
        }
        return shifted;
    }

    function updateScores(bids, tricks) {
        for (var i = 0; i < len; i++) {
            var bid = bids[i], trick = tricks[i];
            var diff = Math.abs(bid - trick);
            if (diff == 0)
                score[i] += 10 + bid * 2;
            else
                score[i] -= 2 * diff;
        }
    }

    function nextCard() {
        if (roundCount < cardLim)
            card++;
        else
            card--;
    }

    function showMessage(m) {
        $('#messages').text(m);
    }

    function sum(values) {
        var sum = 0;
        for (var i = 0; i < values.length; i++)
            sum += values[i];
        return sum;
    }

    function values(inputs) {
        var vals = [];
        for (var i = 0; i < inputs.length; i++)
            vals[i] = parseInt($(inputs[i]).val());
        return vals;
    }


    function addGameRow(values, first) {
        var row = $('<tr>');
        if (first)
            row.append($('<td>').append(first));
        for (var i = 0; i < values.length; i++)
            row.append($('<td>').append(values[i]));
        $('#game').append(row);
        return row;
    }

    function addEditorPlayers() {
        var row = $('<tr>');
        row.append($('<td>').append(' '));
        for (var i = 0; i < len; i++)
            row.append($('<td>').append(players[i]));
        $('#gameEditor').append(row);
        return row;
    }

    function addEditorRow(bidsInputs, tricksInputs, card) {
        var row = $('<tr>');
        row.append($('<td>').append(card));
        for (var i = 0; i < bidsInputs.length; i++)
            row.append($('<td>').append(bidsInputs[i]).append(tricksInputs[i]));
        $('#gameEditor').append(row);
        return row;
    }

    function inputs(len) {
        var inputs = [];
        for (var i = 0; i < len; i++)
            inputs[i] = $('<input>');
        return inputs;
    }

    function inputsWithValues(values) {
        var inputs = [];
        for (var i = 0; i < values.length; i++) {
            inputs[i] = $('<input>').attr({
                type: 'text',
                value: values[i]
            })
        }
        return inputs;
    }
});
