import sys
from anytree import Node, RenderTree #Note on the data below. I could've scraped the PDF in this file, but I'd rather have my entry kept concise.
data = [(dict(start=1,days=3,pay=750,name='Robbie\'s Research')),(dict(start=2,days=2,pay=500,name='A Parent\'s Love')),(dict(start=1,days=4,pay=920,name='The Weapon Connoisseu')),(dict(start=3,days=8,pay=1050,name='Sunshroom Sensing')),(dict(start=5,days=1,pay=200,name='Sunken Treasure')),(dict(start=3,days=4,pay=400,name='Cooking with Koko')),(dict(start=7,days=5,pay=1200,name='Arrows of Burning Heat')),(dict(start=12,days=3,pay=370,name='Stalhorse: Pictured!')),(dict(start=6,days=8,pay=840,name='Curry for What Ails You')),(dict(start=19,days=2,pay=165,name='The Jewel Trade')),(dict(start=23,days=7,pay=1520,name='Slated for Upgrades')),(dict(start=14,days=4,pay=600,name='Medicinal Molduga')),(dict(start=8,days=3,pay=430,name='Tools of the Trade')),(dict(start=20,days=7,pay=1100,name='A Gift for the Great Fairy')),(dict(start=28,days=3,pay=590,name='A Rare Find')),(dict(start=10,days=4,pay=900,name='Frog Catching')),(dict(start=13,days=6,pay=230,name='Luminous Stone Gathering')),(dict(start=25,days=4,pay=750,name='A Freezing Rod')),(dict(start=9,days=1,pay=460,name='Rushroom Rush!')),(dict(start=16,days=10,pay=780,name='The Hero\'s Cache')),(dict(start=4,days=5,pay=410,name='A Gift of Nightshade')),(dict(start=11,days=3,pay=570,name='Lynel Safari')),(dict(start=7,days=2,pay=1200,name='Riddles of Hyrule')),(dict(start=2,days=23,pay=2100,name='An Ice Guy'))]
def calcTreeMin(day): #Finds all of the nodes of the tree that make sense to use. If one could complete another quest before another quest even starts, it makes no sense to include in the sample set. 
    smallday=sys.maxsize
    for elem in list(filter(lambda x: x["start"] >= day,data)):
        if elem["start"]+elem["days"]<smallday:
            smallday=elem["start"]+elem["days"]
    return filter(lambda x : x["start"]<=smallday-1,list(filter(lambda x: x["start"] >= day,data)))
class Tree:
    def __init__(self,day,total,path): 
        self.children = None
        self.day=day
        self.total=total
        self.path=path
        self.createChildren()
    def createChildren(self): #Populate all of the children of this node of the tree with all of the possibilities that make sense. (See above for explanation)
        if self.children==None:
            self.children=[];
            possibilities=calcTreeMin(self.day)
            if(len("1")>0):
                for permutation in possibilities:
                    self.children.append(Tree(permutation["start"]+permutation["days"],self.total+permutation["pay"],self.path+ ", then \n" + permutation["name"] + "(" + str(permutation["pay"]) + ")"))
            else:
                self.finished=True
        else:
            for child in self.children:
                child.createChildren()
    def getFinals(self): #Returns an array of all the ends to the tree; this is then sorted, and the highest term is extracted.
        finals=[]
        if self.children==[]:
            finals.append(self.total)
            return finals
        else:
            for kids in self.children:
                finals+=kids.getFinals()
            return finals;
    def findNodePath(self, target): #Find a path from number of rupees 
        if(self.total==target):
           return self.path
        if self.children!=[]:
            for kids in self.children:
                if(kids.findNodePath(target)!=None):
                    return kids.findNodePath(target)
x=Tree(1,0, "The Quest Starts")
maxrupee=sorted(x.getFinals())[-1:][0] #Filter the array of all remaining logical states and pick the highest
print("The maximum number of rupees Link can earn is",maxrupee)
print(x.findNodePath(maxrupee)) #This architecture can allow link to pick specific amounts of rupees to find as well, i.e: calling this function with any other number than the max 