const rand = (min, max) => {
    return Math.floor(Math.random()*(max+1-min) + min);
} 

const randomOption = (arr = []) => {
    const randomIndex = rand(0,arr.length-1);
    return arr[randomIndex];
}

let arr = [23,43,54,[34,65,57]];
crash = {right:1, left:1, up:1, down: 1}
crashReport = [crash.right, crash.left, crash.up, crash.down];
console.log((JSON.stringify(crash) === JSON.stringify({right: 1, left: 1, up:1, down: 1})));


// 
// let animeOver20Eps = ["Darker than Black", "Re: Creators"];
// let randAnime = [];
// let animeCount = 0;
// 
// while(animeCount<50){
    // randAnime.push(randomOption(animeOver20Eps));
    // for (const element of animeOver20Eps) {
        // animeCount = 
            // animeCount > countElements(randAnime, element)?
                // animeCount : countElements(randAnime, element);
        // if(animeCount ===  50){ 
            // mostReccurringAnime = element;
            // break;
        // }
    // }
// }
// console.log(mostReccurringAnime, animeCount, countElements(randAnime, "Darker than Black"), countElements(randAnime, animeOver20Eps[1]));
// 
// function countElements(arr = [], element){
    // let found = 0
    // for (const object of arr)
        // if(object === element) found++;
    // return found;
    // return arr.filter(((currentElement) => (currentElement == element))).length;
// }


