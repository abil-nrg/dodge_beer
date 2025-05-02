import numpy as np
import os 

def hitPR(X_game, hit_dict):
    pass

hit_dict = {} #player num - [binary list]

for f in os.listdir():
    name, ext =os.path.splitext(f)
    if ext == '.npy':
        X_game =  np.load(f)
