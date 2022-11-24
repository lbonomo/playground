
/**
 * Sleep function
 * 
 * @param ms number
 * @returns promise
 */
function sleep(s:number) {
    return new Promise((resolve) => {
        setTimeout(resolve, s*1000);
    });
}

async function main() {
    console.log("Naciendo...")
    await sleep(5);
    console.log("Muriendo...")
}


main()