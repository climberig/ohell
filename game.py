CARD_LIM = 13
players = ['igor', 'katie', 'jamie', 'emery']
WIDTH = 10 * len(players) + 5
game = []


def dl(times=1):
    for _ in range(times):
        print('\033[A' + ' ' * WIDTH + '\033[A')


def points(bets, tricks, first_player):
    pp = []
    for i in range(len(bets)):
        bet, trick = bets[i], tricks[i]
        diff = abs(bet - trick)
        if diff == 0:
            p = 10 + trick * 2
        else:
            p = -diff * 2
        pp.append(p)
    return arrange_players(pp, (len(bets) - first_player) % len(players))


def show(first, items):
    print(str(first).rjust(3) + ''.join(str(i).rjust(10) for i in items))


cards, increment, start_player = 1, 1, 0
show('', players)


def calc_total(game):
    totals = [0] * len(game[0])
    for r in game:
        for i in range(len(r)):
            totals[i] += r[i]
    return totals


def arrange_players(players, start_player):
    arranged = []
    while len(arranged) != len(players):
        arranged.append(players[start_player])
        start_player = (start_player + 1) % len(players)
    return arranged


while cards != 0:
    print('-' * WIDTH)
    show(cards, arrange_players(players, start_player))
    bets_str = input('Bets:')
    bets = [int(b) for b in bets_str.split(' ')]
    diff = cards - sum(bets)
    dl(1)
    if diff >= 0:
        print('Can not bet ' + str(diff))
    else:
        print('Can bet everything')
    if len(bets) != len(players):
        bets.append(int(input('Bets:' + bets_str + ' ')))
    tricks = [int(t) for t in input('Tricks:').split(' ')]
    dl(5)
    pp = points(bets, tricks, start_player)
    game.append(pp)
    totals = calc_total(game)
    show(cards, totals)
    cards += increment
    start_player = (start_player + 1) % len(players)
    if cards == CARD_LIM:
        increment = -1


