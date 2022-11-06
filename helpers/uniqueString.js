export const uniqueString = (length = 12) => {
  var result = '';
  var characters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    var randomIndex = Math.floor(Math.random() * charactersLength);
    while (randomIndex > charactersLength) {
      var randomIndex = Math.floor(Math.random() * charactersLength);
    }
    result += characters[randomIndex];
    if (randomIndex > -1) {
      characters.splice(randomIndex, 1);
    }
  }
  return result;
}
