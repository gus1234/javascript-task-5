'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
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
            subscribering(subscribers, event, context, handler, Infinity, 1);

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            let events = [];
            if (subscribers.hasOwnProperty(event)) {
                events.push(event);
            }
            for (let name of Object.keys(subscribers)) {
                if (name.indexOf(event) === 0 && events.length > 0) {
                    events.push(name);
                }
            }
            for (let _event of events) {
                subscribers[_event].students = subscribers[_event].students
                    .filter(element => element.student !== context);
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
                    subscribers[item].count += 1;
                    subscribers[item].students.forEach(function (element) {
                        let number = 1 +
                            Math.floor(subscribers[item].count / element.frequency) *
                                element.frequency;
                        if (element.count > 0 && (element.frequency === 1 ||
                            number === subscribers[item].count)) {
                            element.handler.call(element.student);
                            element.count -= 1;
                        }
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
         * @returns {Object}
         */
        several: function (event, context, handler, times) {
            times = times <= 0 ? Infinity : times;
            subscribering(subscribers, event, context, handler, times, 1);

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} _frequency – как часто уведомлять
         * @returns {Object}
         */
        through: function (event, context, handler, _frequency) {
            _frequency = _frequency <= 0 ? 1 : _frequency;
            subscribering(subscribers, event, context, handler, Infinity, _frequency);

            return this;
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

function subscribering(...parameters) {
    let subscribers;
    let event;
    let context;
    let _handler;
    let _count;
    let _frequency;
    [subscribers, event, context, _handler, _count, _frequency] = parameters;
    if (subscribers.hasOwnProperty(event)) {
        subscribers[event].students.push({
            student: context,
            handler: _handler,
            count: _count,
            frequency: _frequency });
    } else {
        subscribers[event] = {
            count: 0,
            students: [{
                student: context,
                handler: _handler,
                count: _count,
                frequency: _frequency }] };
    }
}
