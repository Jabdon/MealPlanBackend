const fs = require("fs").promises;


module.exports.getDailyVerse = async()=> {
    // try {
    //     const data = await fs.readFile(`${__dirname}/../bible-data/verses.txt`, 'utf-8');
    //     const parseVerses = data.split(/\r?\n/).filter(line => line.trim() !== '');
    //     const verseIndex = Math.floor(Math.random() * parseVerses.length);
    //     const verseID = parseVerses[verseIndex];
    //     console.log(parseVerses);
    //     return verseID;
    // } catch (err) {
    //     console.error('Error reading file:', err);
    //     return []; // Return an empty array on error
    // }
    const data = await fs.readFile(`${__dirname}/../bible-data/verses.txt`, 'utf-8');
    const parseVerses = data.split(/\r?\n/).filter(line => line.trim() !== '');
    const verseIndex = Math.floor(Math.random() * parseVerses.length);
    const verseID = parseVerses[verseIndex];
    return verseID;

}