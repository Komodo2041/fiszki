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