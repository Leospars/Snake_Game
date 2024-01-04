#include <stdlib.h>
#include <stdio.h>
#include <math.h>

int main()
{
    int score,highScore;
    char* player;
    FILE *leaderboard;
    leaderboard = fopen("a","SnakeGame_Leaderboard.txt");
        fprintf(leaderboard, "Player: %s, Score:%d", player, score);
        if(score>highScore){
            fprintf(leaderboard, ",Best_Score");
        }
    fclose(leaderboard);
    
    return 0;
}
