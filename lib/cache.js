class Cache {
    constructor() {
        this.dailyJazz = {};
        this.jazzCombo = {};
    }

    writeDailyJazz(date, move) {
        this.dailyJazz = {};
        this.dailyJazz[date] = move;
    }

    writeJazzCombo(date, combo) {
        this.jazzCombo = {};
        this.jazzCombo[date] = combo;
    }

    getCache() {
        return {
            dailyJazz: this.dailyJazz,
            jazzCombo: this.jazzCombo
        };
    }
}

module.exports = Cache;
