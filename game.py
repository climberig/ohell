COL_LEN, LEFT_LEN = 10, 3
CARD_LIM = 13
players = ['igor', 'katie', 'jamie', 'emery']
SCREEN_LEN = COL_LEN * len(players) + LEFT_LEN
game = []


def dl(times=1):
    for _ in range(times):
        print('\033[A' + ' ' * SCREEN_LEN + '\033[A')


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
    return arrange(pp, (len(bets) - first_player) % len(players))


def print_line(item, items):
    print(str(item).rjust(LEFT_LEN) + ''.join(str(i).rjust(COL_LEN) for i in items))


def calc_total(game):
    totals = [0] * len(game[0])
    for r in game:
        for i in range(len(r)):
            totals[i] += r[i]
    return totals


def arrange(players, n):
    arranged = []
    while len(arranged) != len(players):
        arranged.append(players[n])
        n = (n + 1) % len(players)
    return arranged


cards, increment, player = 1, 1, 0
print_line('', players)
while cards != 0:
    print('-' * SCREEN_LEN)
    print_line(cards, arrange(players, player))
    bids_str = input('Bids:')
    bids = [int(b) for b in bids_str.split(' ')]
    diff = cards - sum(bids)
    dl(1)
    if diff >= 0:
        print('Can not bid {}'.format(str(diff)))
    else:
        print('Can bid everything')
    if len(bids) != len(players):
        bids.append(int(input('  Bids:{} '.format(bids_str))))
    tricks = [int(t) for t in input('Tricks:').split(' ')]
    dl(5)
    pp = points(bids, tricks, player)
    game.append(pp)
    totals = calc_total(game)
    print_line(cards, totals)
    cards += increment
    player = (player + 1) % len(players)
    if cards == CARD_LIM:
        increment = -1


