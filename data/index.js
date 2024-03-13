export const DATA = [
    {
        role: "paper",
        beats: 'rock',
    }, 
    {
        role: "scissors",
        beats: 'paper',
    },
    {
        role: "rock",
        beats: 'scissors',
    }
]

function randomFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
}

export const createName = () => {
    const prefix = randomFromArray([
        "COOL",
        "SUPER",
        "HIP",
        "SMUG",
        "SILKY",
        "GOOD",
        "SAFE",
        "DEAR", 
        "DAMP", 
        "WARM", 
        "RICH", 
        "LONG", 
        "DARK", 
        "SOFT", 
        "BUFF", 
        "DOPE", 
    ]);

    const animal = randomFromArray([
        "BEAR",
        "DOG",
        "CAT",
        "FOX",
        "LAMB",
        "LION",
        "BOAR",
        "GOAT", 
        "VOLE", 
        "SEAL", 
        "PUMA", 
        "MULE", 
        "BULL", 
        "BIRD", 
        "BUG",
    ])

    return `${prefix} ${animal}`;
}