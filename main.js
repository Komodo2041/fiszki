function getMemoStart(nr) {

    data = [];
    for (i = 1; i <= nr; i++) {
        key = "mem_" + i;
        let zero = {
            "quiz": 0,
            "join": 0,
            "see": 0
        };
        data[i] = zero
        localStorage.setItem(key, JSON.stringify(zero));
    }
    return data;
}

function getAllMemo(nr) {
    mem = localStorage.getItem("mem_1");
    if (mem) {
        data = [];
        for (i = 1; i <= nr; i++) {
            key = "mem_" + i;

            data[i] = JSON.parse(localStorage.getItem(key))
        }
        return data;
    }
    return null;
}

function changeMemory(nr, name, count = 1) {
    key = "mem_" + nr
    mem = JSON.parse(localStorage.getItem(key), true);
    if (mem) {
        mem[name] += count;
        localStorage.setItem(key, JSON.stringify(mem));
    }
}

function saveBadWords(word1, word2) {
    let word = [word1, word2];
    words = JSON.parse(localStorage.getItem("bad_words"));
    isInList = false;
    for (i = 0; i < words.length; i++) {
        if (words[i][0] == word1) {
            isInList = true;
            break;
        }
    }
    if (!isInList) {
        words.push(word);
        localStorage.setItem("bad_words", JSON.stringify(words));
        return true;
    } else {
        return false;
    }
}

function getBadWords() {
    words = JSON.parse(localStorage.getItem("bad_words"));
    return words;
}

function getMemoBadWord() {
    words = JSON.parse(localStorage.getItem("bad_words"));
    if (!words) {

        localStorage.setItem("bad_words", JSON.stringify([]));
        return [];
    }
    return words;
}

function clearBadWords() {

    localStorage.setItem("bad_words", JSON.stringify([]));
    return [];
}