# Battleship
The Odin Project: JavaScript Course: Battleship


Computer's Attack Strategy:
create a stack in random order of all possible attacks
pop from stack to use an attack
if hit add adjacent attacks to stack

attack adjacent till one hits
when an adjacent hits, follow the pattern of direction till ship sinks or miss

if next hit and ship not sunk then store direction, and push three in line(unless its the border), pop those till ship sinks or misses
remove wrong-direction adjacents
if miss go to the initial hit and go the opposite direction till ship sinks

pop already used attacks without using them again
hit the next random attack
repeat this till either player or computer wins