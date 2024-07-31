from player import *

p1 = Player("A")
p2 = Player("B")
p3 = Player("C")
t1 = Team("Team1", 1)
t1.add_member(p1)
t1.add_member(p2)
t1.add_member(p3)

p4 = Player("D")
p5 = Player("E")
p6 = Player("F")
t2 = Team("Team2", 2)
t2.add_member(p4)
t2.add_member(p5)
t2.add_member(p6)

game = Game(t1,t2)

round1 = Round(1)
round1.add_event(p1, Action.HIT.value)

game.add_round(round1)

print(game)