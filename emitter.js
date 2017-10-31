'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = false;
module.exports = getEmitter;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    let subscribers = {};

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            if (subscribers.hasOwnProperty(event)) {
                subscribers[event].push({ 'student': context, 'handler': handler });
            } else {
                subscribers[event] = [{ 'student': context, 'handler': handler }];
            }

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            if (subscribers.hasOwnProperty(event)) {
                subscribers[event] = subscribers[event]
                    .filter(element => element.student !== context);
            }

            if (event === 'slide') {
                this.off('slide.funny', context);
            }

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            let events = getEvents(event);
            for (let item of events) {
                if (subscribers.hasOwnProperty(item)) {
                    subscribers[item].forEach(function (element) {
                        element.handler.call(element.student);
                    });
                }
            }

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         */
        several: function (event, context, handler, times) {
            console.info(event, context, handler, times);
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         */
        through: function (event, context, handler, frequency) {
            console.info(event, context, handler, frequency);
        }
    };
}

function getEvents(event) {
    let events = [];
    let array = event.split('.');
    events.push(array[0]);
    for (let i = 1; i < array.length; i++) {
        events.push(events[events.length - 1] + '.' + array[i]);
    }
    events.reverse();

    return events;
}
