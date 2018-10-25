define([], function() {
    class GamepadHandler {
        constructor() {
            this.listen();
            this.listeners = [];
            this.xboxMap = {};
            this.axisSafeZone = .2;
            this.lo = true;
        }
        listen() {
            window.addEventListener("gamepadconnected", this.update.bind(this));
        }

        onInput(cb) {
            this.listeners[0] = cb;
        }

        getAxeLength(length) {
            return Math.abs(length) > this.axisSafeZone ? length : 0;
        }

        getTriggers(g) {
            if(g.buttons[7].pressed || g.buttons[6].pressed) {
                return {l: g.buttons[6].value, r: g.buttons[7].value}
            }
            return false;
        }

        getAxes(g) {
            return {
                l: [this.getAxeLength(g.axes[0]), this.getAxeLength(g.axes[1])],
                r: [this.getAxeLength(g.axes[2]), this.getAxeLength(g.axes[3])]
            };
        }

        triggerEvents(config) {
            for(let i = 0; i < this.listeners.length; i++) {
                this.listeners[i](config)
            }
        }

        update() {
            requestAnimationFrame(this.update.bind(this));
            let gamepads = navigator.getGamepads();
            if (!gamepads || !gamepads[0])
                return;
            let g = gamepads[0];
            let config = {};
            let trigger = false;
            if(config.axes = this.getAxes(g)) {
                trigger = true;
            }
            if(config.a = g.buttons[0].pressed) {
                trigger = true
            }
            if(config.b = g.buttons[1].pressed) {
                trigger = true
            }
            config.triggers = this.getTriggers(g) || {};
            if(config.triggers) {
                trigger = true;
            }

            if(trigger) {
                this.triggerEvents(config);
            }
        }
    }
    return GamepadHandler;
});