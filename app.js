const MESSAGE = {
    REQUEST: 0,
    PRIVILEGE: 1
}

class Message {
    constructor(initator, type) {
        this.initator = initator;
        this.type = type;
    }
}

class Node {
    constructor(id) {
        this.id = id;
        this.last = 0;
        this.next = 0;
        this.holding = false;
    }

    requestToken() {
        if (this.last !== 0) {
            this.last.receive(this, new Message(this, MESSAGE.REQUEST));
            this.last = 0;
        }
    }

    EnterCS() {
        if (this.holding) {
            console.log(this.id + ' in inside cs');

            if (this.next !== 0) {
                this.next.receive(this, new Message(this, MESSAGE.PRIVILEGE));
            }
        } else {
            this.requestToken();
        }
    }

    // message: Message
    receive(from, message) {
        console.log('[' + this.id + ' RECEIVE]: from ' + from.id + ' type: ' + message.type)
        if (message.type === MESSAGE.REQUEST) {
            if (this.last !== 0) {
                this.last.receive(this, message);
                this.last = from;
            } else {
                this.next = message.initator;
                this.last = from;

                if (this.holding === true) {
                    this.next.receive(this, new Message(this, MESSAGE.PRIVILEGE));
                    this.holding = false;
                    this.next = 0;
                }
            }
        } else {
            this.holding = true;
            this.EnterCS();
        }
    }
}

var node1 = new Node(1);
var node2 = new Node(2);
var node3 = new Node(3);
var node4 = new Node(4);
var node5 = new Node(5);
node5.holding = true;

node1.last = node2;
node2.last = node3;
node3.last = node4;
node4.last = node5;

var node6 = new Node(6);
node6.last = node5;

node3.EnterCS();

setTimeout(() => {
    node6.EnterCS();
}, 1000);