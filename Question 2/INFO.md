# Python Implementation of Link's Summer Job list
> ### It's not safe to go alone... so go with every logical permutation, just to be safe.
---
## Running the code
There are no required packages, this code is designed to operate with python 3.
`python hyrule.py`
## Understanding the code
My problem solving strategy involves creating a tree of all of Link's possible choices at each possible day of questing. Link has a plenitude of options, grace of Zelda, for this, and hence, the tree would traditionally have many branches. In order to make the program more efficient and avoid purely brute forcing the quest list, I realized that many Branches would yield results impractical for achieving a maximum score. For example, if you could complete a full quest before another quest even starts and make some money off of it, it will always be correct. This bounds the number of choices link has to a set amount at each day, derived from the function `calcTreeMin`. This solution should be practical given any quest board, and my testing evinces this. Efficiency isn't paramount with this solution, and I'm certain I could refine it to cull branches of the master tree that already have a higher day count but lower score than another given branch, but it would involve writing a main loop to parse the tree rather than allowing recursion to solve the tree semi-autonomously. In my eyes, this isn't worth the time that I could be spending on the other interesting tasks I need to tackle. This approach generates the answer immediately on any modern hardware, so regardless, it'll be less tedious to run than switching boots in the water temple.

