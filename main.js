const width = 19600;
const height = 8400;

const landMetaData = [];
const notLandColorCodes = [];

function fillLandColorCodes() {
    //Shades of blue
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 100; j++) {
            notLandColorCodes.push(`#c${i}ce${j}`);
            notLandColorCodes.push(`#c${i}ca${j}`);
            notLandColorCodes.push(`#c${i}c8${j}`);
        }
    }

    extra_colors = ["#ff0000",];
    for (let i = 0; i < extra_colors.length; i++) {
        notLandColorCodes.push(extra_colors[i]);
    }
}


function covertToISORight(x, y) {
    var isoX =
        (2048 / 2) *
        ((x - y) / 700);
    var isoY =
        (2048 / 4) *
        ((x + y) / 700);
    return {
        xISO: isoX + 1024,
        yISO: isoY,
    };
}

function handleClick(e, ctx) {
    let land = document.getElementById("landStatus");
    let coordinates = document.getElementById("coordinates");
    let pageX = e.pageX;
    let pageY = e.pageY;
    console.log("Click location:");
    console.log(`(${pageX}, ${pageY})`);

    let pageXcopy = pageX;
    let pageYcopy = pageY;
    let landX = 0;
    let landY = 0;

    while (pageXcopy > 0) {
        pageXcopy -= 70;
        landX += 1;
    }

    while (pageYcopy > 0) {
        pageYcopy -= 70;
        landY += 1;
    }

    console.log("Grid coordinates:");
    console.log(`(${landX}, ${landY})`);
    coordinates.textContent = `Grid (a>ij): (${landX}, ${landY})                                   `

    console.log("Grid top left coordinates:");
    let gridTopLeftX = parseInt(pageX / 70) * 70;
    let gridTopLeftY = parseInt(pageY / 70) * 70;
    console.log(`(${gridTopLeftX}, ${gridTopLeftY})`);
    coordinates.textContent += `\r\nLand top-left: (${gridTopLeftX}, ${gridTopLeftY})`
    coordinates.textContent += `\r\nLand top-right: (${gridTopLeftX + 70}, ${gridTopLeftY})`
    coordinates.textContent += `\r\nLand bottom-left: (${gridTopLeftX}, ${gridTopLeftY + 70})`
    coordinates.textContent += `\r\nLand bottom-right: (${gridTopLeftX + 70}, ${gridTopLeftY + 70})`


    let pixelData = ctx.getImageData(gridTopLeftX, gridTopLeftY, 70, 70).data;
    let hex = "#000000";

    // If transparency on the image
    if ((pixelData[0] == 0) && (pixelData[1] == 0) && (pixelData[2] == 0) && (pixelData[3] == 0)) {
        console.log(" (Transparent color detected, cannot be converted to HEX)");
    } else {
        hex = "#" + ("000000" + rgbToHex(pixelData[0], pixelData[1], pixelData[2])).slice(-6);
        coordinates.textContent += `\r\nHex: ${hex}`

        //if hex is not in the list of notLandColorCodes

        if (!notLandColorCodes.includes(hex)) {
            console.log("NOT land");
            land.textContent = "Not land!!";
            ctx.fillStyle = "#FF0000";
            ctx.fillRect(gridTopLeftX, gridTopLeftY, 70, 70);
        } else {
            console.log("land");
            land.textContent = "Land!!";
            ctx.fillStyle = "#00FF00";
            ctx.fillRect(gridTopLeftX, gridTopLeftY, 70, 70);

            let _id = `${landX}+${landY}`;
            if (!landMetaData.some(e => e._id === _id)) {
                landMetaData.push({
                    _id: _id,
                    position: {
                        x: gridTopLeftX,
                        y: gridTopLeftY,
                        xISO: covertToISORight(gridTopLeftX, gridTopLeftY).xISO,
                        yISO: covertToISORight(gridTopLeftX, gridTopLeftY).yISO
                    },
                    landType: null,
                    _index: `${parseInt(gridTopLeftX) / 70}-${parseInt(gridTopLeftY) / 70}`,
                    uri: null
                });
            }
        }
    }
}

async function startMagic(e, ctx, stopBtn) {

    fillLandColorCodes();

    let land = document.getElementById("landStatus");
    let coordinates = document.getElementById("coordinates");
    let running = true;

    stopBtn.addEventListener("click", function () {
        running = false;
    })


    for (let i = 0; i < 8400; i += 70) {
        for (let j = 0; j < 19600; j += 70) {

            if (!running)
                break;

            await new Promise(r => setTimeout(r, 25));

            let pageX = j;
            let pageY = i;

            let pageXcopy = pageX;
            let pageYcopy = pageY;
            let landX = 0;
            let landY = 0;

            while (pageXcopy > 0) {
                pageXcopy -= 70;
                landX += 1;
            }

            while (pageYcopy > 0) {
                pageYcopy -= 70;
                landY += 1;
            }

            console.log("Grid coordinates:");
            console.log(`(${landX}, ${landY})`);
            coordinates.textContent = `Grid (a>ij): (${landX}, ${landY})                                   `

            console.log("Grid top left coordinates:");
            let gridTopLeftX = parseInt(pageX / 70) * 70;
            let gridTopLeftY = parseInt(pageY / 70) * 70;
            console.log(`(${gridTopLeftX}, ${gridTopLeftY})`);
            coordinates.textContent += `\r\nLand top-left: (${gridTopLeftX}, ${gridTopLeftY})`
            coordinates.textContent += `\r\nLand top-right: (${gridTopLeftX + 70}, ${gridTopLeftY})`
            coordinates.textContent += `\r\nLand bottom-left: (${gridTopLeftX}, ${gridTopLeftY + 70})`
            coordinates.textContent += `\r\nLand bottom-right: (${gridTopLeftX + 70}, ${gridTopLeftY + 70})`


            let pixelData = ctx.getImageData(j, i, 70, 70).data;
            let hex = "#000000";

            // If transparency on the image
            if ((pixelData[0] == 0) && (pixelData[1] == 0) && (pixelData[2] == 0) && (pixelData[3] == 0)) {
                console.log(" (Transparent color detected, cannot be converted to HEX)");
            } else {
                hex = "#" + ("000000" + rgbToHex(pixelData[0], pixelData[1], pixelData[2])).slice(-6);
                coordinates.textContent += `\r\nHex: ${hex}`

                //if hex is not in the list of notLandColorCodes

                if (notLandColorCodes.includes(hex)) {
                    console.log("NOT land");
                    land.textContent = "Not land!!";
                    // ctx.fillStyle = "#FF0000";
                    // ctx.fillRect(j, i, 70, 70);
                } else {
                    console.log("land");
                    land.textContent = "Land!!";
                    // ctx.fillStyle = "#00FF00";
                    // ctx.fillRect(j, i, 70, 70);
                    // ctx.fillText("Text", j, i);
                    // let iso_coordinates = covertToISORight(j, i);

                    let _id = "0x" + Number(`${landX}${landY}`).toString(16)
                    if (!landMetaData.some(e => e._id === _id)) {
                        landMetaData.push({
                            _id: _id,
                            position: {
                                x: j,
                                y: i,
                                xISO: covertToISORight(j, i).xISO,
                                yISO: covertToISORight(j, i).yISO
                            },
                            landType: null,
                            _index: `${parseInt(j) / 70}-${parseInt(i) / 70}`,
                            uri: null
                        });
                    }
                }
            }
        }
    }

    console.log("**Script completed!**");
}

document.body.onload = function () {
    const c = document.getElementById("canvas");
    const ctx = c.getContext("2d", { alpha: false });

    const exportBtn = document.getElementById("export");
    exportBtn.addEventListener("click", function () {
        console.log(JSON.stringify(landMetaData));
        localStorage.setItem('myData', JSON.stringify(landMetaData));
    });

    const stopBtn = document.getElementById("stop");

    const startBtn = document.getElementById("start");
    startBtn.addEventListener("click", (event) => {
        startMagic(event, ctx, stopBtn);
    });




    // ['mousemove', 'wheel'].forEach(function (mouseevent) {
    //     c.addEventListener(mouseevent, (event) => {
    //         handleClick(event, ctx);
    //     });
    // });

    var img = document.getElementById("p1");
    ctx.drawImage(img, 0, 0);

    var img2 = document.getElementById("p2");
    ctx.drawImage(img2, 4900, 0);

    var img3 = document.getElementById("p3");
    ctx.drawImage(img3, 9800, 0);

    var img4 = document.getElementById("p4");
    ctx.drawImage(img4, 14700, 0);

    // drawing the grid
    for (var x = 0; x <= width; x += 70) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
    }

    for (var x = 0; x <= height; x += 70) {
        ctx.moveTo(0, x);
        ctx.lineTo(width, x);
    }
    ctx.strokeStyle = "yellow";
    ctx.stroke();
}

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}
