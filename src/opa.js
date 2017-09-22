class Opa {
    constructor(item) {
        this.item = item;
        this.id = item.id;
        this.isLoaded = false;
        this.delay = 200;
    }

    appearAfter(item) {
        this.after = item;

        return this;
    }

    async appear() {
        if (this.after) {
            return this.after.appear()
                .then(() => timeout(this.delay))
                .then(() => this.appearNow())
        } else {
            return this.appearNow();
        }
    }

    async appearNow() {
        if (this.isLoaded) {
            if (this.__appear) return this.__appear;

            this.__appear = opaAppear(this.item)
                .then(item => this.__clear());
            return this.__appear;
        }

        return elementLoaded(this.item)
            .then(() => {
                this.isLoaded = true;
                return this.appearNow();
            });
    }

    __clear() {
        delete this['__appear'];
        return this;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const groups = splitGroups(
        [...document.querySelectorAll('.opa')]
    );

    console.log(groups)

    groups.map(initOpaGroup);
});

function splitGroups(items) {
    const groups = [];

    while (items.length) {
        const i = items.shift();
        const group = [i];

        const afterId = i.dataset.after;
        if (afterId) {
            const after = document.getElementById(afterId);
            if (after) {
                const afterIndex = items.indexOf(after);
                if(afterIndex > -1){
                    group.unshift(items[afterIndex]);

                    items.splice(afterIndex, 1);
                }
            }
        }

        groups.push(group);
    }

    return groups;
}

function initOpaGroup(items) {
    return items
        .map(item => new Opa(item))
        .map((item, i, items) => {
            const prev = i > 0
                ? items[i - 1]
                : null;
            return prev
                ? item.appearAfter(prev)
                : item;
        })
        .map(x => {
            return x.appear();
        });
}

async function runAppear(item) {
    item.classList.add('opa--visible');
    return timeout(500, item)
        .then(item => {
            item.dataset.opaAppeared = true;
            item.classList.remove('opa--visible');
            item.classList.remove('opa');
            return item;
        });
}

async function opaAppear(item) {
    if (item.dataset.opaAppeared) return Promise.resolve(item);
    if (item.classList.contains('opa--visible')) return Promise.resolve(item);

    // noinspection JSIgnoredPromiseFromCall
    runAppear(item);
}

async function elementLoaded(element) {
    return isImageLoaded(element)
        ? Promise.resolve(element)
        : new Promise((resolve) => {
            element.addEventListener('load', () => {
                resolve(element);
            });
        });
}


function isImageLoaded(img) {
    if (!img.complete) return false;
    if (typeof img.naturalWidth !== 'undefined' && img.naturalWidth === 0) return false;

    // loaded
    return true;
}

async function timeout(time, ...args) {
    return new Promise(resolve => {
        setTimeout(resolve, time, ...args);
    });
}
