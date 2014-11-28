COL_LEN, LEFT_LEN = 10, 3
CARD_LIM = int(input('Card limit:'))
players = []
game = []


def dl(times=1):
    for _ in range(times):
        print('\033[A' + ' ' * SCREEN_LEN + '\033[A')


def points(bets, tricks):
    pp = []
    for i in range(len(bets)):
        bet, trick = bets[i], tricks[i]
        diff = abs(bet - trick)
        if diff == 0:
            p = 10 + trick * 2
        else:
            p = -diff * 2
        pp.append(p)
    return pp


def print_line(item, items):
    print(str(item).rjust(LEFT_LEN) + ''.join(str(i).rjust(COL_LEN) for i in items))


def calc_total(game):
    totals = [0] * len(game[0])
    for r in game:
        for i in range(len(r)):
            totals[i] += r[i]
    return totals


def rearrange(items, n, reverse=False):
    if reverse:
        n = (len(items) - n) % len(items)
    arranged = []
    while len(arranged) != len(items):
        arranged.append(items[n])
        n = (n + 1) % len(items)
    return arranged


def save(s):
    with open('game', 'w+') as f:
        f.write(s + '\n')


def save_game(cards, bids, tricks):
    with open('game', 'a') as f:
        f.write(str(cards) + '\n')
        f.write(','.join(str(b) for b in bids) + '\n')
        f.write(','.join(str(t) for t in tricks) + '\n')


def next_card(game, cards):
    return cards + (1 if len(game) < CARD_LIM else -1)


def int_list(s, sep=' '):
    return [int(i.rstrip()) for i in s.rstrip().split(sep)]


cards, player = 1, 0
answer = input('Initialize a game from file?(y/n)')
if answer == 'y':
    with open('game', 'r') as f:
        line = f.readline().rstrip()
        players = line.split(',')
        print_line('', players)
        line = f.readline()
        while line:
            cards = int(line.rstrip())
            bets = int_list(f.readline(), sep=',')
            tricks = int_list(f.readline(), sep=',')
            game.append(points(bets, tricks))
            totals = calc_total(game)
            print_line(cards, totals)
            line = f.readline()
            player = (player + 1) % len(players)
else:
    players = input('Enter players:').rstrip().split(',')

if not game:
    print_line('', players)
    save(','.join(players))
else:
    cards = next_card(game, cards)
SCREEN_LEN = COL_LEN * len(players) + LEFT_LEN

while cards != 0:
    print('-' * SCREEN_LEN)
    print_line(cards, rearrange(players, player))
    bids_str = input('Bids:').rstrip()
    bids = int_list(bids_str)
    diff = cards - sum(bids)
    if len(bids) < len(players):
        dl(1)
        if diff >= 0:
            print('Can not bid {}'.format(str(diff)))
        else:
            print('Can bid everything')
        bids.append(int(input('  Bids:{} '.format(bids_str))))
    else:
        print('')
    tricks = int_list(input('Tricks:'))
    dl(5)
    bids, tricks = rearrange(bids, player, True), rearrange(tricks, player, True)
    save_game(cards, bids, tricks)
    pp = points(bids, tricks)
    game.append(pp)
    totals = calc_total(game)
    print_line(cards, totals)
    player = (player + 1) % len(players)
    cards = next_card(game, cards)


