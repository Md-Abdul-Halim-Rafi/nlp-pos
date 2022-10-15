const fs = require("fs");
const pos = require("pos");

const users = require("./data/caption_insta7.json");

const checkableTags = ["JJ", "NN", "NNP", "NNPS", "NNS", "RB", "VB", "VBG"];

const start = () => {

    const summarize = new Set();

    for (let i = 0; i < users.length; i++) {

        const user = users[i];
        const captions = user.captions;

        const modifiedCaptions = [];

        for (let j = 0; j < captions.length; j++) {

            const caption = captions[j].caption;

            const captionKeywords = new Set();

            const words = new pos.Lexer().lex(caption);
            const tagger = new pos.Tagger();
            const taggedWords = tagger.tag(words);

            for (k in taggedWords) {

                const taggedWord = taggedWords[k];
                const word = taggedWord[0].replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, "");
                let tag = taggedWord[1];

                if (word.length > 2 && checkableTags.includes(tag)) {

                    captionKeywords.add(word);
                }
            }

            if (captionKeywords.size === 0) {
                continue;
            }

            modifiedCaptions.push({
                id: captions[j].id,
                keywords: [...captionKeywords]
            });
        }

        const summary = {
            u_id: user.u_id,
            insta_id: user.insta_id,
            captions: modifiedCaptions,
        };

        summarize.add(summary);
        console.log(`User ${user.u_id} done`);
    }

    fs.writeFileSync("./data/summary7.json", JSON.stringify([...summarize], null, 4));
    console.log("Done");
}

start();