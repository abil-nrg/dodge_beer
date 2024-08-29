from MarkovChain import MarkovChain
import random as rng

class DB_player:
    def __init__(self,name, hit_states, hit_p, save_states, save_p, htw):
        self.hit_MC = MarkovChain(hit_p, hit_states)
        self.save_MC = MarkovChain(save_p, save_states)
        self.cur_hit = 'miss'
        self.cur_save = False
        #htw - hits to win
        self.htw = htw
        self.name = name
    
    def attempt_hit(self):
        self.cur_hit = self.hit_MC(self.cur_hit)
        return self.cur_hit

    def attempt_save(self):
        self.cur_save = self.save_MC(self.cur_save)
        save_factor = np.random.uniform()
        return (self.cur_save, save_factor)
    
    def __str__(self) -> str:
        return f"Name: {self.name}\n Hit MC: {self.hit_MC.p_matrix}"