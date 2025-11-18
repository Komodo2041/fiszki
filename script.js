
const STATES = {
  STARTED: 'started',
  STOPPED: 'stopped',
  PAUSED: 'paused'
};

var maxFiszki = 20;

var memory = getAllMemo(maxFiszki)
if (!memory) {
  memory = getMemoStart(maxFiszki)
}
var badWords = getMemoBadWord();
console.log(badWords);

var data = {
  state: STATES.STOPPED,
  both: 1,
  duration: 20,
  hpart: 0,
  maxFiszki: maxFiszki,
  repeat: 1,
  showconf: 1,
  showmemory: 1,
  selectn: 0,
  words: [],
  word1: "",
  word2: "",
  diff: "",
  step: 0,
  nrword: 1,
  stepinstep: 0,
  tryb: 0,
  wordpl: "",
  wordeng: "",
  checwordpl: 0,
  checwordeng: 0,
  joinwords: [],
  joinwords2: [],
  joinwordcount: 5,
  disabledjoinwords: [],
  allWordsTryb: 0,
  showtranslatepl: [],
  showtranslateeng: [],
  sizeWorlds: 1,
  memory: memory
};


new Vue({
  el: '#app',
  data: data,
  methods: {
    changeList: function (n) {

      $.getJSON("fiszengpart/engpart" + (n) + ".json", function (words) {
        var items = [];
        data.words = words;
      });
      data.hpart = n;
    },
    backList: function () {
      data.hpart = 0;
      data.tryb = 0;
    },
    chT: function (t) {
      this.pause();
      data.tryb = t;

      if (t == 1 || t == 2) {
        var n = Math.floor(Math.random() * 500);
        data.word1 = data.words[n][0];
        data.word2 = data.words[n][1];
        this.rpomworlds();
      }
      if (t == 3) {
        data.joinwords = this.createRandomTable(data.joinwordcount);
        data.joinwords2 = this.shuffleArray(data.joinwords);
        data.disabledjoinwords = [];
      }
      if (t == 4 || t == 5) {
        this.quizstep();
      }
    },
    quizstep: function () {
      data.joinwords = this.createRandomTable(data.joinwordcount - 1);
      var n = Math.floor(Math.random() * 500);
      if (data.words[n][0].toLowerCase() == data.words[n][1].toLowerCase()) {
        var n = Math.floor(Math.random() * 500);
      }
      data.joinwords.push(n);
      data.joinwords = this.shuffleArray(data.joinwords);
      data.word1 = data.words[n][0];
      data.word2 = data.words[n][1];

    },
    createRandomTable: function (nr) {
      table = [];

      for (i = 0; i < nr; i++) {
        var n = Math.floor(Math.random() * 500);

        if (table.includes(n) || data.words[n][0].toLowerCase() == data.words[n][1].toLowerCase()) {
          i--;
        } else {

          table.push(n);
        }
      }
      return table;
    },
    checkQuiz: function (word, test) {
      if (test == 0) {
        var check = word == data.word2;
      } else {
        var check = word == data.word1;
      }
      if (check) {
        data.checwordpl = 1;
        this.quizstep();
        changeMemory(data.hpart, "quiz");
        data.memory[data.hpart]["quiz"]++;
      } else {
        saveBadWords(data.word1, data.word2)
        data.checwordpl = 2;
      }

      setTimeout(() => {
        data.checwordpl = 0;
      }, 500);

    },
    checkWordpl: function () {
      if (data.word2 == data.wordpl) {
        data.checwordpl = 1;
      } else {
        data.checwordpl = 2;
      }
    },
    rpomworlds: function () {
      data.checwordpl = 0;
      data.checwordeng = 0;
      data.wordpl = "";
      data.wordeng = "";
    },
    seeCorectlypl: function () {
      data.wordpl = data.word2;
      data.checwordpl = 1;
    },
    checkWordeng: function () {
      if (data.word1 == data.wordeng) {
        data.checwordeng = 1;
      } else {
        data.checwordeng = 2;
      }
    },
    seeCorectlyeng: function () {
      data.wordeng = data.word1;
      data.checwordeng = 1;
    },
    checkNextWord: function () {
      var n = Math.floor(Math.random() * 500);
      data.word1 = data.words[n][0];
      data.word2 = data.words[n][1];
      this.rpomworlds();
    },
    changeconf: function () {
      if (data.showconf) {
        data.showconf = 0;
      } else {
        data.showconf = 1
      }
    },
    start: function () {
      this.state = STATES.STARTED;
      this._tick();
      this._setword(this.nrword);
      this.interval = setInterval(this._tick, 50);
      this.diff = " - ";
    },
    pause: function () {
      this.state = STATES.PAUSED;
      clearInterval(this.interval);
    },
    stop: function () {
      this.state = STATES.STOPPED;
      clearInterval(this.interval);
      this.diff = "";
      this.word1 = "";
      this.word2 = "";
      this.step = 0;
      this.nrword = 1;
    },
    _tick: function () {

      this.step++;
      if (this.step >= this.duration) {
        this.step = 0;
        if (this.both) {
          this.nrword++;
        } else if (this.stepinstep == 1) {
          this.nrword++;
        }

        if (this.nrword >= 500) {
          if (this.repeat) {
            this.nrword = 0;
          } else {
            this.stop();
            alert("Zakończono");
            return;
          }
        }
        this._setword(this.nrword);
      }
    },
    _setword: function (nr) {
      if (this.both) {
        this.word1 = this.words[nr][0];
        this.word2 = this.words[nr][1];
      } else {
        if (this.stepinstep == 0) {
          this.word1 = this.words[nr][0];
          this.word2 = "";
          this.stepinstep = 1;
        } else {
          this.word2 = this.words[nr - 1][1];
          this.step--;
          this.stepinstep = 0;

        }
      }
      if (data.hpart) {
        changeMemory(data.hpart, "see");
        data.memory[data.hpart]["see"]++;
      }
    },
    selectWordOne: function (n) {
      data.selectn = n;
    },
    checkWordOne: function (n) {
      if (n == data.selectn) {
        data.disabledjoinwords.push(n);

        if (data.disabledjoinwords.length == data.joinwords.length) {
          data.joinwords = this.createRandomTable(data.joinwordcount);
          data.joinwords2 = this.shuffleArray(data.joinwords);
          data.disabledjoinwords = [];
          changeMemory(data.hpart, "join", data.joinwordcount);
          data.memory[data.hpart]["join"] += data.joinwordcount;
        }
      }
    },
    shuffleArray: function (tabela) {
      let tabs = [];
      let newTable = [];
      for (i = 0; i < data.joinwordcount; i++) {
        var n = Math.floor(Math.random() * data.joinwordcount);
        if (tabs.includes(n)) {
          i--;
        } else {
          tabs.push(n);
        }
      }
      for (i = 0; i < data.joinwordcount; i++) {
        newTable.push(table[tabs[i]]);
      }
      return newTable;
    },
    changeallworldstryb: function (n) {
      data.allWordsTryb = n;
    },
    showtranslation: function (nr, lang) {
      if (data.allWordsTryb != lang) {
        return;
      }
      if (lang == 1) {
        data.showtranslateeng.push(nr);
        setTimeout(function () {
          data.showtranslateeng.shift();
        }, 2000);
      }
      if (lang == 2) {
        data.showtranslatepl.push(nr);
        setTimeout(function () {
          data.showtranslatepl.shift();
        }, 2000);
      }

    }

  }
});
