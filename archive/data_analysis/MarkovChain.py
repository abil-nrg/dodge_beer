import numpy as np
import random as rng

class MarkovChain:

    def __init__(self, p_matrix, states) -> None:
        #p_matrix - nd array
        #states - list

        if type(p_matrix) is not np.ndarray :
            raise TypeError('The probability matrix MUST be a numpy ndarray')

        if len(p_matrix.shape) != 2:
            raise TypeError('The probability matrix MUST be 2 dimensional')
        states_enum = enumerate(states)
        #Dictionary States -> Int for use in p_matrix
        self.states = states
        self.state_dict = dict((j,i) for i,j in states_enum)
        self.p_matrix = p_matrix
    
    def walk(self, cur_state):
        #Cur State is Str
        rv = np.random.uniform()
        print(rv)
        state_int = self.state_dict[cur_state]
        
        prob_sum = np.cumsum(self.p_matrix[state_int])
        winning_state = self.between_index(prob_sum, rv)

        return self.states[winning_state]
    
    def between_index(self, num_list, prob):
        #to see in between which numbers in the num list is num
        if num_list[-1] < prob:
            raise ValueError('probability must be less than max value')
        print(num_list)
        print(prob)
        for i in range(0, len(num_list)):
            if i == 0 and prob <= num_list[i]:
                return i
            if num_list[i] <= prob and prob >= num_list[i+1]:
                return i+1
        return -1

    def __str__(self) -> str:
        return self.p_matrix