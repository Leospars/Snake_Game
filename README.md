Snake Game
==========

Tasks:
------

* Add sign in capabilities / Accounts
* Store HighScore
* Create Leader Board
* Add buttons to make snake use ai algorithm rather than user control
* Implement A\* Search Algorithm

Current Features:
-----------------

* Fully operable Snake Game using user input
* Can toggle Hamiltonian Cycle and A* Search to play on it's own
* Fully operable Snake Game using user input

* Can preferentially choose a direction to move toward apple, and it will not hit itself
* or the wall; if no other option is available will pause game

* Buttons added to adjust speed of the game
* Buttons added to make snake use AI algorithm rather than user control

Background:
-----------------
Hamiltonian Cycle is a gridPath in graph theory that visits each vertex exactly once.  
Implementing this in the snake game, the snake visits every square on the board exactly once.  
This prevents the snake from ever hitting itself or the wall and will always grow the apple, no  
matter what random location it is generated in except when the field/canvas does not have an even  
number of columns and rows.

This may easily e resolved by adding an if statement to stat the HC cycle in an even location.  
However, this is very boring so we will try to implement a code that will allow the snake to generate  
a new HC cycle every time it eats an apple and one that avoids the possibility of hitting itself in the  
cycle where the map does not have even sides.

Bugs:
-----

* Hamiltonian Cycle is mathematically impossible if the field/canvas does not have an even number of columns or rows.
  * Solution: Add if statement to start the HC cycle to cover an even portion of the graph/field.
* Snake can go through itself if you press the opposite direction fast enough. <br>
  * Solution: Add buffer to allow the next input to pass after the body new location update is complete.
* Hamiltonian Cycle takes an unideal amount of time to calculate the best path if the graph is greater than 6 by 6 (
  6x6).
  * Solution: Optimize the algorithm further, use an algorithm to get the snake head in a 6x6 with the apple and the
    analysing the outermost rows and columns to ensure the snake will not crash after exiting the 6x6 with the apple.
* Snake may hit it's tail during Hamiltonian Cycle if it eats an apple and the body grows.
  The path is already mapped, so it might though very unlikely.
  * Solution snake grow after eat apple in the optimizeHamilCycle path calculation