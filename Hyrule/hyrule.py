import sys
from anytree import Node, RenderTree
data = [(dict(start=1,days=3,pay=750)),(dict(start=2,days=2,pay=500)),(dict(start=1,days=4,pay=920)),(dict(start=3,days=8,pay=1050)),(dict(start=5,days=1,pay=200)),(dict(start=3,days=4,pay=400)),(dict(start=7,days=5,pay=1200)),(dict(start=12,days=3,pay=370)),(dict(start=6,days=8,pay=840)),(dict(start=19,days=2,pay=750)),(dict(start=23,days=7,pay=1520)),(dict(start=14,days=4,pay=600)),(dict(start=8,days=3,pay=430)),(dict(start=20,days=7,pay=1100)),(dict(start=28,days=3,pay=590)),(dict(start=10,days=4,pay=900)),(dict(start=13,days=6,pay=230)),(dict(start=25,days=4,pay=750)),(dict(start=9,days=1,pay=460)),(dict(start=16,days=10,pay=780)),(dict(start=4,days=5,pay=410)),(dict(start=11,days=3,pay=570)),(dict(start=7,days=2,pay=1200)),(dict(start=2,days=23,pay=2100))]
def calcTreeMin(day):
    smallday=sys.maxsize
    for elem in list(filter(lambda x: x["start"] >= day,data)):
        if elem["start"]+elem["days"]<smallday:
            smallday=elem["start"]+elem["days"]
    return filter(lambda x : x["start"]<=smallday-1,list(filter(lambda x: x["start"] >= day,data)))
class Tree:
    def __init__(self,day,total):
        self.children = None
        self.day=day
        self.total=total
        self.finished=False
    def createChildren(self):
        if self.children==None:
            self.children=[];
            possibilities=calcTreeMin(self.day)

            if(len("1")>0):
                for permutation in possibilities:
                    self.children.append(Tree(permutation["start"]+permutation["days"],self.total+permutation["pay"]))
            else:
                self.finished=True
        else:
            for child in self.children:
                child.createChildren()
    def getFinals(self):
        finals=[]
        if self.children==[]:
            finals.append(self.total);
            return finals
        else:
            for kids in self.children:
                finals+=kids.getFinals()
            return finals;

x=Tree(1,0)
for i in range(21):
    x.createChildren()
print(sorted(x.getFinals())[-1:][0])
